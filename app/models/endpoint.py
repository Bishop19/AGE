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
    base_path = db.Column(db.String(128), nullable=False)
    endpoint_path = db.Column(db.String(128), nullable=False)
    method = db.Column(db.Enum(Methods), nullable=False)
    query_params = db.Column(db.PickleType)
    path_params = db.Column(db.PickleType)
    body_params = db.Column(db.PickleType)
    security = db.Column(db.String(32), nullable=False, default="NONE")
    is_service = db.Column(db.Boolean, default=False)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))

    def to_dict(self):
        return {
            "base_path": self.base_path,
            "endpoint_path": self.endpoint_path,
            "method": self.method.value,
            "query_params": self.query_params,
            "path_params": self.path_params,
            "body_params": self.body_params,
            "security": self.security,
            "is_service": self.is_service,
        }

    def __repr__(self):
        return f"<Endpoint {self.id} from config {self.config_id}>"
