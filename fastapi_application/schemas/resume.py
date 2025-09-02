from pydantic import BaseModel, Field, ConfigDict


class ResumeBase(BaseModel):
    title: str = Field(description="Заголовок резюме")
    content: str = Field(description="Содержимое резюме")


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(ResumeBase):
    pass


class ResumeRead(ResumeBase):
    id: int = Field(description="Идентификатор резюме")
    user_id: int = Field(description="Идентификатор пользователя, создавшего резюме")

    model_config = ConfigDict(from_attributes=True)

