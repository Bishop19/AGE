from flask import jsonify, request
from app import app, db
from app.models.config import Config
from app.models.test import Test
from app.models.result import Result
from app.controllers.util.decorators import validate_user, check_config_ownership
from app.controllers.util.errors import error_response


@app.route("/configurations/<int:config_id>/tests", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_tests(config_id):
    # Get config
    config = Config.query.get(config_id)

    # Get tests
    res = []
    tests = config.tests.all()

    for test in tests:
        res.append(test.to_dict())

    return jsonify(res)


@app.route("/configurations/<int:config_id>/tests", methods=["POST"])
@validate_user()
@check_config_ownership()
def create_test(config_id):
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
@validate_user()
@check_config_ownership()
def get_test(config_id, test_id):
    # Get test
    test = Test.query.get(test_id)

    if not test:
        return error_response(404, "Test not found")

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["PUT"])
@validate_user()
@check_config_ownership()
def test_results(config_id, test_id):
    # Get test
    test = Test.query.get(test_id)

    if not test:
        return error_response(404, "Test not found")

    if test.is_finished:
        return error_response(400, "Test already has results")

    # Check request data
    results = request.get_json().get("results", None)

    if not results or len(results) == 0:
        return error_response(400, "No results provided")

    for result in results:
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

    test.is_finished = True

    db.session.add(test)
    db.session.commit()

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/running", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_running_test(config_id):
    # Get config
    config = Config.query.get(config_id)

    # Get running test
    test = config.tests.filter_by(is_finished=False).first()

    if not test:
        return jsonify(False)

    return jsonify(test.to_dict())


@app.route("/configurations/<int:config_id>/tests/finished", methods=["GET"])
@validate_user()
@check_config_ownership()
def get_finished_tests(config_id):
    # Get config
    config = Config.query.get(config_id)

    # Get finished tests
    res = []
    tests = config.tests.filter_by(is_finished=True).all()

    for test in tests:
        res.append(test.to_dict())

    return jsonify(res)
