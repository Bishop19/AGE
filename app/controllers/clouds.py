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

    if not user:
        return error_response(401, "Unauthorized")

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

    if not user:
        return error_response(401, "Unauthorized")

    cloud = Cloud()
    user.cloud.append(cloud)

    db.session.add(user)
    db.session.commit()

    return jsonify(cloud.to_dict())


@app.route("/clouds/<int:cloud_id>", methods=["GET"])
@jwt_required()
def get_cloud(cloud_id):
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    cloud = Cloud.query.get(cloud_id)

    if not cloud:
        return error_response(404, "Cloud not found")

    if cloud.user_id != user_id:
        return error_response(401, "Unauthorized")

    return jsonify(cloud.to_dict())


@app.route("/clouds/<int:cloud_id>", methods=["POST"])
@jwt_required()
def edit_cloud(cloud_id):
    data = request.get_json() or {}

    # TODO

    return f"edit cloud {cloud_id}"
