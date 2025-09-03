import datetime

from pydantic import BaseModel, Field, ConfigDict


class HistoryBase(BaseModel):
    resume_id: int = Field(description="Идентификатор улучшенного резюме")
    old_content: str = Field(description="Содержимое резюме до улучшения")
    new_content: str = Field(description="Содержимое резюме после улучшения")


class HistoryCreate(HistoryBase):
    pass

class HistoryRead(HistoryBase):
    id: int = Field(description="Идентификатор записи истории")
    improved_at: datetime.datetime = Field(description="Дата и время улучшения")

    model_config = ConfigDict(from_attributes=True)

