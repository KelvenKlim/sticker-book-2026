from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from app.db.database import get_db
from app.schemas import TradeCreate, TradeUpdate, TradeResponse
from app.models import Trade, User, TradeStatus
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TradeResponse])
async def get_trades(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar trocas do usuário (enviadas e recebidas)"""
    trades = db.query(Trade).filter(
        (Trade.from_user_id == current_user.id) | (Trade.to_user_id == current_user.id)
    ).order_by(Trade.created_at.desc()).all()
    
    result = []
    for trade in trades:
        result.append({
            "id": trade.id,
            "from_user_id": trade.from_user_id,
            "to_user_id": trade.to_user_id,
            "from_sticker_codes": json.loads(trade.from_sticker_codes),
            "to_sticker_codes": json.loads(trade.to_sticker_codes),
            "status": trade.status,
            "message": trade.message,
            "created_at": trade.created_at,
            "updated_at": trade.updated_at,
        })
    
    return result


@router.post("/", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
async def create_trade(
    trade_data: TradeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar proposta de troca"""
    # Verificar se o usuário destino existe
    to_user = db.query(User).filter(User.id == trade_data.to_user_id).first()
    
    if not to_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado",
        )
    
    if to_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível criar troca consigo mesmo",
        )
    
    # Criar troca
    trade = Trade(
        from_user_id=current_user.id,
        to_user_id=trade_data.to_user_id,
        from_sticker_codes=json.dumps(trade_data.from_sticker_codes),
        to_sticker_codes=json.dumps(trade_data.to_sticker_codes),
        message=trade_data.message,
        status=TradeStatus.PENDING,
    )
    
    db.add(trade)
    db.commit()
    db.refresh(trade)
    
    return {
        "id": trade.id,
        "from_user_id": trade.from_user_id,
        "to_user_id": trade.to_user_id,
        "from_sticker_codes": json.loads(trade.from_sticker_codes),
        "to_sticker_codes": json.loads(trade.to_sticker_codes),
        "status": trade.status,
        "message": trade.message,
        "created_at": trade.created_at,
        "updated_at": trade.updated_at,
    }


@router.put("/{trade_id}", response_model=TradeResponse)
async def update_trade(
    trade_id: int,
    update_data: TradeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar status da troca (aceitar/rejeitar/cancelar)"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Troca não encontrada",
        )
    
    # Verificar permissões
    if update_data.status == "cancelled" and trade.from_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas quem enviou pode cancelar",
        )
    
    if update_data.status in ["accepted", "rejected"] and trade.to_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas quem recebeu pode aceitar ou rejeitar",
        )
    
    if trade.status != TradeStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Troca já foi processada",
        )
    
    trade.status = update_data.status
    db.commit()
    db.refresh(trade)
    
    return {
        "id": trade.id,
        "from_user_id": trade.from_user_id,
        "to_user_id": trade.to_user_id,
        "from_sticker_codes": json.loads(trade.from_sticker_codes),
        "to_sticker_codes": json.loads(trade.to_sticker_codes),
        "status": trade.status,
        "message": trade.message,
        "created_at": trade.created_at,
        "updated_at": trade.updated_at,
    }


@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trade(
    trade_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar troca"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Troca não encontrada",
        )
    
    if trade.from_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas quem criou pode deletar",
        )
    
    db.delete(trade)
    db.commit()
    
    return None
