# pylint: disable=E1101
import json
from app import db


class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    _gateways = db.Column(db.String, nullable=False, default="[]")
    endpoints = db.relationship("Endpoint", lazy="dynamic")
    tests = db.relationship("Test", lazy="dynamic")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    @property
    def gateways(self):
        return json.loads(self._gateways)

    @gateways.setter
    def gateways(self, value):
        self._gateways = json.dumps(value)

    def to_dict(self):
        return {
            "id": self.id,
            "gateways": self.gateways,
            "endpoints": [endpoint.to_dict() for endpoint in self.endpoints.all()],
            "tests": [test.to_dict() for test in self.tests.all()],
        }

    def __repr__(self):
        return f"<Config {self.id} from {self.user_id}>"
