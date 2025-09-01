from typing import Optional, AsyncGenerator
from fastapi import Request, Depends
from fastapi_users import BaseUserManager, FastAPIUsers, IntegerIDMixin
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database.database import db
from database.models import User
from schemas.user import UserRead, UserUpdate, UserCreate


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.SECRET_KEY_MANAGER
    verification_token_secret = settings.SECRET_KEY_MANAGER

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")
        return token


class UserManagerFactory:
    @staticmethod
    async def get_user_manager(user_db: SQLAlchemyUserDatabase):
        yield UserManager(user_db)


class JwtStrategyFactory:
    @staticmethod
    def get_jwt_strategy() -> JWTStrategy:
        return JWTStrategy(secret=settings.SECRET_KEY_MANAGER, lifetime_seconds=3600)


class AuthenticationBackendFactory:
    @staticmethod
    def create_auth_backend() -> AuthenticationBackend:
        bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
        strategy = JwtStrategyFactory.get_jwt_strategy
        return AuthenticationBackend(
            name="jwt",
            transport=bearer_transport,
            get_strategy=strategy
        )


class UserDBFactory:
    @staticmethod
    async def get_user_db(session: AsyncSession = Depends(db.get_session)) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
        yield SQLAlchemyUserDatabase(session, User)



class FastAPIUsersManager:

    def __init__(self):
        self.auth_backend = AuthenticationBackendFactory.create_auth_backend()
        self.fastapi_users = FastAPIUsers[User, int](
            self._get_user_manager,
            [self.auth_backend]
        )

    async def _get_user_manager(self, user_db: SQLAlchemyUserDatabase = Depends(UserDBFactory.get_user_db)) -> AsyncGenerator[UserManager, None]:
        yield UserManager(user_db)

    @property
    def current_active_user(self):
        return self.fastapi_users.current_user(active=True)

    def get_auth_router(self):
        return self.fastapi_users.get_auth_router(self.auth_backend)

    def get_register_router(self):
        return self.fastapi_users.get_register_router(UserRead, UserCreate)

    def get_users_router(self):
        return self.fastapi_users.get_users_router(UserRead, UserUpdate)


auth_manager = FastAPIUsersManager()
current_active_user = auth_manager.current_active_user
