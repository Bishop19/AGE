import os
import time
import threading
from google.oauth2 import service_account
import googleapiclient.discovery
from app import create_app, db
from app.models.config import Config
from app.models.cloud import Instance
from app.controllers.configs.providers.deploy import Provider
import app.controllers.util.templates as templates


class GCP(Provider):
    def load_startup_script_krakend(self):
        return open(
            os.path.join(
                os.path.dirname(__file__), "scripts/gcp/startup-script-krakend.sh"
            ),
            "r",
        ).read()

    def load_krakend(self, config_id):
        return templates.get_krakend_config(config_id)

    def load_startup_script_kong(self):
        return open(
            os.path.join(
                os.path.dirname(__file__), "scripts/gcp/startup-script-kong.sh"
            ),
            "r",
        ).read()

    def load_kong(self, config_id):
        return templates.get_kong_config(config_id)

    def load_startup_script_tyk(self):
        return open(
            os.path.join(
                os.path.dirname(__file__), "scripts/gcp/startup-script-tyk.sh"
            ),
            "r",
        ).read()

    def load_tyk(self, config_id):
        return templates.get_tyk_configs(config_id)

    def create_tyk_vars(self, config_id):
        variables = []

        variables.append(
            {"key": "startup-script", "value": self.load_startup_script_tyk()}
        )
        files = self.load_tyk(config_id)

        for index, file in enumerate(files):
            variables.append({"key": f"tyk-config-{index}", "value": file})

        variables.append({"key": "tyk-total-files", "value": len(files)})

        return variables

    def create_instance(self, compute, project, zone, config_id, gateway, machine_type):
        # Get Ubuntu image.
        image_response = (
            compute.images()
            .getFromFamily(
                project="ubuntu-os-cloud", family="ubuntu-minimal-1604-xenial-v20210430"
            )
            .execute()
        )
        source_disk_image = image_response["selfLink"]

        # Configure the machine
        machine_type = f"zones/{zone}/machineTypes/{machine_type}"

        config = {
            "name": f"instance-{config_id}-{gateway.lower()}",
            "machineType": machine_type,
            # Specify the boot disk and the image to use as a source.
            "disks": [
                {
                    "boot": True,
                    "autoDelete": True,
                    "initializeParams": {
                        "sourceImage": source_disk_image,
                    },
                }
            ],
            # Specify a network interface with NAT to access the public
            # internet.
            "networkInterfaces": [
                {
                    "network": "global/networks/default",
                    "accessConfigs": [
                        {"type": "ONE_TO_ONE_NAT", "name": "External NAT"}
                    ],
                }
            ],
            # Allow the instance to access cloud storage and logging.
            "serviceAccounts": [
                {
                    "email": "default",
                    "scopes": [
                        "https://www.googleapis.com/auth/devstorage.read_write",
                        "https://www.googleapis.com/auth/logging.write",
                    ],
                }
            ],
            # Metadata is readable from the instance and allows you to
            # pass configuration from deployment scripts to instances.
            # Startup script is automatically executed by the
            # instance upon startup.
            "metadata": {
                "items": [
                    {
                        "key": "startup-script",
                        "value": self.load_startup_script_krakend(),
                    },
                    {"key": "krakend-config", "value": self.load_krakend(config_id)},
                ]
                if gateway == "KRAKEND"
                else [
                    {"key": "startup-script", "value": self.load_startup_script_kong()},
                    {"key": "kong-config", "value": self.load_kong(config_id)},
                ]
                if gateway == "KONG"
                else self.create_tyk_vars(config_id)
            },
            "tags": {
                "items": ["http-server", "https-server", "krakend", "kong", "tyk"]
            },
        }

        return (
            compute.instances()
            .insert(project=project, zone=zone, body=config)
            .execute()
        )

    def add_instance(self, config, instance):
        config.instances.append(instance)

        db.session.add(config)
        db.session.commit()

    def create_firewall_rules(self, compute, project):
        try:
            compute.firewalls().insert(
                project=project,
                body={
                    "name": "krakend",
                    "description": "Opens port 8081",
                    "sourceRanges": ["0.0.0.0/0"],
                    "targetTags": ["krakend"],
                    "allowed": [{"IPProtocol": "tcp", "ports": ["8081"]}],
                },
            ).execute()

            compute.firewalls().insert(
                project=project,
                body={
                    "name": "kong",
                    "description": "Opens port 8082",
                    "sourceRanges": ["0.0.0.0/0"],
                    "targetTags": ["kong"],
                    "allowed": [{"IPProtocol": "tcp", "ports": ["8082"]}],
                },
            ).execute()

            compute.firewalls().insert(
                project=project,
                body={
                    "name": "tyk",
                    "description": "Opens port 8083",
                    "sourceRanges": ["0.0.0.0/0"],
                    "targetTags": ["tyk"],
                    "allowed": [{"IPProtocol": "tcp", "ports": ["8083"]}],
                },
            ).execute()
        except:
            pass
            # TODO

    def wait_for_operation(self, compute, project, zone, operation, config, gateway):
        print("Waiting for operation to finish...")
        while True:
            result = (
                compute.zoneOperations()
                .get(project=project, zone=zone, operation=operation)
                .execute()
            )

            if result["status"] == "DONE":
                if "error" in result:
                    raise Exception(result["error"])

                print(f"Deployment of {gateway.lower()} done.")

                instance = (
                    compute.instances()
                    .get(
                        project=project,
                        zone=zone,
                        instance=f"instance-{config.id}-{gateway.lower()}",
                    )
                    .execute()
                )

                instance = Instance(
                    id=instance["id"],
                    ip=instance["networkInterfaces"][0]["accessConfigs"][0]["natIP"],
                    name=instance["name"],
                    gateway=gateway,
                )

                self.add_instance(config, instance)

                return result

            time.sleep(1)

    def cloud_operations(
        self, compute, project, zone, config_id, gateways, machine_type
    ):
        with create_app().app_context():
            print("Cloud operations started")
            config = Config.query.get(config_id)

            self.create_firewall_rules(compute, project)

            for gateway in gateways:
                operation = self.create_instance(
                    compute, project, zone, config_id, gateway, machine_type
                )
                self.wait_for_operation(
                    compute, project, zone, operation["name"], config, gateway
                )
            config.cloud.is_deployed = True  # TODO : set false on delete
            db.session.add(config)
            db.session.commit()

        print("Cloud operations finished")

    def deploy(self, project, zone, account, config, gateways, machine_type):
        credentials = service_account.Credentials.from_service_account_info(account)
        compute = googleapiclient.discovery.build(
            "compute", "v1", credentials=credentials
        )

        thread = threading.Thread(
            target=self.cloud_operations,
            args=(compute, project, zone, config, gateways, machine_type),
        )
        thread.start()


# TODO: VERIFY IF INSTANCES EXIST
