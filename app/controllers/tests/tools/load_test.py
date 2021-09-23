import os
import time
import json
import threading
from abc import ABC, abstractmethod
from google.oauth2 import service_account
import googleapiclient.discovery


class Tool(ABC):
    @abstractmethod
    def get_startup_script(self):
        pass

    @abstractmethod
    def prepare_test_file(self, test_file, ip):
        pass


class LoadTest:
    def __init__(
        self, tool: Tool, test_file, token, config_id, test_id, instances
    ) -> None:
        self._tool = tool
        self.test_file = test_file
        self.token = token
        self.config_id = config_id
        self.test_id = test_id
        self.instances = instances

    @property
    def tool(self) -> Tool:
        return self._tool

    @tool.setter
    def tool(self, tool: Tool) -> None:
        self._tool = tool

    def __wait_for_operation(self, compute, project, zone, operation):
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

                print(f"Deployment of testing instance done.")

                return

            time.sleep(1)

    def __create_instance(self, compute, project, zone, startup_script):
        # Get Ubuntu image.
        image_response = (
            compute.images()
            .getFromFamily(project="ubuntu-os-cloud", family="ubuntu-1604-lts")
            .execute()
        )
        source_disk_image = image_response["selfLink"]

        # Configure the machine
        machine_type = (
            "zones/%s/machineTypes/n2-standard-2" % zone
        )  # TODO : change machine type

        config = {
            "name": "load-tester-" + str(self.config_id) + "-" + str(self.test_id),
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
            "metadata": {"items": self.__get_metadata_items(startup_script)},
            "tags": {"items": ["http-server", "https-server"]},
        }

        return (
            compute.instances()
            .insert(project=project, zone=zone, body=config)
            .execute()
        )

    def __get_metadata_items(self, startup_script):
        items = [
            {
                "key": "startup-script",
                "value": startup_script,
            },
            {"key": "token", "value": self.token},
            {"key": "config_id", "value": self.config_id},
            {"key": "test_id", "value": self.test_id},
        ]

        for instance in self.instances:
            items.append(
                {
                    "key": f"test-file-{instance.gateway.lower()}",
                    "value": self._tool.prepare_test_file(self.test_file, instance.ip),
                }
            )

        return items

    def __cloud_operations(self, compute, project, zone, startup_script):
        print("Cloud operations started")

        # self.create_firewall_rules(compute, project)

        operation = self.__create_instance(compute, project, zone, startup_script)
        self.__wait_for_operation(compute, project, zone, operation["name"])

        print("Cloud operations finished")

    def deploy(self):
        project = os.getenv("CLOUD_PROJECT")
        zone = os.getenv("CLOUD_ZONE")
        account = json.load(
            open(
                os.getenv("CLOUD_CREDENTIALS"),
                "r",
            )
        )

        startup_script = self._tool.get_startup_script()

        credentials = service_account.Credentials.from_service_account_info(account)
        compute = googleapiclient.discovery.build(
            "compute", "v1", credentials=credentials
        )

        thread = threading.Thread(
            target=self.__cloud_operations,
            args=(compute, project, zone, startup_script),
        )
        thread.start()
