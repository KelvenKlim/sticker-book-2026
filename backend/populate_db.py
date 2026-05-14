"""
Script para popular o banco de dados com todas as figurinhas da Copa 2026
"""
from app.db.database import SessionLocal
from app.models import Sticker, StickerCategory

# Dados dos times
TEAMS = [
    {"code": "MEX", "name": "México"},
    {"code": "RSA", "name": "África do Sul"},
    {"code": "KOR", "name": "Coreia do Sul"},
    {"code": "CZE", "name": "República Tcheca"},
    {"code": "CAN", "name": "Canadá"},
    {"code": "BIH", "name": "Bósnia e Herzegovina"},
    {"code": "QAT", "name": "Catar"},
    {"code": "SUI", "name": "Suíça"},
    {"code": "BRA", "name": "Brasil"},
    {"code": "MAR", "name": "Marrocos"},
    {"code": "HAI", "name": "Haiti"},
    {"code": "SCO", "name": "Escócia"},
    {"code": "USA", "name": "Estados Unidos"},
    {"code": "PAR", "name": "Paraguai"},
    {"code": "AUS", "name": "Austrália"},
    {"code": "TUR", "name": "Turquia"},
    {"code": "GER", "name": "Alemanha"},
    {"code": "CUW", "name": "Curaçao"},
    {"code": "CIV", "name": "Costa do Marfim"},
    {"code": "ECU", "name": "Equador"},
    {"code": "NED", "name": "Holanda"},
    {"code": "JPN", "name": "Japão"},
    {"code": "SWE", "name": "Suécia"},
    {"code": "TUN", "name": "Tunísia"},
    {"code": "BEL", "name": "Bélgica"},
    {"code": "EGY", "name": "Egito"},
    {"code": "IRN", "name": "Irã"},
    {"code": "NZL", "name": "Nova Zelândia"},
    {"code": "ESP", "name": "Espanha"},
    {"code": "CPV", "name": "Cabo Verde"},
    {"code": "KSA", "name": "Arábia Saudita"},
    {"code": "URU", "name": "Uruguai"},
    {"code": "FRA", "name": "França"},
    {"code": "SEN", "name": "Senegal"},
    {"code": "IRQ", "name": "Iraque"},
    {"code": "NOR", "name": "Noruega"},
    {"code": "ARG", "name": "Argentina"},
    {"code": "ALG", "name": "Argélia"},
    {"code": "AUT", "name": "Áustria"},
    {"code": "JOR", "name": "Jordânia"},
    {"code": "POR", "name": "Portugal"},
    {"code": "COD", "name": "RD Congo"},
    {"code": "UZB", "name": "Uzbequistão"},
    {"code": "COL", "name": "Colômbia"},
    {"code": "ENG", "name": "Inglaterra"},
    {"code": "CRO", "name": "Croácia"},
    {"code": "GHA", "name": "Gana"},
    {"code": "PAN", "name": "Panamá"},
]


def populate_stickers():
    db = SessionLocal()
    
    try:
        # Verificar se já existem figurinhas
        existing = db.query(Sticker).count()
        if existing > 0:
            print(f"Banco já contém {existing} figurinhas. Pulando população.")
            return
        
        stickers = []
        
        # Especial 00
        stickers.append(
            Sticker(
                code="00",
                category=StickerCategory.SPECIAL,
                group="FWC",
                group_name="Especial",
                number=0,
            )
        )
        
        # FIFA World Cup (FWC1-FWC8)
        for i in range(1, 9):
            stickers.append(
                Sticker(
                    code=f"FWC{i}",
                    category=StickerCategory.SPECIAL,
                    group="FWC",
                    group_name="FIFA World Cup",
                    number=i,
                )
            )
        
        # Times (cada time tem 20 figurinhas)
        for team in TEAMS:
            for i in range(1, 21):
                stickers.append(
                    Sticker(
                        code=f"{team['code']}{i}",
                        category=StickerCategory.COUNTRY,
                        group=team['code'],
                        group_name=team['name'],
                        number=i,
                    )
                )
        
        # Coca-Cola (CC1-CC14)
        for i in range(1, 15):
            stickers.append(
                Sticker(
                    code=f"CC{i}",
                    category=StickerCategory.COCACOLA,
                    group="CC",
                    group_name="Coca-Cola",
                    number=i,
                )
            )
        
        # Adicionar todas de uma vez
        db.bulk_save_objects(stickers)
        db.commit()
        
        print(f"✅ {len(stickers)} figurinhas adicionadas com sucesso!")
        print(f"   - Especiais: 9 (00, FWC1-FWC8)")
        print(f"   - Seleções: {len(TEAMS) * 20}")
        print(f"   - Coca-Cola: 14")
        
    except Exception as e:
        print(f"❌ Erro ao popular banco: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("Populando banco de dados com figurinhas...")
    populate_stickers()
