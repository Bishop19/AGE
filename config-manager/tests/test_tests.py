from .data import (
    create_auth_headers,
    user,
    user_2,
    test_results,
    invalid_test_results,
    no_test_results,
)

CONFIG_ID = 1
CONFIG_2_ID = 2
NO_CONFIG_ID = 999
TEST_ID = 1
TEST_2_ID = 2
NO_TEST_ID = 999


def test_create_test(client):
    headers = create_auth_headers(user)

    data = client.post(f"/configurations/{CONFIG_ID}/tests", headers=headers)

    test = data.get_json()

    assert test["id"]


def test_create_test_2(client):
    headers = create_auth_headers(user)

    data = client.post(f"/configurations/{CONFIG_ID}/tests", headers=headers)

    error = data.get_json()["message"]

    assert error == "One test already running"


def test_get_tests(client):
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{CONFIG_ID}/tests", headers=headers)

    tests = data.get_json()

    assert isinstance(tests, list)


def test_get_tests_no_config(client):
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{NO_CONFIG_ID}/tests", headers=headers)

    error = data.get_json()["message"]

    assert error == "Config not found"


def test_get_tests_not_owned(client):
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{CONFIG_2_ID}/tests", headers=headers)

    error = data.get_json()["message"]

    assert error == "Forbidden"


def test_get_test(client):
    headers = create_auth_headers(user)

    data = client.get(f"/configurations/{CONFIG_ID}/tests/{TEST_ID}", headers=headers)

    test = data.get_json()

    assert test["id"] == TEST_ID


def test_get_test_not_existing_config(client):
    headers = create_auth_headers(user)

    data = client.get(
        f"/configurations/{NO_CONFIG_ID}/tests/{TEST_ID}", headers=headers
    )

    error = data.get_json()["message"]

    assert error == "Config not found"


def test_get_test_not_existing(client):
    headers = create_auth_headers(user)

    data = client.get(
        f"/configurations/{CONFIG_ID}/tests/{NO_TEST_ID}", headers=headers
    )

    error = data.get_json()["message"]

    assert error == "Test not found"


def test_get_test_not_owned(client):
    headers = create_auth_headers(user_2)

    data = client.get(f"/configurations/{CONFIG_ID}/tests/{TEST_ID}", headers=headers)

    error = data.get_json()["message"]

    assert error == "Forbidden"


def test_edit_test_invalid_results(client):
    headers = create_auth_headers(user)

    data = client.put(
        f"/configurations/{CONFIG_ID}/tests/{TEST_ID}",
        json=invalid_test_results,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "Wrong result parameters provided"


def test_edit_test_no_results(client):
    headers = create_auth_headers(user)

    data = client.put(
        f"/configurations/{CONFIG_ID}/tests/{TEST_ID}",
        json=no_test_results,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "No results provided"


def test_get_running_test(client):
    headers = create_auth_headers(user)

    data = client.get(
        f"/configurations/{CONFIG_ID}/tests/running",
        headers=headers,
    )

    test = data.get_json()

    assert test["id"]


def test_edit_test(client):
    headers = create_auth_headers(user)

    data = client.put(
        f"/configurations/{CONFIG_ID}/tests/{TEST_ID}",
        json=test_results,
        headers=headers,
    )

    test = data.get_json()

    assert test["id"] == TEST_ID and test["is_finished"]


def test_edit_test_2(client):
    headers = create_auth_headers(user)

    data = client.put(
        f"/configurations/{CONFIG_ID}/tests/{TEST_ID}",
        json=test_results,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "Test already has results"


def test_edit_test_not_existing(client):
    headers = create_auth_headers(user)

    data = client.put(
        f"/configurations/{CONFIG_ID}/tests/{NO_TEST_ID}",
        json=test_results,
        headers=headers,
    )

    error = data.get_json()["message"]

    assert error == "Test not found"


def test_get_running_test_2(client):
    headers = create_auth_headers(user)

    data = client.get(
        f"/configurations/{CONFIG_ID}/tests/running",
        headers=headers,
    )

    test = data.get_json()

    assert not test


def test_get_finished_tests(client):
    headers = create_auth_headers(user)

    data = client.get(
        f"/configurations/{CONFIG_ID}/tests/finished",
        headers=headers,
    )

    tests = data.get_json()

    assert isinstance(tests, list)
