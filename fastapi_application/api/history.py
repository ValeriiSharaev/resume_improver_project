from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import db
from database.models import User
from repositories.history import HistoryRepository
from schemas.history import HistoryRead
from auth.user_manager import current_active_user

router = APIRouter(
    prefix="/history",
    tags=["history"]
)


@router.get(
    "/{resume_id}",
    summary="Получить историю улучшений выбранного резюме",
    response_model=List[HistoryRead]
)
async def get_resume_history(
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> List[HistoryRead]:
    history = await HistoryRepository.get_all_by_resume(active_user.id, resume_id, session)
    return history


@router.get(
    "/",
    summary="Получить историю улучшений всех резюме пользователя",
    response_model=List[HistoryRead]
)
async def get_user_history(
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> List[HistoryRead]:
    history = await HistoryRepository.get_all_by_user(active_user.id, session)
    return history

@router.delete(
    "/{resume_id}",
    summary="Удалить историю улучшений выбранного резюме",
    response_model=List[HistoryRead]
)
async def delete_user_history(
        resume_id: int,
        active_user: User = Depends(current_active_user),
        session: AsyncSession = Depends(db.get_session)
) -> List[HistoryRead]:
    history = await HistoryRepository.delete_all_by_resume(resume_id, active_user.id, session)
    return history
