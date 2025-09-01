import pytest
import pytest_asyncio
from tests.tests_integration.data import TEST_LOGIN_DATA, TEST_REGISTRATION_DATA, TEST_RESUMES, CREATE_RESUME_TEST_DATA, UPDATE_RESUME_TEST_DATA, \
    IMPROVE_RESUME_TEST_DATA


def assert_values_by_keys(response, values):
    response_data = response.json()
    for key in values.keys():
        assert response_data[key] == values[key]


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
    yield created_headers, resumes_ids


@pytest.mark.asyncio
async def test_create_resume_integration(async_client, created_headers):
    payload = CREATE_RESUME_TEST_DATA
    token = created_headers
    response = await async_client.post("/resumes/", json=payload, headers=token)
    assert response.status_code == 200
    response_data = response.json()
    assert "id" in response_data
    assert response_data["title"] == payload["title"]
    assert response_data["content"] == payload["content"]

    get_response = await async_client.get(f"/resumes/{response_data['id']}", headers=token)
    assert get_response.status_code == 200
    assert get_response.json()["title"] == payload["title"]
    assert get_response.json()["content"] == payload["content"]


@pytest.mark.asyncio
async def test_get_all_resumes_integration(async_client, create_resumes):
    data = TEST_RESUMES
    token, ids = create_resumes

    response = await async_client.get(f"/resumes/", headers=token)
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    for i, resume in enumerate(data):
        assert "id" in response_data[i]
        for key in resume.keys():
            assert response_data[i][key] == resume[key]


@pytest.mark.asyncio
async def test_update_resume_integration(async_client, create_resumes):
    payload = UPDATE_RESUME_TEST_DATA
    token, ids = create_resumes
    resume_id = ids[0]

    update_response = await async_client.patch(f"/resumes/{resume_id}", json=payload, headers=token)
    assert update_response.status_code == 200
    assert_values_by_keys(update_response, payload)

    get_response = await async_client.get(f"/resumes/{resume_id}", headers=token)
    assert get_response.status_code == 200
    assert_values_by_keys(get_response, payload)


@pytest.mark.asyncio
async def test_improve_resume_integration(async_client, create_resumes):
    payload = IMPROVE_RESUME_TEST_DATA
    token, ids = create_resumes
    resume_id = ids[0]

    improve_response = await async_client.patch(f"/resumes/{resume_id}/improve", headers=token)
    assert improve_response.status_code == 200
    assert_values_by_keys(improve_response, payload)

    get_response = await async_client.get(f"/resumes/{resume_id}", headers=token)
    assert get_response.status_code == 200
    assert_values_by_keys(get_response, payload)


@pytest.mark.asyncio
async def test_get_resume_integration(async_client, create_resumes):
    data = TEST_RESUMES
    token, ids = create_resumes

    for i, resume in enumerate(data):
        get_response = await async_client.get(f"/resumes/{ids[i]}", headers=token)
        assert get_response.status_code == 200
        assert "id" in get_response.json()
        assert_values_by_keys(get_response, data[i])


@pytest.mark.asyncio
async def test_delete_resume_integration(async_client, create_resumes):
    token, ids = create_resumes
    delete_response = await async_client.delete(f"/resumes/{ids[0]}", headers=token)
    assert delete_response.status_code == 200

    get_response = await async_client.get(f"/resumes/{ids[0]}", headers=token)
    assert get_response.status_code == 404

    get_all_response = await async_client.get(f"/resumes/", headers=token)
    assert get_all_response.status_code == 200
    get_all_response_data = get_all_response.json()
    assert len(get_all_response_data) == 1
    assert get_all_response_data[0]["id"] != ids[0]

