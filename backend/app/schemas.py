from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    tag: str | None = Field(default=None, max_length=100)
    is_pinned: bool = False
    is_archived: bool = False


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class NotePatch(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, min_length=1)
    tag: str | None = Field(default=None, max_length=100)
    is_pinned: bool | None = None
    is_archived: bool | None = None


class NoteRead(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
