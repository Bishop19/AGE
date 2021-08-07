import re
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
    endpoints = {}

    for endpoint in config.endpoints:
        first_path = endpoint.path[1:].partition("/")[0]
        endpoint.uri = re.sub(r"\{(.*?)\}", r'$(uri_captures["\1"])', endpoint.path)
        endpoint.path = re.sub(r"\{(.*?)\}", r"(?<\1>" + "[^/]+)", endpoint.path)
        if first_path in endpoints:
            endpoints[first_path].append(endpoint)
        else:
            endpoints[first_path] = [endpoint]

    return endpoints


def get_kong_config(config_id):
    config = Config.query.get(config_id)
    endpoints = transform_endpoints(config)

    template = env.get_template("kong.yml.j2")

    kong = template.render(config=config.to_dict(), endpoints=endpoints)

    return kong


def get_tyk_config(config_id):
    config = Config.query.get(config_id)

    template = env.get_template("tyk.json.j2")

    tyk = template.render(config.to_dict())

    return tyk
