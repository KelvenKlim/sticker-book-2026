# Backend - API Sticker Book 2026

Backend em FastAPI para o aplicativo de controle de figurinhas da Copa do Mundo 2026.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **Pydantic** - Validação de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **PostgreSQL** - Banco de dados (produção, opcional)
- **Uvicorn** - Servidor ASGI
- **Alembic** - Migrações de banco de dados

## 📋 Pré-requisitos

- Python 3.10 ou superior
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

### 1. Criar ambiente virtual

```bash
cd backend
python -m venv venv
```

### 2. Ativar ambiente virtual

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

## 🏃‍♂️ Executar

### Modo desenvolvimento (com auto-reload)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Modo produção

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

A API estará disponível em: `http://localhost:8000`

## 📚 Documentação

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. **users** - Usuários do sistema
2. **stickers** - Catálogo de figurinhas
3. **user_stickers** - Relacionamento usuário-figurinha (owned/duplicates)
4. **trades** - Trocas entre usuários

## 🔑 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Figurinhas
- `GET /api/stickers` - Listar todas as figurinhas
- `GET /api/stickers/{code}` - Detalhes de uma figurinha
- `GET /api/users/me/stickers` - Minhas figurinhas
- `PUT /api/users/me/stickers/{code}` - Atualizar status de uma figurinha
- `GET /api/users/me/stats` - Estatísticas do usuário

### Trocas
- `GET /api/trades` - Listar trocas
- `POST /api/trades` - Criar proposta de troca
- `PUT /api/trades/{id}` - Atualizar status da troca

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer {seu-token}
```

## 🧪 Testes

```bash
pytest
```

## 📦 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL=sqlite:///./sticker_book.db
SECRET_KEY=seu-secret-key-super-secreto-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🚀 Deploy

### Usando Docker

```bash
docker build -t sticker-book-api .
docker run -p 8000:8000 sticker-book-api
```

### Usando Docker Compose

```bash
docker-compose up -d
```

---

Desenvolvido com ❤️ usando FastAPI
