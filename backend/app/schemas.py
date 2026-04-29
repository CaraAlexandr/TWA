from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=160)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


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
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
