from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas import StickerResponse, UserStickerResponse, UserStickerUpdate, StatsResponse
from app.models import Sticker, UserSticker, User, StickerStatus
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[StickerResponse])
async def get_all_stickers(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Listar todas as figurinhas do catálogo"""
    query = db.query(Sticker)
    
    if category:
        query = query.filter(Sticker.category == category)
    
    stickers = query.order_by(Sticker.id).all()
    return stickers


@router.get("/{code}", response_model=StickerResponse)
async def get_sticker(code: str, db: Session = Depends(get_db)):
    """Obter detalhes de uma figurinha"""
    sticker = db.query(Sticker).filter(Sticker.code == code).first()
    
    if not sticker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Figurinha não encontrada",
        )
    
    return sticker
