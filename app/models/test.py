# pylint: disable=E1101
from app import db
from app.models.config import TestFile


class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    results = db.relationship("Result", lazy="dynamic")
    is_finished = db.Column(db.Boolean, default=False)
    machine_type = db.Column(db.String(64), nullable=False)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))
    test_file_id = db.Column(db.Integer, db.ForeignKey("test_file.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "is_finished": self.is_finished,
            "machine_type": self.machine_type,
            "results": [result.to_dict() for result in self.results.all()],
            "test_file": TestFile.query.get(self.test_file_id).to_dict(),
        }

    def __repr__(self):
        return f"<Test {self.id} from config {self.config_id}>"
