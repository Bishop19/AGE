from flask import Blueprint

bp = Blueprint("templates", __name__)

from app.controllers.templates import templates
