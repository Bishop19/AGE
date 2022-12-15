# pylint: disable=E1101
import enum
from app import db


class Providers(enum.Enum):
    GCP = "GCP"
    AWS = "AWS"
    AZURE = "AZURE"


class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Enum(Providers), nullable=False)
    credentials = db.Column(db.PickleType, nullable=False)
    region = db.Column(db.String(64), nullable=False)
    cloud_id = db.Column(db.Integer, db.ForeignKey("cloud.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name.value,
            "credentials": self.credentials,
            "region": self.region,
        }


class Instance(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    ip = db.Column(db.String(32), nullable=False)
    gateway = db.Column(db.String(32), nullable=False)

    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))
    # cloud_id = db.Column(db.Integer, db.ForeignKey("config_cloud.cloud_id"))

    # config_cloud = db.relationship(
    #     "ConfigCloud",
    #     foreign_keys=[config_id, cloud_id],
    #     primaryjoin="and_(Instance.config_id == ConfigCloud.config_id, Instance.cloud_id == ConfigCloud.cloud_id",
    # )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "ip": self.ip,
            "gateway": self.gateway,
        }


class Cloud(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    provider = db.relationship("Provider", uselist=False)
    machine_type = db.Column(db.String(64), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider.to_dict(),
            "machine_type": self.machine_type,
            "user_id": self.user_id,
        }

    def __repr__(self):
        return f"<Cloud {self.id} from {self.user_id}>"
