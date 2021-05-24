from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import app, db
from app.controllers.errors import error_response
from app.models.config import Config
from app.models.user import User
from app.models.test import Test
from app.models.result import Result


@app.route("/configurations/<int:config_id>/tests", methods=["GET"])
@jwt_required()
def get_tests(config_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    # Get tests
    res = []
    tests = config.tests.all()

    for test in tests:
        res.append(test.to_dict())

    return jsonify(res)


@app.route("/configurations/<int:config_id>/tests", methods=["POST"])
@jwt_required()
def create_test(config_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Verify running tests
    test = Test.query.filter_by(config_id=config_id, is_finished=False).first()

    if test:
        return error_response(400, "One test already running")

    # Create test
    test = Test(is_finished=False, config_id=config_id)

    db.session.add(test)
    db.session.commit()

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["GET"])
@jwt_required()
def get_test(config_id, test_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    # Get test
    test = Test.query.get(test_id)

    if not test:
        return error_response(404, "Test not found")

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["PUT"])
@jwt_required()
def test_results(config_id, test_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    # Get test
    test = Test.query.get(test_id)

    if not test:
        return error_response(404, "Test not found")

    if test.is_finished:
        return error_response(400, "Test already has results")

    test.is_finished = True

    # Check request data
    data = request.get_json() or {}

    for result in data.get("results", None):
        try:
            res = Result(
                gateway=result["gateway"],
                score=result["score"],
                metrics=result["metrics"],
            )
            test.results.append(res)
        except:
            db.session.rollback()
            return error_response(400, "Wrong result parameters provided")

    db.session.add(test)
    db.session.commit()

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/running", methods=["GET"])
@jwt_required()
def get_running_test(config_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    # Get running test
    test = config.tests.filter_by(is_finished=False).first()

    if not test:
        return jsonify(False)

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/finished", methods=["GET"])
@jwt_required()
def get_finished_tests(config_id):
    # Check user
    user_id = get_jwt_identity()["id"]

    user = User.query.get(user_id)

    if not user:
        return error_response(401, "Unauthorized")

    # Get config
    config = Config.query.get(config_id)

    if not config:
        return error_response(404, "Config not found")

    if config.user_id != user_id:
        return error_response(401, "Unauthorized")

    # Get finished tests
    res = []
    tests = config.tests.filter_by(is_finished=True).all()

    for test in tests:
        res.append(test.to_dict())

    return jsonify(res)
