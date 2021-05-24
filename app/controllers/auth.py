from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app import app, db
from app.controllers.util.errors import error_response
from app.models.user import User


@app.route("/auth", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", None)
    password = data.get("password", None)

    if not email:
        return error_response(400, "No email provided")

    if not password:
        return error_response(400, "No password provided")

    user = User.query.filter_by(email=email).one_or_none()

    if not user:
        return error_response(401, "Wrong credentials")

    if not user.check_password(password):
        return error_response(401, "Wrong credentials")

    access_token = create_access_token(identity=user.to_dict())

    return jsonify(access_token=access_token), 200


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    first_name = data.get("first_name", None)
    last_name = data.get("last_name", None)
    email = data.get("email", None)
    password = data.get("password", None)

    if not first_name:
        return error_response(400, "No first name provided")

    if not last_name:
        return error_response(400, "No last name provided")

    if not email:
        return error_response(400, "No email provided")

    if not password:
        return error_response(400, "No password provided")

    try:
        # Create user
        user = User(first_name=first_name, last_name=last_name, email=email)
        user.hash_password(password)

        # Store user
        db.session.add(user)
        db.session.commit()

        # Generate JWT
        access_token = create_access_token(identity=user.to_dict())

        return jsonify(access_token=access_token), 200
    except:
        db.session.rollback()
        return error_response(400, "This email is already in use")
