from app import app, db
from app.models.user import User
from app.models.config import Config, ConfigCloud
from app.models.endpoint import Endpoint
from app.models.cloud import Cloud, Instance, Provider
from app.models.test import Test
from app.models.result import Result


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "Config": Config,
        "Endpoint": Endpoint,
        "Cloud": Cloud,
        "Test": Test,
        "Result": Result,
        "Provider": Provider,
        "ConfigCloud": ConfigCloud,
        "Instance": Instance,
    }
