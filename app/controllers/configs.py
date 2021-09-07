from app.controllers.providers.gcp import GCP
from app.controllers.providers.deploy import Deploy
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app import app, db
from app.models.config import Config, ConfigCloud
from app.models.endpoint import Endpoint
from app.models.user import User
from app.models.cloud import Cloud
from app.controllers.util.decorators import validate_user, check_config_ownership
from app.controllers.util.errors import error_response


@app.route("/configurations", methods=["GET"])
@validate_user()
def get_configs():
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    # Get configs
    res = []
    configs = user.configs.all()

    for config in configs:
        res.append(config.to_dict())

    return jsonify(res)


@app.route("/configurations", methods=["POST"])
@validate_user()
def create_config():
    # Check user
    user_id = get_jwt_identity()["id"]

    # Check request data
    data = request.get_json() or {}

    name = data.get("name", None)

    if not name:
        return error_response(400, "No name provided")

    endpoints = data.get("endpoints", None)

    if not endpoints or len(endpoints) == 0:
        return error_response(400, "No endpoints provided")

    gateways = data.get("gateways", None)

    if not gateways or len(gateways) == 0:
        return error_response(400, "No gateways provided")

    cloud_id = data.get("cloud", None)

    if not cloud_id:
        return error_response(400, "No cloud provided")

    # Create config and endpoints
    config = Config(
        name=name,
        gateways=[gateway.upper() for gateway in gateways],
        user_id=user_id,
    )

    for endpoint_data in endpoints:
        try:
            endpoint = Endpoint(
                base_path=endpoint_data["base_path"],
                endpoint_path=endpoint_data["endpoint_path"],
                method=endpoint_data["method"].upper(),
                query_params=endpoint_data.get("query_params", None),
                path_params=endpoint_data.get("path_params", None),
                body_params=endpoint_data.get("body_params", None),
                security=endpoint_data.get("security", "NONE"),
            )
            config.endpoints.append(endpoint)
        except:
            db.session.rollback()
            return error_response(400, "Wrong endpoint parameters provided")

    try:
        cloud = Cloud.query.get(cloud_id)
        if not cloud or cloud.user_id != user_id:
            raise Exception()
        config.cloud = ConfigCloud(cloud_id=cloud_id)
    except:
        db.session.rollback()
        return error_response(400, "Wrong cloud provided")

    db.session.add(config)
    db.session.commit()

    return jsonify(config.to_dict())


@app.route("/configurations/<int:config_id>", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_config(config_id):
    # Get config
    config = Config.query.get(config_id)

    return jsonify(config.to_dict())


# @app.route("/configurations/<int:config_id>", methods=["POST"])
# @validate_user()
# def edit_config(config_id):
#     data = request.get_json() or {}

#     # TODO

#     return f"edit config {config_id}"


@app.route("/configurations/<int:config_id>/deploy", methods=["POST"])
@validate_user()
@check_config_ownership()
def deploy_gateways(config_id):
    # Get config
    config = Config.query.get(config_id)

    deploy = Deploy(GCP())
    deploy.deploy(
        "api-gateway-picker",
        "europe-west4-a",
        config.cloud.credentials,
        config.id,
        config.gateways,
    )

    return jsonify(config.to_dict())
