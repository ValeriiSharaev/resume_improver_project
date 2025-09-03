from fastapi import HTTPException, status

from database.models import Resume


class Validator:

    @classmethod
    def check_existence(
            cls,
            resume: Resume | None
    ):
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Резюме с таким id не найдено"
            )

    @classmethod
    def check_access_rights(
            cls,
            resume_user_id: int,
            user_id: int
    ):
        if not resume_user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Резюме с таким id не найдено"
            )
        if resume_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="У вас нет прав для выполнения этого действия"
            )

