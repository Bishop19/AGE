from datetime import datetime
import re
import csv
import math
from random import randint
from flask import json, jsonify, request
from flask_jwt_extended.utils import create_access_token, get_jwt_identity
from app import db
from app.models.config import Config, TestFile
from app.models.user import User
from app.models.test import Test
from app.models.result import Result
from app.controllers.tests import bp
from app.controllers.tests.tools.jmeter import JMeter
from app.controllers.tests.tools.load_test import LoadTest
from app.controllers.util.decorators import validate_user, check_config_ownership
from app.controllers.util.errors import error_response


@bp.route("/configurations/<int:config_id>/tests", methods=["GET"])
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


@bp.route("/configurations/<int:config_id>/tests", methods=["POST"])
@validate_user()
@check_config_ownership()
def create_test(config_id):
    # Verify running tests
    test = Test.query.filter_by(config_id=config_id, is_finished=False).first()

    if test:
        return error_response(400, "One test already running")

    data = request.get_json() or {}

    name = data.get("name") or None

    if not name:
        return error_response(400, "No name provided")

    test_file = data.get("test_file") or None

    if not test_file:
        return error_response(400, "No test file selected")

    machine_type = data.get("machine_type") or None

    if not machine_type:
        return error_response(400, "No machine type provided")

    # Create test
    test = Test(
        name=name,
        machine_type=machine_type,
        config_id=config_id,
        test_file_id=test_file["id"],
    )

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
        machine_type=test.machine_type,
    )
    tool.deploy()

    return jsonify(test.to_dict())


@bp.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["GET"])
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


def calculate_score(scores, total):
    return math.ceil(sum(scores) * 100 / total)


def calculate_scores(results):
    metrics = [
        "90% Line",
        "95% Line",
        "99% Line",
        "Average",
        "Min",
        "Max",
        "Median",
        "Std. Dev.",
        "Throughput",
    ]
    scores = {}
    for gateway in results:
        scores[gateway] = []

    for metric in metrics:
        values = []
        metric_scores = []
        for gateway, result in results.items():
            values.append((float(result["TOTAL"][metric]), gateway))

        if metric == "Throughput":
            maximum = max(values, key=lambda item: item[0])
            maximum = (float(maximum[0]), maximum[1])

            for value in values:
                score = 1 - (math.fabs(maximum[0] - value[0]) / maximum[0])
                metric_scores.append((value[1], score))

        else:
            minimum = min(values, key=lambda item: item[0])
            minimum = (float(minimum[0]), minimum[1])

            for value in values:
                if minimum[0] == 0:
                    score = 0
                else:
                    score = 1 - (math.fabs(minimum[0] - value[0]) / value[0])

                metric_scores.append((value[1], score))

        for (gateway, score) in metric_scores:
            scores[gateway].append(score)

    return {k: calculate_score(v, len(metrics)) for k, v in scores.items()}


@bp.route("/configurations/<int:config_id>/tests/<int:test_id>", methods=["PUT"])
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

    scores = calculate_scores(results)

    for gateway in results:
        try:
            res = Result(
                gateway=gateway,
                score=scores[gateway],
                metrics=results[gateway],
            )
            test.results.append(res)
        except:
            db.session.rollback()
            return error_response(400, "Wrong result parameters provided")

    test.is_finished = True
    test.finish_date = datetime.utcnow()

    db.session.add(test)
    db.session.commit()

    return jsonify(test.to_dict())


@bp.route("/configurations/<int:config_id>/tests/running", methods=["GET"])
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


@bp.route("/configurations/<int:config_id>/tests/finished", methods=["GET"])
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


@bp.route("/configurations/<int:config_id>/tests/file", methods=["POST"])
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
