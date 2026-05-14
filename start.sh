#!/bin/bash

echo "🚀 Iniciando Sticker Book 26..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}📦 Iniciando Backend...${NC}"
cd backend

# Verificar se ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências se necessário
if [ ! -f "venv/installed" ]; then
    echo "Instalando dependências do backend..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Copiar .env se não existir
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Arquivo .env criado"
fi

# Popular banco de dados
if [ ! -f "sticker_book.db" ]; then
    echo "Populando banco de dados..."
    python populate_db.py
fi

# Iniciar backend em background
echo -e "${GREEN}✅ Iniciando servidor backend na porta 8000...${NC}"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Frontend
echo ""
echo -e "${BLUE}📦 Iniciando Frontend...${NC}"
cd sticker-book-frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
fi

echo -e "${GREEN}✅ Iniciando servidor frontend na porta 5173...${NC}"
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo -e "${GREEN}✅ Aplicação iniciada com sucesso!${NC}"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para parar os servidores..."

# Aguardar interrupção
wait
