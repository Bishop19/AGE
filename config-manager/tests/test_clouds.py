from .data import (
    create_auth_headers,
    user,
    user_2,
    user_3,
    aws,
    azure,
    gcp,
    invalid_cloud,
)


def test_create_cloud_aws(client):
    headers = create_auth_headers(user)

    data = client.post("/clouds", json=aws, headers=headers)

    assert data.get_json()["id"]


def test_create_cloud_azure(client):
    headers = create_auth_headers(user)

    data = client.post("/clouds", json=azure, headers=headers)

    assert data.get_json()["id"]


def test_create_cloud_gcp(client):
    headers = create_auth_headers(user_2)

    data = client.post("/clouds", json=gcp, headers=headers)

    assert data.get_json()["id"]


def test_create_cloud_unauthenticated(client):
    data = client.post("/clouds", json=gcp)

    error = data.get_json()["msg"]

    assert error == "Missing Authorization Header"


def test_create_cloud_invalid_provider(client):
    headers = create_auth_headers(user)

    data = client.post("/clouds", json=invalid_cloud, headers=headers)

    assert data.get_json()["id"]


def test_create_cloud_no_name_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/clouds",
        json={"key": gcp["key"], "provider": gcp["provider"]},
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No name provided"


def test_create_cloud_no_key_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/clouds",
        json={"name": gcp["name"], "provider": gcp["provider"]},
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No key provided"


def test_create_cloud_no_provider_provided(client):
    headers = create_auth_headers(user)

    data = client.post(
        "/clouds",
        json={"name": gcp["name"], "key": gcp["key"]},
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No provider provided"


def test_get_clouds(client):
    headers = create_auth_headers(user)

    data = client.get("/clouds", headers=headers)

    clouds = data.get_json()

    assert isinstance(clouds, list)


def test_get_cloud(client):
    cloud_id = 1
    headers = create_auth_headers(user)

    data = client.get(f"/clouds/{cloud_id}", headers=headers)

    cloud = data.get_json()

    assert cloud["user_id"] == user["id"] and cloud["id"] == cloud_id


def test_get_cloud_not_owned(client):
    cloud_id = 3
    headers = create_auth_headers(user)

    data = client.get(f"/clouds/{cloud_id}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Unauthorized"


def test_get_cloud_not_existing(client):
    cloud_id = 5
    headers = create_auth_headers(user)

    data = client.get(f"/clouds/{cloud_id}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Cloud not found"


def test_get_cloud_not_existing_user(client):
    cloud_id = 1
    headers = create_auth_headers(user_3)

    data = client.get(f"/clouds/{cloud_id}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Unauthorized"
