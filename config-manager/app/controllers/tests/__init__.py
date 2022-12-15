from flask import Blueprint

bp = Blueprint("tests", __name__)

from app.controllers.tests import tests
