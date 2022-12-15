from flask import Blueprint

bp = Blueprint("clouds", __name__)

from app.controllers.clouds import clouds
