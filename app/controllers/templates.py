import re
from flask import jsonify, request, Response
from flask_jwt_extended import get_jwt_identity
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app import app, db
from app.models.config import Config
from app.controllers.util.decorators import validate_user, check_config_ownership
from app.controllers.util.errors import error_response

# Create Jinja2 Environment
env = Environment(
    loader=FileSystemLoader("./app/templates"),
    autoescape=select_autoescape(enabled_extensions=("json")),
)


@app.route("/configurations/<int:config_id>/krakend", methods=["GET"])
# @validate_user()
# @check_config_ownership()
def get_krakend_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    if "KRAKEND" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    template = env.get_template("krakend.json.j2")

    krakend = template.render(config.to_dict())

    return Response(
        krakend,
        mimetype="text/json",
        headers={"Content-disposition": "attachment; filename=krakend.json"},
    )


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


@app.route("/configurations/<int:config_id>/kong", methods=["GET"])
# @validate_user()
# @check_config_ownership()
def get_kong_config(config_id):
    # Get config
    config = Config.query.get(config_id)
    endpoints = transform_endpoints(config)

    if "KONG" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    template = env.get_template("kong.yml.j2")

    kong = template.render(config=config.to_dict(), endpoints=endpoints)

    return Response(
        kong,
        mimetype="text/yaml",
        headers={"Content-disposition": "attachment; filename=kong.yml"},
    )


@app.route("/configurations/<int:config_id>/tyk", methods=["GET"])
# @validate_user()
# @check_config_ownership()
def get_tyk_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    if "TYK" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    template = env.get_template("tyk.json.j2")

    krakend = template.render(config.to_dict())

    return Response(
        krakend,
        mimetype="text/json",
        headers={"Content-disposition": "attachment; filename=tyk.json"},
    )
