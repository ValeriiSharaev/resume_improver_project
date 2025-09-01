from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import db
from database.models import User
from repositories.resume import ResumeRepository

from schemas.resume import ResumeRead, ResumeCreate, ResumeUpdate
from auth.user_manager import current_active_user

router = APIRouter(
    prefix="/resumes",
    tags=["resumes"]
)


@router.get(
    "/{resume_id}",
    summary="Получить данные о выбранном резюме",
    response_model=ResumeRead
)
async def get_resume(
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
):
    resume = await ResumeRepository.get(active_user.id, resume_id, session)
    return resume


@router.get(
    "/",
    summary="Получить список резюме пользователя",
    response_model=List[ResumeRead]
)
async def get_user_resumes(
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> List[ResumeRead]:
    resumes = await ResumeRepository.get_all_by_user(active_user.id, session)
    return resumes


@router.post(
    "/",
    summary="Создать резюме",
    response_model=ResumeRead
)
async def add_resume(
        resume_data: ResumeCreate,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> ResumeRead:
    new_resume = await ResumeRepository.add(active_user.id, resume_data, session)
    return new_resume


@router.patch(
    "/{resume_id}",
    summary="Изменить резюме",
    response_model=ResumeRead
)
async def update_resume(
        resume_update: ResumeUpdate,
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> ResumeRead:
    updated_resume = await ResumeRepository.update(active_user.id, resume_id, resume_update, session)
    return updated_resume


@router.delete(
    "/{resume_id}",
    summary="Удалить резюме",
    response_model=ResumeRead
)
async def delete_resume(
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> ResumeRead:
    deleted_resume = await ResumeRepository.delete(active_user.id, resume_id, session)
    return deleted_resume


@router.patch(
    "/{resume_id}/improve",
    summary="Улучшить резюме с помощью нейросети",
    response_model=ResumeRead
)
async def improve_resume(
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> ResumeRead:
    improved_resume = await ResumeRepository.improve(active_user.id, resume_id, session)
    return improved_resume

