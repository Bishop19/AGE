from app import db


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gateway = db.Column(db.String(32), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    metrics = db.Column(db.PickleType, nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey("test.id"))

    def to_dict(self):
        return {
            "gateway": self.gateway,
            "score": self.score,
            "metrics": self.metrics,
        }

    def __repr__(self):
        return f"<Result {self.id} from test {self.test_id}>"
