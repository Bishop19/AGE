from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(128), nullable=False)
    configs = db.relationship("Config", backref="owner", lazy="dynamic")
    clouds = db.relationship("Cloud", backref="owner", lazy="dynamic")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def hash_password(self, password):
        self.password = generate_password_hash(password)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
        }

    def __repr__(self):
        return f"<User {self.id} {self.email}>"
