# Sticker Book 26 ⚽️

Aplicação web fullstack para gerenciar sua coleção de figurinhas da Copa do Mundo 2026, permitindo acompanhar quais figurinhas você tem, quais estão faltando e gerenciar duplicatas e trocas.

---

## 🏗️ Arquitetura

Este projeto é dividido em duas partes:

- **Frontend** (`frontend/`) - Aplicação React com TanStack Router e autenticação JWT
- **Backend** (`backend/`) - API REST em FastAPI com SQLAlchemy e autenticação

## ✨ Funcionalidades

### Autenticação
- 🔐 Sistema completo de registro e login
- 🔑 Autenticação JWT com tokens seguros
- 👤 Cada usuário tem sua própria coleção
- 🚪 Logout e proteção de rotas

### Gerenciamento de Figurinhas
- � Dashboard com estatísticas gerais (total, coletadas, faltantes, repetidas)
- 📖 Álbum completo com 983 figurinhas:
  - 9 especiais FWC (00, FWC1-FWC8)
  - 960 de seleções (48 times × 20 figurinhas cada)
  - 14 Coca-Cola (CC1-CC14)
- 🔍 Filtros por categoria, time e status
- 🔎 Busca por código de figurinha
- ✅ Marcar figurinhas como: Faltante / Tenho / Repetida
- 🔢 Contador de repetidas
- 🔄 Lista de trocas (tenho para troca / procuro)
- 📋 Copiar resumo para compartilhar

---

## 📋 Pré-requisitos

### Para o Frontend
- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)

### Para o Backend
- **Python** (versão 3.8 ou superior)  
- **pip** (gerenciador de pacotes Python)

### Verificar instalação

```bash
# Node.js e npm
node --version
npm --version

# Python e pip
python3 --version
pip3 --version
```

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd sticker-book-26
```

### 2. Navegue para o diretório do frontend

```bash
cd sticker-book-frontend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

O projeto será iniciado e estará disponível em `http://localhost:5173` (ou outra porta, caso 5173 esteja ocupada).

## 📦 Scripts Disponíveis

No diretório `sticker-book-frontend`, você pode executar:

### `npm run dev`
Inicia o servidor de desenvolvimento.
- Abre o app em modo de desenvolvimento
- Recarrega automaticamente ao fazer alterações no código
- Mostra erros de lint no console

### `npm run build`
Compila o aplicativo para produção na pasta `dist`.
- Otimiza o código para melhor performance
- Minifica arquivos
- Prepara o app para deploy

### `npm run build:dev`
Compila o aplicativo em modo de desenvolvimento.
- Útil para testar a build sem otimizações de produção

### `npm run preview`
Visualiza a build de produção localmente.
- Execute após `npm run build`
- Testa a versão de produção antes do deploy

### `npm run lint`
Executa o ESLint para verificar problemas no código.
- Identifica erros e más práticas
- Ajuda a manter a qualidade do código

### `npm run format`
Formata o código usando Prettier.
- Aplica formatação consistente
- Corrige problemas de estilo automaticamente

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca para construção de interfaces
- **TanStack Router** - Roteamento para React com type-safety
- **TanStack Query** - Gerenciamento de estado do servidor
- **Vite** - Build tool e dev server ultra-rápido
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes de UI acessíveis e sem estilo
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first
- **LocalStorage** - Armazenamento local dos dados

## 📱 Funcionalidades

- ✅ Visualizar álbum de figurinhas
- ✅ Marcar figurinhas que você possui
- ✅ Ver lista de figurinhas faltantes
- ✅ Gerenciar figurinhas duplicadas
- ✅ Gerenciar trocas com outros colecionadores
- ✅ Interface responsiva para mobile e desktop

## 🏗️ Estrutura do Projeto

```
sticker-book-frontend/
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── ui/           # Componentes de UI (Radix UI)
│   │   ├── AppHeader.tsx
│   │   ├── BottomNav.tsx
│   │   ├── StickerCard.tsx
│   │   └── StickerSheet.tsx
│   ├── hooks/            # React Hooks customizados
│   ├── lib/              # Utilitários e funções auxiliares
│   ├── routes/           # Páginas/rotas da aplicação
│   ├── router.tsx        # Configuração de rotas
│   ├── server.ts         # Entry point do servidor
│   └── styles.css        # Estilos globais
├── package.json          # Dependências e scripts
├── vite.config.ts        # Configuração do Vite
├── tsconfig.json         # Configuração do TypeScript
└── tailwind.config.js    # Configuração do Tailwind CSS
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Notas

- Certifique-se de estar no diretório `sticker-book-frontend` antes de executar os comandos npm
- Em caso de problemas com dependências, tente remover `node_modules` e `package-lock.json` e executar `npm install` novamente
- Para melhores resultados, use a versão LTS mais recente do Node.js
- Os dados das figurinhas são armazenados localmente no navegador (LocalStorage)

## 🐛 Troubleshooting

### Página aparece em branco

1. Abra o console do navegador (F12) e verifique se há erros
2. Certifique-se de que o servidor está rodando em `http://localhost:5173`
3. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
4. Verifique se todos os arquivos foram criados corretamente:
   - `index.html` na raiz de `sticker-book-frontend`
   - `src/main.tsx` como entry point
   - `src/client.tsx` para hidratação

### Erros de dependências

```bash
# Limpe e reinstale as dependências
cd sticker-book-frontend
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso

Se a porta 5173 já estiver em uso, você pode:
- Parar o processo que está usando a porta
- Ou o Vite automaticamente usará outra porta disponível

## 📄 Licença

Este projeto é privado e de uso pessoal.

---

Desenvolvido com 💚💛 para colecionadores de figurinhas
