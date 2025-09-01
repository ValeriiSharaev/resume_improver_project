from pydantic import BaseModel, Field, ConfigDict


class ResumeBase(BaseModel):
    title: str = Field(description="Заголовок резюме")
    content: str = Field(description="Содержимое резюме")


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    title: str | None = Field(default=None, description="Заголовок резюме")
    content: str | None = Field(default=None, description="Содержимое резюме")


class ResumeRead(ResumeBase):
    id: int = Field(description="Идентификатор резюме")
    user_id: int = Field(description="Идентификатор пользователя, создавшего резюме")

    model_config = ConfigDict(from_attributes=True)

