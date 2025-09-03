from datetime import datetime, timezone

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import ForeignKey, Integer, String, Boolean, TIMESTAMP, func
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase


class Model(DeclarativeBase):
    pass


class Resume(Model):
    __tablename__ = "resume"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(
        String, nullable=False
    )
    content: Mapped[str] = mapped_column(
        String, nullable=False
    )

class History(Model):
    __tablename__ = "history"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True
    )
    resume_id: Mapped[int] = mapped_column(
        ForeignKey("resume.id"), nullable=False
    )
    old_content: Mapped[str] = mapped_column(
        String, nullable=False
    )
    new_content: Mapped[str] = mapped_column(
        String, nullable=False
    )
    improved_at: Mapped[TIMESTAMP] = mapped_column(
        TIMESTAMP, server_default=func.now()
    )


class User(SQLAlchemyBaseUserTable[int], Model):
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )
    email: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )