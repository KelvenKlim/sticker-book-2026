from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_stickers = relationship("UserSticker", back_populates="user", cascade="all, delete-orphan")
    trades_sent = relationship("Trade", foreign_keys="Trade.from_user_id", back_populates="from_user")
    trades_received = relationship("Trade", foreign_keys="Trade.to_user_id", back_populates="to_user")
