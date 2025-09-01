import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from main import app
from database.database import db
from config import settings


@pytest.fixture(scope="session", autouse=True)
def check_test_db():
    load_dotenv('.test.env')
    print(f"Используется база данных {settings.DB_NAME}")
    assert settings.MODE == "TEST"


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    db.init_engine()
    await db.drop_tables()
    await db.create_tables()
    yield
    await db.drop_tables()
    db.engine = None


@pytest_asyncio.fixture
async def override_get_async_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.connect() as conn:
        trans = await conn.begin()
        session = async_session(bind=conn)

        try:
            yield session
        finally:
            await trans.rollback()
            await session.close()

    await engine.dispose()


@pytest_asyncio.fixture
async def async_client(override_get_async_session):
    app.dependency_overrides[db.get_session] = lambda: override_get_async_session

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        yield client

    app.dependency_overrides.clear()