from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker


from config import settings
from database.models import Model


class Database:
    def __init__(self, url: str, echo: bool = False):
        self.url = url
        self.echo = echo
        self.engine: AsyncEngine | None = None
        self.session_maker: sessionmaker | None = None

    def init_engine(self) -> AsyncEngine:
        if self.engine is None:
            self.engine = create_async_engine(self.url, echo=self.echo)
        return self.engine

    def init_session_maker(self) -> sessionmaker:
        if self.session_maker is None:
            self.init_engine()
            self.session_maker = sessionmaker(
                bind=self.engine,
                class_=AsyncSession,
                autoflush=False,
                expire_on_commit=False,
            )
        return self.session_maker

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        session_maker = self.init_session_maker()
        async with session_maker() as session:
            yield session

    async def create_tables(self):
        self.init_engine()
        async with self.engine.begin() as conn:
            await conn.run_sync(Model.metadata.create_all)

    async def drop_tables(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Model.metadata.drop_all)


db = Database(settings.DATABASE_URL, echo=True)
