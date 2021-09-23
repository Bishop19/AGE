from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config


db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

db.metadata.clear()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.controllers.auth import bp as auth_bp
    from app.controllers.clouds import bp as clouds_bp
    from app.controllers.configs import bp as configs_bp
    from app.controllers.tests import bp as tests_bp
    from app.controllers.templates import bp as templates_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(clouds_bp)
    app.register_blueprint(configs_bp)
    app.register_blueprint(tests_bp)
    app.register_blueprint(templates_bp)

    db.metadata.clear()

    return app
