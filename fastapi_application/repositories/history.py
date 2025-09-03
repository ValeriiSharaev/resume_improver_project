from typing import List
from sqlalchemy import select, delete, desc
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Resume
from repositories.validator import Validator
from schemas.history import HistoryRead, HistoryCreate

from database.models import History


class HistoryRepository:

    @classmethod
    async def get_all_by_resume(
            cls,
            user_id: int,
            resume_id: int,
            session: AsyncSession,
    ) -> List[HistoryRead]:
        resume = await session.get(Resume, resume_id)
        Validator.check_existence(resume)
        Validator.check_access_rights(resume.user_id, user_id)

        stmt = (
            select(History)
            .where(History.resume_id == resume_id)
            .order_by(desc(History.improved_at))
        )
        resume_history = await session.scalars(stmt)
        return [HistoryRead.model_validate(history) for history in resume_history]

    @classmethod
    async def get_all_by_user(
            cls,
            user_id: int,
            session: AsyncSession,
    ) -> List[HistoryRead]:
        stmt = (
            select(History)
            .join(Resume, History.resume_id == Resume.id)
            .where(Resume.user_id == user_id)
            .order_by(desc(History.improved_at))
        )
        user_history = await session.scalars(stmt)
        return [HistoryRead.model_validate(history) for history in user_history]

    @classmethod
    async def add(
            cls,
            history_create: HistoryCreate,
            session: AsyncSession,
    ) -> HistoryRead:
        history = History(**history_create.model_dump())
        session.add(history)
        await session.commit()
        return HistoryRead.model_validate(history)

    @classmethod
    async def delete_all_by_resume(
            cls,
            resume_id: int,
            user_id: int,
            session: AsyncSession
    ) -> List[HistoryRead]:
        user_id_stmt = (
            select(Resume.user_id)
            .where(Resume.id == resume_id)
        )
        resume_user_id = await session.scalar(user_id_stmt)
        Validator.check_access_rights(resume_user_id, user_id)

        get_stmt = (
            select(History)
            .where(History.resume_id == resume_id)
            .order_by(desc(History.improved_at))
        )
        resume_history = await session.scalars(get_stmt)

        history_to_delete = [HistoryRead.model_validate(history) for history in resume_history]

        delete_stmt = delete(History).where(History.resume_id == resume_id)
        await session.execute(delete_stmt)
        await session.commit()
        return history_to_delete

