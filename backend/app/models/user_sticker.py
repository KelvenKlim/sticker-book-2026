from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
import enum


class StickerStatus(str, enum.Enum):
    MISSING = "missing"
    OWNED = "owned"
    DUPLICATE = "duplicate"


class UserSticker(Base):
    __tablename__ = "user_stickers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sticker_id = Column(Integer, ForeignKey("stickers.id"), nullable=False)
    status = Column(Enum(StickerStatus), default=StickerStatus.MISSING)
    duplicates = Column(Integer, default=0)  # extra copies beyond the kept one
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="user_stickers")
    sticker = relationship("Sticker", back_populates="user_stickers")
