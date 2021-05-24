import os
import tempfile
import pytest

from app import app, db

basedir = os.path.abspath(os.path.dirname(__file__))


@pytest.fixture(scope="session")
def client():
    db_fd, app.config["DATABASE"] = tempfile.mkstemp()
    app.config["TESTING"] = True
    app.config["JWT_SECRET_KEY"] = "testing"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        basedir, "app_test.db"
    )
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client

    # tear down
    with app.app_context():
        db.session.remove()
        db.drop_all()

    os.close(db_fd)
    os.unlink(app.config["DATABASE"])
