# pylint: disable=E1101
import enum
from app import db


class Providers(enum.Enum):
    GCP = "GCP"
    AWS = "AWS"
    AZURE = "AZURE"


class Cloud(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    key = db.Column(db.String(256), nullable=False)
    provider = db.Column(db.Enum(Providers), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider.value,
            "user_id": self.user_id,
        }

    def __repr__(self):
        return f"<Cloud {self.id} from {self.user_id}>"
