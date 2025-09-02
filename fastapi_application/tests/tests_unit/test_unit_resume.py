import pytest
import pytest_asyncio

from tests.tests_unit.data import CREATE_RESUME_TEST_DATA, GET_USER_RESUMES_TEST_DATA, UPDATE_RESUME_TEST_DATA, \
    GET_RESUME_DATA, DELETE_RESUME_DATA, TEST_RESUMES, TEST_REGISTRATION_DATA, TEST_LOGIN_DATA, IMPROVE_RESUME_TEST_DATA


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


def assert_values_by_keys(response, values):
    response_data = response.json()
    for key in values.keys():
        assert response_data[key] == values[key]


@pytest.mark.parametrize(
    "payload, expected_status",
    CREATE_RESUME_TEST_DATA
)
@pytest.mark.asyncio
async def test_create_resume_unit(async_client, payload, expected_status, created_headers):
    token = created_headers
    response = await async_client.post("/resumes/", json=payload, headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        response_data = response.json()
        assert "id" in response_data
        assert response_data["title"] == payload["title"]
        if "content" in payload:
            assert response_data["content"] == payload["content"]
        else:
            assert not response_data["content"]


@pytest.mark.parametrize(
    "values, count, expected_status",
    GET_USER_RESUMES_TEST_DATA
)
@pytest.mark.asyncio
async def test_get_all_resumes_unit(async_client, create_resumes, values, count, expected_status):
    token, ids = create_resumes
    response = await async_client.get(f"/resumes/", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        response_data = response.json()
        assert len(response_data) == count
        for i, data in enumerate(response_data):
            assert data["title"] == values[i]["title"]
            assert data["content"] == values[i]["content"]


@pytest.mark.parametrize(
    "index, payload, expected_status",
    UPDATE_RESUME_TEST_DATA
)
@pytest.mark.asyncio
async def test_update_resume_unit(async_client, create_resumes, index, payload, expected_status):
    token, ids = create_resumes
    response = await async_client.put(f"/resumes/{ids[index]}", json=payload, headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        assert_values_by_keys(response, payload)


@pytest.mark.parametrize(
    "index, values, expected_status",
    GET_RESUME_DATA
)
@pytest.mark.asyncio
async def test_get_resume_unit(async_client, create_resumes, index, values, expected_status):
    token, ids = create_resumes
    response = await async_client.get(f"/resumes/{ids[index]}", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        assert_values_by_keys(response, values)


@pytest.mark.parametrize(
    "index, values, expected_status, count",
    DELETE_RESUME_DATA
)
@pytest.mark.asyncio
async def test_delete_resume_unit(async_client, create_resumes, index, values, expected_status, count):
    token, ids = create_resumes
    response = await async_client.delete(f"/resumes/{ids[index]}", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        assert_values_by_keys(response, values)
    resumes = await async_client.get(f"/resumes/", headers=token)
    resumes_count = len(resumes.json())
    assert resumes_count == count


@pytest.mark.parametrize(
    "index, values, expected_status",
    IMPROVE_RESUME_TEST_DATA
)
@pytest.mark.asyncio
async def test_improve_resume_unit(async_client, create_resumes, index, values, expected_status):
    token, ids = create_resumes
    response = await async_client.patch(f"/resumes/{ids[index]}/improve", headers=token)
    assert response.status_code == expected_status
    if response.status_code == 200:
        assert_values_by_keys(response, values)

