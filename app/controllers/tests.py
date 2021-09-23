import re
import csv
from random import randint
from flask import json, jsonify, request
from flask_jwt_extended.utils import create_access_token, get_jwt_identity
from app import app, db
from app.models.config import Config, TestFile
from app.models.user import User
from app.models.test import Test
from app.models.result import Result
from app.controllers.testing.jmeter import JMeter
from app.controllers.testing.load_test import LoadTest
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

    data = request.get_json() or {}

    test_file = data.get("test_file") or None

    if not test_file:
        return error_response(400, "No test file selected")

    # Create test
    test = Test(is_finished=False, config_id=config_id, test_file_id=test_file["id"])

    # Get JWT to post test results
    user_id = get_jwt_identity()["id"]
    user = User.query.get(user_id)

    token = create_access_token(identity=user.to_dict())

    # Get config instances
    config = Config.query.get(config_id)

    # Save test to get an ID
    db.session.add(test)
    db.session.commit()

    # Start test
    tool = LoadTest(
        JMeter(),
        test_file["content"],
        token=token,
        config_id=config_id,
        test_id=test.id,
        instances=config.instances.all(),
    )
    tool.deploy()

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


def parse_csv_results(data):
    results = {}
    results_csv = list(csv.reader(data.split("||"), strict=True))
    headers = results_csv[0]
    values = results_csv[1:]

    for row in values:
        label = row[0]
        row_results = {}

        for index, value in enumerate(row):
            row_results[headers[index]] = value

        results[label] = row_results

    return results


def get_results_from_data(data):
    results = {}

    for gateway in data["results"]:
        if len(data["results"][gateway]) > 0:
            results[gateway] = parse_csv_results(data["results"][gateway])

    return results


@app.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["PUT"])
@validate_user()
@check_config_ownership()
def test_results(config_id, test_id):
    # Get test
    test = Test.query.get(test_id)

    if not test:
        return error_response(404, "Test not found")

    if test.config_id != config_id:
        return error_response(400, "Test doesn't belong to provided config")

    if test.is_finished:
        return error_response(400, "Test already has results")

    # Check request data
    data = re.sub(r"(\d)\n(\w)", r"\1||\2", request.get_data(as_text=True))
    data = re.sub(r"(Dev\.)\n", r"\1||", data)
    data = json.loads(data)

    results = get_results_from_data(data)

    if not results or len(results) == 0:
        return error_response(400, "No results provided")

    for gateway in results:
        try:
            res = Result(
                gateway=gateway,
                score=randint(0, 100),  # TODO
                metrics=results[gateway],
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


@app.route("/configurations/<int:config_id>/tests/file", methods=["POST"])
@validate_user()
@check_config_ownership()
def add_test_file(config_id):
    data = request.get_json() or {}

    name = data.get("name") or None

    if not name:
        return error_response(400, "No name provided")

    content = data.get("file") or None

    if not content:
        return error_response(400, "No content provided")

    # Create test file
    test_file = TestFile(name=name, content=content, config_id=config_id)

    db.session.add(test_file)
    db.session.commit()

    return jsonify(test_file.to_dict())
