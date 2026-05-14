from pydantic import BaseModel, Field
from typing import Literal


class StickerBase(BaseModel):
    code: str
    category: Literal["special", "country", "cocacola"]
    group: str
    group_name: str
    number: int


class StickerCreate(StickerBase):
    pass


class StickerResponse(StickerBase):
    id: int

    class Config:
        from_attributes = True


class StickerStatus(BaseModel):
    status: Literal["missing", "owned", "duplicate"]
    duplicates: int = Field(default=0, ge=0)


class UserStickerResponse(StickerResponse):
    status: Literal["missing", "owned", "duplicate"] = "missing"
    duplicates: int = 0

    class Config:
        from_attributes = True


class UserStickerUpdate(BaseModel):
    status: Literal["missing", "owned", "duplicate"]
    duplicates: int = Field(default=0, ge=0)


class StatsResponse(BaseModel):
    total: int
    owned: int
    missing: int
    duplicates: int
    percentage: float
