from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import app, db
from app.controllers.errors import error_response
from app.models.cloud import Cloud
from app.models.user import User


@app.route("/clouds", methods=["GET"])
@jwt_required()
def get_clouds():
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    res = []
    clouds = user.clouds.all()

    for cloud in clouds:
        res.append(cloud.to_dict())

    return jsonify(res)


@app.route("/clouds", methods=["POST"])
@jwt_required()
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

    cloud = Cloud(name=name, key=key, provider=provider.upper())
    user.clouds.append(cloud)

    db.session.add(user)
    db.session.commit()

    return jsonify(cloud.to_dict())


@app.route("/clouds/<int:cloud_id>", methods=["GET"])
@jwt_required()
def get_cloud(cloud_id):
    user_id = get_jwt_identity()["id"]

    cloud = Cloud.query.get(cloud_id)

    if not cloud:
        return error_response(404, "Cloud not found")

    if cloud.user_id != user_id:
        return error_response(401, "Unauthorized")

    return jsonify(cloud.to_dict())


# @app.route("/clouds/<int:cloud_id>", methods=["POST"])
# @jwt_required()
# def edit_cloud(cloud_id):
#     data = request.get_json() or {}

#     # TODO

#     return f"edit cloud {cloud_id}"
