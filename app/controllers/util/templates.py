import re
import zipfile
import io
import time
import copy
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.models.config import Config

# Create Jinja2 Environment
env = Environment(
    loader=FileSystemLoader("./app/templates"),
    autoescape=select_autoescape(enabled_extensions=("json")),
)


def get_krakend_config(config_id):
    config = Config.query.get(config_id)

    template = env.get_template("krakend.json.j2")

    krakend = template.render(config.to_dict())

    return krakend


def transform_endpoints(config):
    endpoints = []

    for endpoint in config.endpoints:
        endp = copy.deepcopy(endpoint)
        endp.uri = re.sub(r"\{(.*?)\}", r'$(uri_captures["\1"])', endp.endpoint_path)
        endp.endpoint_path = re.sub(
            r"\{(.*?)\}", r"(?<\1>" + "[^/]+)", endp.endpoint_path
        )

        endpoints.append(endp)

    return endpoints


def get_kong_config(config_id):
    config = Config.query.get(config_id)

    endpoints = transform_endpoints(config)

    template = env.get_template("kong.yml.j2")

    kong = template.render(config=config.to_dict(), endpoints=endpoints)

    return kong


def group_by_host_and_first_path(config):
    # dict(host, dict(first_path, endpoint))
    hosts = {}

    for endpoint in config.endpoints:
        first_path = "/" + endpoint.endpoint_path[1:].partition("/")[0]
        host = hosts.get(endpoint.base_path, {first_path: []})
        host[first_path] = host.get(first_path, []) + [endpoint]
        hosts[endpoint.base_path] = host

    return hosts


def generate_config_files(hosts):
    files = []
    template = env.get_template("tyk.json.j2")

    for host, first_path in hosts.items():
        for listen_path, endpoints in first_path.items():
            files.append(
                template.render(host=host, listen_path=listen_path, endpoints=endpoints)
            )

    return files


def generate_zip(files):
    folder = io.BytesIO()

    with zipfile.ZipFile(folder, "w") as zf:
        for index, file in enumerate(files):
            data = zipfile.ZipInfo(f"host-{index}.json")
            data.date_time = time.localtime(time.time())[:6]
            data.compress_type = zipfile.ZIP_DEFLATED
            zf.writestr(data, file)

    folder.seek(0)

    return folder


def get_tyk_configs_zip(config_id):
    config = Config.query.get(config_id)

    endpoints_by_hosts = group_by_host_and_first_path(config)

    files = generate_config_files(endpoints_by_hosts)

    tyk = generate_zip(files)

    return tyk


def get_tyk_configs(config_id):
    config = Config.query.get(config_id)

    endpoints_by_hosts = group_by_host_and_first_path(config)

    files = generate_config_files(endpoints_by_hosts)

    return files
