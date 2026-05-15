from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api.routes import auth, stickers, users, trades

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sticker Book API",
    description="API para controle de figurinhas da Copa do Mundo 2026",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(stickers.router, prefix="/api/stickers", tags=["stickers"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(trades.router, prefix="/api/trades", tags=["trades"])


@app.get("/")
async def root():
    return {
        "message": "Sticker Book API - Copa do Mundo 2026",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
