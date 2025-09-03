import pytest
import pytest_asyncio

from tests.tests_unit.data import GET_USER_RESUMES_TEST_DATA, TEST_RESUMES, \
    TEST_REGISTRATION_DATA, TEST_LOGIN_DATA, TEST_HISTORIES_INDEXES, GET_RESUME_HISTORY_DATA, \
    DELETE_RESUME_HISTORY_DATA, GET_USER_HISTORY_TEST_DATA


@pytest_asyncio.fixture
async def created_headers(async_client):
    payload = TEST_REGISTRATION_DATA
    register_response = await async_client.post("/auth/register", json=payload)
    assert register_response.status_code == 201
    data = TEST_LOGIN_DATA
    auth_response = await async_client.post("/auth/jwt/login", data=data)
    assert auth_response.status_code == 200
    token = auth_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    yield headers


@pytest_asyncio.fixture
async def create_resumes(async_client, created_headers):
    resumes_ids = []
    for payload in TEST_RESUMES:
        response = await async_client.post("/resumes/", json=payload, headers=created_headers)
        resumes_ids.append(response.json()["id"])
    resumes_ids.append(resumes_ids[1]+1)
    yield created_headers, resumes_ids


@pytest_asyncio.fixture
async def create_history(async_client, create_resumes):
    token, ids = create_resumes
    created_history = []
    for index in TEST_HISTORIES_INDEXES:
        response = await async_client.patch(f"/resumes/{ids[index]}/improve", headers=token)
        created_history.append(response)
    yield token, ids


def assert_values_by_keys(response, values):
    response_data = response.json()
    for key in values.keys():
        assert response_data[key] == values[key]


@pytest.mark.parametrize(
    "index, values, expected_status",
    GET_RESUME_HISTORY_DATA
)
@pytest.mark.asyncio
async def test_get_resume_history_unit(async_client, create_history, index, values, expected_status):
    token, ids = create_history
    response = await async_client.get(f"/history/{ids[index]}", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        response_data = response.json()
        for i, data in enumerate(response_data):
            assert data["old_content"] == values[i]["old_content"]
            assert data["new_content"] == values[i]["new_content"]
            # assert_values_by_keys(history, values)

@pytest.mark.parametrize(
    "values, count, expected_status",
    GET_USER_HISTORY_TEST_DATA
)
@pytest.mark.asyncio
async def test_get_user_history_unit(async_client, create_history, values, count, expected_status):
    token, ids = create_history
    response = await async_client.get(f"/history/", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        response_data = response.json()
        assert len(response_data) == count
        for i, data in enumerate(response_data):
            assert data["old_content"] == values[i]["old_content"]
            assert data["new_content"] == values[i]["new_content"]
            # assert_values_by_keys(data, values[i])


@pytest.mark.parametrize(
    "index, values, expected_status, count",
    DELETE_RESUME_HISTORY_DATA
)
@pytest.mark.asyncio
async def test_delete_resume_history_unit(async_client, create_history, index, values, expected_status, count):
    token, ids = create_history
    response = await async_client.delete(f"/history/{ids[index]}", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        print(f"dsnjvdsjzfvdfvnzsdvfiivjds {response.json()}")
        response_data = response.json()
        if len(values) == 2:
            print(f"dfbvhjsvlsz hlvszdhv values[0] = {values[0]}")
            print(f"dfbvhjsvlsz hlvszdhv values[1] = {values[1]}")
            print(f"dfbvhjsvlsz hlvszdhv response_data[0] = {response_data[0]}")
            print(f"dfbvhjsvlsz hlvszdhv response_data[1] = {response_data[1]}")
        for i, data in enumerate(response_data):
            assert data["old_content"] == values[i]["old_content"]
            assert data["new_content"] == values[i]["new_content"]
            # assert_values_by_keys(data, values[i])
    history = await async_client.get(f"/history/", headers=token)
    history_count = len(history.json())
    assert history_count == count

