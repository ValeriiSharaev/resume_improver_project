from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Resume
from repositories.validator import Validator
from schemas.resume import ResumeRead, ResumeCreate, ResumeUpdate


class ResumeRepository:

    @classmethod
    async def get(
            cls,
            user_id: int,
            resume_id: int,
            session: AsyncSession
    ) -> ResumeRead | None:
        resume = await session.get(Resume, resume_id)
        Validator.check_existence(resume)
        Validator.check_access_rights(resume.user_id, user_id)
        return ResumeRead.model_validate(resume)

    @classmethod
    async def get_all_by_user(
            cls,
            user_id: int,
            session: AsyncSession,
    ) -> List[ResumeRead]:
        stmt = (
            select(Resume)
            .where(Resume.user_id == user_id)
            .order_by(Resume.id)
        )
        resumes = await session.scalars(stmt)
        return [ResumeRead.model_validate(resume) for resume in resumes]

    @classmethod
    async def add(
            cls,
            user_id: int,
            resume_create: ResumeCreate,
            session: AsyncSession,
    ) -> ResumeRead:
        resume = Resume(**resume_create.model_dump(), user_id=user_id)
        session.add(resume)
        await session.commit()
        return ResumeRead.model_validate(resume)

    @classmethod
    async def update(
            cls,
            user_id: int,
            resume_id: int,
            resume_update: ResumeUpdate,
            session: AsyncSession
    ) -> ResumeRead | None:
        resume = await session.get(Resume, resume_id)
        Validator.check_existence(resume)
        Validator.check_access_rights(resume.user_id, user_id)
        update_data = resume_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(resume, field, value)
        await session.commit()
        await session.refresh(resume)
        return ResumeRead.model_validate(resume)

    @classmethod
    async def delete(
            cls,
            user_id: int,
            resume_id: int,
            session: AsyncSession
    ) -> ResumeRead:
        resume = await session.get(Resume, resume_id)
        Validator.check_existence(resume)
        Validator.check_access_rights(resume.user_id, user_id)
        await session.delete(resume)
        await session.commit()
        return ResumeRead.model_validate(resume)

    @classmethod
    async def improve(
            cls,
            user_id: int,
            resume_id: int,
            session: AsyncSession
    ) -> ResumeRead | None:
        resume = await session.get(Resume, resume_id)
        Validator.check_existence(resume)
        Validator.check_access_rights(resume.user_id, user_id)
        resume.content = resume.content + "\n[improved]"
        await session.commit()
        await session.refresh(resume)
        return ResumeRead.model_validate(resume)
