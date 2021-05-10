from app import db


class Cloud(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(256), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def to_dict(self):
        return {"id": self.id, "user_id": self.user_id}

    def __repr__(self):
        return f"<Cloud {self.id} from {self.user_id}>"
