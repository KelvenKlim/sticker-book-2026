from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime


class TradeCreate(BaseModel):
    to_user_id: int
    from_sticker_codes: List[str] = Field(..., min_items=1)
    to_sticker_codes: List[str] = Field(..., min_items=1)
    message: str | None = None


class TradeUpdate(BaseModel):
    status: Literal["accepted", "rejected", "cancelled"]


class TradeResponse(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    from_sticker_codes: List[str]
    to_sticker_codes: List[str]
    status: Literal["pending", "accepted", "rejected", "cancelled"]
    message: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
