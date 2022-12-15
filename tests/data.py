from flask_jwt_extended import create_access_token
from app.controllers.tests import test_results


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
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_2 = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong"],
    "clouds": [3],
}

config_no_name = {
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_no_domain = {
    "name": "Testing",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_no_endpoints = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_no_gateways = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": [],
    "clouds": [1, 2],
}

config_no_clouds = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong", "krakend"],
}


config_wrong_endpoints = {
    "name": "Testing",
    "domain": "http://testing.test",
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

config_wrong_endpoints = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
    ],
    "gateways": ["kong", "krakend"],
    "clouds": [1, 2],
}

config_wrong_clouds = {
    "name": "Testing",
    "domain": "http://testing.test",
    "endpoints": [
        {
            "path": "/test",
            "method": "POST",
            "body_params": {"id": "integer", "name": "string"},
        },
        {"path": "/test", "method": "GET"},
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

no_test_results = {"results": []}


def create_auth_headers(identity):
    access_token = create_access_token(identity=identity)

    return {"Authorization": f"Bearer {access_token}"}
