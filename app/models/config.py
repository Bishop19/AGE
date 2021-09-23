# pylint: disable=E1101, E1133
import json
from app import db


class ConfigCloud(db.Model):
    __tablename__ = "config_cloud"
    __table_args__ = {"extend_existing": True}
    config_id = db.Column(
        "config_id", db.Integer, db.ForeignKey("config.id"), primary_key=True
    )
    cloud_id = db.Column(
        "cloud_id", db.Integer, db.ForeignKey("cloud.id"), primary_key=True
    )
    is_deployed = db.Column(db.Boolean, default=False)
    config = db.relationship("Config", back_populates="cloud")
    cloud = db.relationship("Cloud")

    @property
    def credentials(self):
        return self.cloud.provider.credentials


class TestFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "content": self.content}


class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    _gateways = db.Column(db.String, nullable=False, default="[]")
    endpoints = db.relationship("Endpoint", lazy="dynamic")
    tests = db.relationship("Test", lazy="dynamic")
    cloud = db.relationship("ConfigCloud", back_populates="config", uselist=False)
    instances = db.relationship("Instance", lazy="dynamic")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    test_files = db.relationship("TestFile", lazy="dynamic")

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
            "name": self.name,
            "instances": [
                instance.to_dict() for instance in self.instances.all()
            ],  # TODO: INSERIR NA CLOUD?
            "cloud": {
                "id": self.cloud.cloud_id,
                "name": self.cloud.cloud.name,
                "provider": self.cloud.cloud.provider.name.value,
                "is_deployed": self.cloud.is_deployed,
            },
            "gateways": self.gateways,
            "endpoints": [endpoint.to_dict() for endpoint in self.endpoints.all()],
            "tests": [test.to_dict() for test in self.tests.all()],
            "test_files": [test_file.to_dict() for test_file in self.test_files.all()],
        }

    def __repr__(self):
        return f"<Config {self.id} from User {self.user_id}>"
