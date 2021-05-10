# pylint: disable=E1101
from app import db


class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    results = db.relationship("Result", lazy="dynamic")
    is_finished = db.Column(db.Boolean, default=False)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "is_finished": self.is_finished,
            "results": [result.to_dict() for result in self.results.all()],
        }

    def __repr__(self):
        return f"<Test {self.id} from config {self.config_id}>"
