from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

from app.controllers import auth, configs, clouds, tests
