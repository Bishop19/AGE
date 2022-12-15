import os
import tempfile
import pytest
from flask import current_app
from app import db

basedir = os.path.abspath(os.path.dirname(__file__))


@pytest.fixture(scope="session")
def client():
    db_fd, current_app.config["DATABASE"] = tempfile.mkstemp()
    current_app.config["TESTING"] = True
    current_app.config["JWT_SECRET_KEY"] = "testing"
    current_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        basedir, "app_test.db"
    )
    with current_app.test_client() as client:
        with current_app.app_context():
            db.create_all()
            yield client

    # tear down
    with current_app.app_context():
        db.session.remove()
        db.drop_all()

    os.close(db_fd)
    os.unlink(current_app.config["DATABASE"])
