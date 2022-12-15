from flask_jwt_extended import decode_token
from .data import user, user_2


def test_register(client):
    data = client.post(
        "/register",
        json=user,
    )

    data = data.get_json()

    assert decode_token(data["access_token"])["sub"]["email"] == user["email"]


def test_register_2(client):
    data = client.post(
        "/register",
        json=user_2,
    )

    data = data.get_json()

    assert decode_token(data["access_token"])["sub"]["email"] == user_2["email"]


def test_register_same_email(client):
    data = client.post(
        "/register",
        json=user,
    )

    error = data.get_json()["message"]

    assert error == "This email is already in use"


def test_register_no_email_provided(client):
    data = client.post(
        "/register",
        json={
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "password": user["password"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No email provided"


def test_register_no_first_name_provided(client):
    data = client.post(
        "/register",
        json={
            "last_name": user["last_name"],
            "password": user["password"],
            "email": user["email"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No first name provided"


def test_register_no_last_name_provided(client):
    data = client.post(
        "/register",
        json={
            "first_name": user["first_name"],
            "password": user["password"],
            "email": user["email"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No last name provided"


def test_register_no_password_provided(client):
    data = client.post(
        "/register",
        json={
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No password provided"


def test_login(client):
    data = client.post(
        "/auth",
        json={
            "email": user["email"],
            "password": user["password"],
        },
    )

    data = data.get_json()

    assert decode_token(data["access_token"])["sub"]["email"] == user["email"]


def test_login_wrong_email(client):
    data = client.post(
        "/auth",
        json={
            "email": "WRONG",
            "password": user["password"],
        },
    )

    error = data.get_json()["message"]

    assert error == "Wrong credentials"


def test_login_wrong_password(client):
    data = client.post(
        "/auth",
        json={
            "email": user["email"],
            "password": "WRONG",
        },
    )

    error = data.get_json()["message"]

    assert error == "Wrong credentials"


def test_login_no_email_provided(client):
    data = client.post(
        "/auth",
        json={
            "password": user["password"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No email provided"


def test_login_no_password_provided(client):
    data = client.post(
        "/auth",
        json={
            "email": user["email"],
        },
    )

    error = data.get_json()["message"]

    assert error == "No password provided"
