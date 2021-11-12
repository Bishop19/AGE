from flask import jsonify
from flask_jwt_extended import get_jwt_identity
import json
from app.controllers.dashboard import bp
from app.controllers.util.decorators import validate_user
from app.models.config import Config, ConfigCloud
from app.models.test import Test


def parse_test_running(t):
    test = t[0]
    gateways = json.loads(t[1])
    name = t[2]

    test = test.to_dict_short()
    test["gateways"] = gateways
    test["config"] = name

    return test


def get_running_tests(user_id):
    tests = (
        Test.query.filter_by(is_finished=False)
        .join(Config)
        .add_columns(Config._gateways)
        .add_columns(Config.name)
        .filter_by(user_id=user_id)
        .all()
    )
    tests = list(map(parse_test_running, tests))

    return tests


def parse_test_latest_results(t):
    test = t[0]
    name = t[1]

    try:
        result = max(test.results.all(), key=lambda item: item.score)
        test = test.to_dict_short()
        test["config"] = name
        test["gateway"] = result.gateway
    except:
        test = test.to_dict_short()
        test["config"] = "error"
        test["gateway"] = "error"

    return test


def get_latest_results(user_id):
    tests = (
        Test.query.filter_by(is_finished=True)
        .join(Config)
        .add_columns(Config.name)
        .filter_by(user_id=user_id)
        .order_by(Test.finish_date.desc())
        .limit(5)
        .all()
    )

    # Get config name and best gateway
    tests = list(map(parse_test_latest_results, tests))

    return tests


def get_deployed_configs(user_id):
    return (
        ConfigCloud.query.filter_by(is_deployed=True)
        .join(Config)
        .filter_by(user_id=user_id)
        .count()
    )


@bp.route("/dashboard", methods=["GET"])
@validate_user()
def get_dashboard_info():
    user_id = get_jwt_identity()["id"]

    nr_configs = Config.query.filter_by(user_id=user_id).count()
    nr_tests = Test.query.join(Config).filter_by(user_id=user_id).count()
    running_tests = get_running_tests(user_id)
    latest_results = get_latest_results(user_id)
    deployed_configs = get_deployed_configs(user_id)

    return jsonify(
        {
            "nr_configs": nr_configs,
            "nr_tests": nr_tests,
            "running_tests": running_tests,
            "latest_results": latest_results,
            "deployed_configs": deployed_configs,
        }
    )
