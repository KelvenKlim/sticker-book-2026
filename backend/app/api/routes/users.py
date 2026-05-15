from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import UserResponse, UserStickerResponse, UserStickerUpdate, StatsResponse
from app.models import User, Sticker, UserSticker, StickerStatus as StickerStatusEnum
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obter informações do usuário atual"""
    return current_user


@router.get("/me/stickers", response_model=List[UserStickerResponse])
async def get_my_stickers(
    status: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar figurinhas do usuário"""
    # Buscar todas as figurinhas
    all_stickers = db.query(Sticker).order_by(Sticker.id).all()
    
    # Buscar figurinhas do usuário
    user_stickers_query = db.query(UserSticker).filter(
        UserSticker.user_id == current_user.id
    )
    
    if status:
        user_stickers_query = user_stickers_query.filter(UserSticker.status == status)
    
    user_stickers_map = {
        us.sticker_id: us for us in user_stickers_query.all()
    }
    
    # Combinar com informações das figurinhas
    result = []
    for sticker in all_stickers:
        user_sticker = user_stickers_map.get(sticker.id)
        
        sticker_data = {
            "id": sticker.id,
            "code": sticker.code,
            "category": sticker.category,
            "group": sticker.group,
            "group_name": sticker.group_name,
            "number": sticker.number,
            "status": user_sticker.status if user_sticker else "missing",
            "duplicates": user_sticker.duplicates if user_sticker else 0,
        }
        
        if status is None or (user_sticker and user_sticker.status == status):
            result.append(sticker_data)
    
    return result


@router.put("/me/stickers/{code}", response_model=UserStickerResponse)
async def update_my_sticker(
    code: str,
    update_data: UserStickerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar status de uma figurinha"""
    # Buscar figurinha
    sticker = db.query(Sticker).filter(Sticker.code == code).first()
    
    if not sticker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Figurinha não encontrada",
        )
    
    # Buscar ou criar UserSticker
    user_sticker = db.query(UserSticker).filter(
        UserSticker.user_id == current_user.id,
        UserSticker.sticker_id == sticker.id,
    ).first()
    
    if user_sticker:
        user_sticker.status = update_data.status
        user_sticker.duplicates = update_data.duplicates
    else:
        user_sticker = UserSticker(
            user_id=current_user.id,
            sticker_id=sticker.id,
            status=update_data.status,
            duplicates=update_data.duplicates,
        )
        db.add(user_sticker)
    
    db.commit()
    db.refresh(user_sticker)
    
    return {
        "id": sticker.id,
        "code": sticker.code,
        "category": sticker.category,
        "group": sticker.group,
        "group_name": sticker.group_name,
        "number": sticker.number,
        "status": user_sticker.status,
        "duplicates": user_sticker.duplicates,
    }


@router.get("/me/stats", response_model=StatsResponse)
async def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter estatísticas do usuário"""
    total = db.query(Sticker).count()
    
    owned_count = db.query(UserSticker).filter(
        UserSticker.user_id == current_user.id,
        UserSticker.status.in_([StickerStatusEnum.OWNED, StickerStatusEnum.DUPLICATE])
    ).count()
    
    duplicates_sum = db.query(UserSticker).filter(
        UserSticker.user_id == current_user.id,
        UserSticker.status == StickerStatusEnum.DUPLICATE
    ).with_entities(UserSticker.duplicates).all()
    
    total_duplicates = sum(d[0] for d in duplicates_sum if d[0])
    
    missing = total - owned_count
    percentage = (owned_count / total * 100) if total > 0 else 0
    
    return {
        "total": total,
        "owned": owned_count,
        "missing": missing,
        "duplicates": total_duplicates,
        "percentage": round(percentage, 2),
    }
