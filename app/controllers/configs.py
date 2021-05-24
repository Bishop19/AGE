from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import app, db
from app.controllers.errors import error_response
from app.models.config import Config
from app.models.endpoint import Endpoint
from app.models.user import User
from app.models.cloud import Cloud


@app.route("/configurations", methods=["GET"])
@jwt_required()
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
@jwt_required()
def create_config():
    # Check user
    user_id = get_jwt_identity()["id"]

    # Check request data
    data = request.get_json() or {}

    endpoints = data.get("endpoints", None)

    if not endpoints or len(endpoints) == 0:
        return error_response(400, "No endpoints provided")

    gateways = data.get("gateways", None)

    if not gateways or len(gateways) == 0:
        return error_response(400, "No gateways provided")

    cloud_ids = data.get("clouds", None)

    if not cloud_ids:
        return error_response(400, "No clouds provided")

    # Create config and endpoints
    config = Config(gateways=gateways, user_id=user_id)

    for endpoint_data in endpoints:
        try:
            endpoint = Endpoint(
                path=endpoint_data["path"],
                method=endpoint_data["method"].upper(),
                params=endpoint_data.get("params", None),
                payload=endpoint_data.get("payload", None),
            )
            config.endpoints.append(endpoint)
        except:
            db.session.rollback()
            return error_response(400, "Wrong endpoint parameters provided")

    for cloud_id in cloud_ids:
        try:
            cloud = Cloud.query.get(cloud_id)
            if not cloud or cloud.user_id != user_id:
                raise Exception()
            config.clouds.append(cloud)
        except:
            db.session.rollback()
            return error_response(400, "Wrong cloud ids provided")

    db.session.add(config)
    db.session.commit()

    return jsonify(config.to_dict())


@app.route("/configurations/<int:config_id>", methods=["GET"])
@jwt_required()
def get_config(config_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    return jsonify(config.to_dict())


# @app.route("/configurations/<int:config_id>", methods=["POST"])
# @jwt_required()
# def edit_config(config_id):
#     data = request.get_json() or {}

#     # TODO

#     return f"edit config {config_id}"
