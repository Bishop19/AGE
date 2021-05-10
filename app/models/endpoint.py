# pylint: disable=E1101
import enum
from app import db


class Methods(enum.Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
    OPTIONS = "OPTIONS"
    HEAD = "HEAD"
    CONNECT = "CONNECT"
    TRACE = "TRACE"


class Endpoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(128), nullable=False)
    method = db.Column(db.Enum(Methods), nullable=False)
    params = db.Column(db.PickleType)
    payload = db.Column(db.PickleType)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))

    def to_dict(self):
        return {
            "path": self.path,
            "method": self.method.value,
            "params": self.params,
            "payload": self.payload,
        }

    def __repr__(self):
        return f"<Endpoint {self.id} from config {self.config_id}>"
