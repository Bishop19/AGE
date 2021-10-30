# pylint: disable=E1101
from datetime import datetime
from app import db
from app.models.config import TestFile


class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    results = db.relationship("Result", lazy="dynamic")
    is_finished = db.Column(db.Boolean, default=False)
    machine_type = db.Column(db.String(64), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    finish_date = db.Column(db.DateTime)
    config_id = db.Column(db.Integer, db.ForeignKey("config.id"))
    test_file_id = db.Column(db.Integer, db.ForeignKey("test_file.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_finished": self.is_finished,
            "machine_type": self.machine_type,
            "results": [result.to_dict() for result in self.results.all()],
            "test_file": TestFile.query.get(self.test_file_id).to_dict(),
            "start_date": self.start_date,
            "finish_date": self.finish_date,
        }

    def to_dict_short(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_finished": self.is_finished,
            "start_date": self.start_date,
            "finish_date": self.finish_date,
        }

    def __init__(self, name, machine_type, config_id, test_file_id):
        self.name = name
        self.machine_type = machine_type
        self.config_id = config_id
        self.test_file_id = test_file_id

    def __repr__(self):
        return f"<Test {self.id} from config {self.config_id}>"
