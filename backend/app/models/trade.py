from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
import enum


class TradeStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    from_sticker_codes = Column(String, nullable=False)  # JSON array as string
    to_sticker_codes = Column(String, nullable=False)  # JSON array as string
    status = Column(Enum(TradeStatus), default=TradeStatus.PENDING)
    message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="trades_sent")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="trades_received")
