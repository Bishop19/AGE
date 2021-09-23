from flask import Response
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.models.config import Config
from app.controllers.templates import bp
from app.controllers.util.decorators import validate_user, check_config_ownership
from app.controllers.util.errors import error_response
import app.controllers.util.templates as templates

# Create Jinja2 Environment
env = Environment(
    loader=FileSystemLoader("./app/templates"),
    autoescape=select_autoescape(enabled_extensions=("json")),
)


@bp.route("/configurations/<int:config_id>/krakend", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_krakend_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    if "KRAKEND" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    krakend = templates.get_krakend_config(config_id)

    return Response(
        krakend,
        mimetype="text/json",
        headers={"Content-disposition": "attachment; filename=krakend.json"},
    )


@bp.route("/configurations/<int:config_id>/kong", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_kong_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    if "KONG" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    kong = templates.get_kong_config(config_id)

    return Response(
        kong,
        mimetype="text/yaml",
        headers={"Content-disposition": "attachment; filename=kong.yml"},
    )


@bp.route("/configurations/<int:config_id>/tyk", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_tyk_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    if "TYK" not in config.gateways:
        return error_response(403, "Gateway not valid for the current configuration")

    tyk = templates.get_tyk_configs_zip(config_id)

    return Response(
        tyk,
        headers={
            "Content-disposition": "attachment; filename=tyk.zip",
            "Content-Type": "zip",
        },
    )
