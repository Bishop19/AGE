from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models.cloud import Cloud, Provider
from app.models.user import User
from app.controllers.clouds import bp
from app.controllers.util.errors import error_response
from app.controllers.util.decorators import validate_user


@bp.route("/clouds", methods=["GET"])
@validate_user()
def get_clouds():
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    res = []
    clouds = user.clouds.all()

    for cloud in clouds:
        res.append(cloud.to_dict())

    return jsonify(res)


@bp.route("/clouds", methods=["POST"])
@validate_user()
def create_cloud():
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    data = request.get_json() or {}

    name = data.get("name", None)

    if not name:
        return error_response(400, "No name provided")

    key = data.get("key", None)

    if not key:
        return error_response(400, "No key provided")

    provider = data.get("provider", None)

    if not provider:
        return error_response(400, "No provider provided")

    region = data.get("region", None)

    if not region:
        return error_response(400, "No region provided")

    provider = Provider(name=provider.upper(), credentials=key, region=region)
    cloud = Cloud(name=name, provider=provider)
    user.clouds.append(cloud)

    db.session.add(user)
    db.session.commit()

    return jsonify(cloud.to_dict())


@bp.route("/clouds/<int:cloud_id>", methods=["GET"])
@validate_user()
def get_cloud(cloud_id):
    user_id = get_jwt_identity()["id"]

    cloud = Cloud.query.get(cloud_id)

    if not cloud:
        return error_response(404, "Cloud not found")

    if cloud.user_id != user_id:
        return error_response(401, "Unauthorized")

    return jsonify(cloud.to_dict())


# @bp.route("/clouds/<int:cloud_id>", methods=["POST"])
# @validate_user()
# def edit_cloud(cloud_id):
#     data = request.get_json() or {}

#     # TODO

#     return f"edit cloud {cloud_id}"
