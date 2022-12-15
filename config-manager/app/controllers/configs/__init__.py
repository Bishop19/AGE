from flask import Blueprint

bp = Blueprint("configs", __name__)

from app.controllers.configs import configs
