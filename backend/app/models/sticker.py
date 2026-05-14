from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum


class StickerCategory(str, enum.Enum):
    SPECIAL = "special"
    COUNTRY = "country"
    COCACOLA = "cocacola"


class Sticker(Base):
    __tablename__ = "stickers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    category = Column(Enum(StickerCategory), nullable=False)
    group = Column(String, nullable=False)  # country code or "FWC" or "CC"
    group_name = Column(String, nullable=False)
    number = Column(Integer, nullable=False)

    # Relationships
    user_stickers = relationship("UserSticker", back_populates="sticker", cascade="all, delete-orphan")
