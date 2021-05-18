# pylint: disable=E1101, E1133
import json
from app import db

config_clouds = db.Table(
    "config_clouds",
    db.Column("config_id", db.Integer, db.ForeignKey("config.id"), primary_key=True),
    db.Column("cloud_id", db.Integer, db.ForeignKey("cloud.id"), primary_key=True),
)


class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String(128), nullable=False)
    _gateways = db.Column(db.String, nullable=False, default="[]")
    endpoints = db.relationship("Endpoint", lazy="dynamic")
    tests = db.relationship("Test", lazy="dynamic")
    clouds = db.relationship(
        "Cloud",
        secondary=config_clouds,
        lazy="subquery",
        backref=db.backref("configs", lazy=True),
    )
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    @property
    def gateways(self):
        return json.loads(self._gateways)

    @gateways.setter
    def gateways(self, value):
        # TODO: qualquer valor é aceite
        self._gateways = json.dumps(value)

    def to_dict(self):
        return {
            "id": self.id,
            # "name": self.name,
            "clouds": [cloud.to_dict() for cloud in self.clouds],
            "gateways": self.gateways,
            "endpoints": [endpoint.to_dict() for endpoint in self.endpoints.all()],
            "tests": [test.to_dict() for test in self.tests.all()],
        }

    def __repr__(self):
        return f"<Config {self.id} from {self.user_id}>"
