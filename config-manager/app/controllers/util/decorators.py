from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from app.models.config import Config
from app.models.user import User
from app.controllers.util.errors import error_response


def validate_user(optional=False, fresh=False, refresh=False, locations=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request(optional, fresh, refresh, locations)

            user_id = get_jwt()["sub"]["id"]
            user = User.query.get(user_id)

            if not user:
                return error_response(401, "Unauthorized")

            return fn(*args, **kwargs)

        return decorator

    return wrapper


def check_config_ownership():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            user_id = get_jwt()["sub"]["id"]
            config = Config.query.get(kwargs["config_id"])

            if not config:
                return error_response(404, "Config not found")

            if config.user_id == user_id:
                return fn(*args, **kwargs)

            return error_response(403, "Forbidden")

        return decorator

    return wrapper
