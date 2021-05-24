from app.controllers.tests import test_results
from flask_jwt_extended import create_access_token


# Users

user = {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "password": "password",
    "email": "john@doe.com",
}

user_2 = {
    "id": 2,
    "first_name": "Alice",
    "last_name": "Doe",
    "password": "password",
    "email": "alice@doe.com",
}

user_3 = {
    "id": 3,
    "first_name": "Bob",
    "last_name": "Doe",
    "password": "password",
    "email": "bob@doe.com",
}


# Configs

config = {
    "endpoints": [
        {
            "path": "/teste",
            "method": "post",
            "params": {"id": "integer", "name": "string"},
            "payload": {"recursivo": "como?"},
        },
        {"path": "teste2", "method": "Get"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_2 = {
    "endpoints": [
        {
            "path": "/teste",
            "method": "post",
            "params": {"id": "integer", "name": "string"},
            "payload": {"recursivo": "como?"},
        },
        {"path": "teste2", "method": "Get"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [3],
}


config_wrong_endpoints = {
    "endpoints": [
        {
            "path": "/teste",
            "params": {"id": "integer", "name": "string"},
            "payload": {"recursivo": "como?"},
        },
        {"path": "teste2", "method": "Get"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_wrong_clouds = {
    "endpoints": [
        {
            "path": "/teste",
            "method": "post",
            "params": {"id": "integer", "name": "string"},
            "payload": {"recursivo": "como?"},
        },
        {"path": "teste2", "method": "Get"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [3],
}


# Clouds

aws = {"name": "Teste 4", "key": "key teste", "provider": "azure"}

azure = {"name": "Teste 4", "key": "key teste", "provider": "azure"}

gcp = {"name": "Teste 4", "key": "key teste", "provider": "azure"}

invalid_cloud = {"name": "Teste 4", "key": "key teste", "provider": "azure"}


# Tests

test_results = {
    "results": [
        {"gateway": "Kong", "score": 90, "metrics": {"cpu": 80, "memory": "good"}},
        {"gateway": "KrakenD", "score": 50, "metrics": {"cpu": 50, "memory": "good"}},
    ]
}

invalid_test_results = {
    "results": [{"gateway": "Kong", "metrics": {"cpu": 80, "memory": "good"}}]
}


def create_auth_headers(identity):
    access_token = create_access_token(identity=identity)

    return {"Authorization": f"Bearer {access_token}"}
