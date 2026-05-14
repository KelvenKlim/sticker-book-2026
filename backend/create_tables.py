"""
Script para criar as tabelas do banco de dados
"""
from app.db.database import engine, Base
from app.models import user, sticker

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    print("Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas com sucesso!")

if __name__ == "__main__":
    create_tables()
