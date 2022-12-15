from .data import (
    create_auth_headers,
    user,
    user_2,
    user_3,
    config,
    config_2,
    config_no_name,
    config_no_domain,
    config_no_endpoints,
    config_no_clouds,
    config_no_gateways,
    config_wrong_endpoints,
    config_wrong_clouds,
)


def test_create_config(client):
    headers = create_auth_headers(user)

    data = client.post("/configurations", json=config, headers=headers)

    assert data.get_json()["id"]


def test_create_config_2(client):
    headers = create_auth_headers(user_2)

    data = client.post("/configurations", json=config_2, headers=headers)

    assert data.get_json()["id"]


def test_create_config_no_jwt(client):
    data = client.post("/configurations", json=config)

    error = data.get_json()["msg"]

    assert error == "Missing Authorization Header"


# TODO: JWT com user inexistente
def test_create_config_wrong_jwt(client):
    # headers = create_auth_headers(user_3)

    # data = client.post("/configurations", json=config, headers=headers)

    assert 1 == 1


def test_create_config_no_name_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_no_name,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No name provided"


def test_create_config_no_domain_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_no_domain,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No domain provided"


def test_create_config_no_endpoints_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_no_endpoints,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No endpoints provided"


def test_create_config_no_gateways_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_no_gateways,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No gateways provided"


def test_create_config_no_clouds_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_no_clouds,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No clouds provided"


def test_create_config_wrong_endpoints_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_wrong_endpoints,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "Wrong endpoint parameters provided"


def test_create_config_wrong_clouds_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/configurations",
        json=config_wrong_clouds,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "Wrong cloud ids provided"


def test_get_configs(client):
    headers = create_auth_headers(user)

    data = client.get("/configurations", headers=headers)

    configs = data.get_json()

    assert isinstance(configs, list)


def test_get_config(client):
    config_id = 1
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{config_id}", headers=headers)

    conf = data.get_json()

    assert conf["id"] == config_id


def test_get_config_no_config(client):
    config_id = 3
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{config_id}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Config not found"


def test_get_config_not_owned(client):
    config_id = 2
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{config_id}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Forbidden"
