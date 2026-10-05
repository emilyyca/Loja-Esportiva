# 🏀 Loja Esportiva — CRUD de itens esportivos

> **Projeto de teste da IDE [Antigravity](https://antigravity.google/).**
> A aplicação foi gerada por agentes de IA dentro do Antigravity a partir de uma especificação de atividade de programação: *"criar uma aplicação completa para cadastrar itens esportivos, com API, banco de dados e interface web"*. O objetivo principal é **avaliar como a IDE e seus agentes lidam com um projeto full stack de ponta a ponta** — planejamento, backend, frontend, testes e preparação de deploy.

Os arquivos [`Contexto.md`](Contexto.md) e [`Roadmap.md`](Roadmap.md) são resquícios desse fluxo: foram usados pelos agentes como memória técnica e plano de execução entre uma etapa e outra. Após a geração, o projeto passou por uma rodada de revisão e ajustes para ficar pronto para produção (principalmente adaptação para a Vercel, mais detalhes [abaixo](#-ajustes-feitos-após-a-geração-pelos-agentes)).

---

## 📋 O que a aplicação faz

Uma loja esportiva pode **cadastrar, listar, editar e excluir** itens (tênis, bolas, camisas...). Cada item possui:

| Campo    | Tipo   | Regras                                   |
|----------|--------|------------------------------------------|
| `marca`  | String | Obrigatório, até 100 caracteres          |
| `modelo` | String | Obrigatório, até 100 caracteres          |
| `preco`  | Number | Obrigatório, maior ou igual a 0          |
| `foto`   | String | Opcional, URL `http(s)` de uma imagem    |

Na interface: grid de cards responsivo, formulário de cadastro/edição, modal de confirmação para exclusão, estados de carregamento e lista vazia, mensagens de sucesso/erro, fallback para imagens quebradas e preços formatados em R$.

---

## 🧩 Como funciona

O projeto é dividido em duas partes independentes que conversam por HTTP/JSON:

```
┌──────────────────────┐    fetch (JSON)     ┌──────────────────────┐    Mongoose    ┌────────────────┐
│  Frontend (estático) │  ───────────────▶   │  Backend (Express)   │  ───────────▶  │ MongoDB Atlas  │
│  HTML + CSS + JS     │  ◀───────────────   │  API REST /api/...   │  ◀───────────  │  coleção items │
└──────────────────────┘                     └──────────────────────┘                └────────────────┘
      Vercel (projeto 1)                           Vercel (projeto 2, serverless)
```

1. O **frontend** (`frontend/`) é HTML/CSS/JavaScript puro, sem frameworks nem build. O `js/app.js` usa `fetch` para consumir a API; a URL da API fica em `js/config.js`.
2. O **backend** (`backend/`) é uma API REST em **Node.js + Express** que valida a requisição (ID, JSON, campos), executa a operação via **Mongoose** e devolve JSON com os códigos HTTP adequados.
3. O **MongoDB Atlas** guarda os dados na coleção `items`.
4. Na **Vercel**, o backend roda como *função serverless* (`backend/api/index.js` exporta o app Express) e o frontend é servido como site estático. Em ambiente serverless a conexão com o banco é reaproveitada entre requisições (`src/config/database.js`) e há um middleware (`ensureDb`) que garante a conexão antes de tocar nas rotas.

### Endpoints

| Método | Endpoint         | Descrição                |
|--------|------------------|--------------------------|
| GET    | `/api/health`    | Health check             |
| GET    | `/api/items`     | Lista todos os itens     |
| GET    | `/api/items/:id` | Busca item por ID        |
| POST   | `/api/items`     | Cria item                |
| PUT    | `/api/items/:id` | Atualiza item            |
| DELETE | `/api/items/:id` | Exclui item              |

Documentação completa com exemplos e erros: [`api.md`](api.md).

---

## 🛠️ Tecnologias

- **Backend:** Node.js, Express 5, Mongoose, dotenv, cors
- **Banco:** MongoDB (Atlas)
- **Frontend:** HTML5, CSS3 responsivo, JavaScript ES6+
- **Testes:** script próprio + `mongodb-memory-server` (MongoDB em memória)
- **Deploy:** Vercel

---

## 📁 Estrutura

```
loja-esportiva/
├── backend/
│   ├── api/index.js              # entrada serverless (Vercel)
│   ├── src/
│   │   ├── app.js                # configura o Express (CORS, rotas, erros)
│   │   ├── server.js             # sobe o servidor local (npm start / dev)
│   │   ├── config/database.js    # conexão com MongoDB (reutilizável em serverless)
│   │   ├── controllers/itemController.js
│   │   ├── middlewares/          # errorHandler, validateId, ensureDb
│   │   ├── models/Item.js
│   │   └── routes/               # itemRoutes, healthRoute
│   ├── scripts/seed.js           # popula o banco com itens de exemplo
│   ├── tests/                    # testes automatizados da API
│   ├── vercel.json
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/config.js              # URL da API (editar antes do deploy)
│   ├── js/app.js
│   └── vercel.json
├── GUIA-DEPLOY.md                # passo a passo: MongoDB Atlas + Vercel
├── api.md  Contexto.md  Roadmap.md
└── README.md
```

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 22+ e uma connection string do MongoDB (Atlas gratuito ou MongoDB local).

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # edite MONGODB_URI com a sua connection string
npm run dev                 # API em http://localhost:3000

# (opcional) inserir itens de exemplo
npm run seed
```

```bash
# 2. Frontend (em outro terminal) — qualquer servidor estático serve
cd frontend
npx serve . -l 5500         # ou: python -m http.server 5500
# abra http://localhost:5500
```

Localmente o frontend aponta automaticamente para `http://localhost:3000/api`.

### Testes

```bash
cd backend
npm test
```

Sobe um MongoDB em memória (baixa o binário na primeira execução), inicia a API e executa 23 verificações: health, CRUD completo, validações, IDs inválidos/inexistentes e JSON inválido.

---

## ☁️ Deploy (Vercel + MongoDB Atlas)

Resumo — o passo a passo detalhado, com solução de problemas, está em **[GUIA-DEPLOY.md](GUIA-DEPLOY.md)**:

1. Criar o cluster gratuito no **MongoDB Atlas**, um usuário de banco e liberar o acesso de rede (`0.0.0.0/0`).
2. Subir o repositório no GitHub.
3. Criar na Vercel o projeto do **backend** (Root Directory: `backend`) com as variáveis `MONGODB_URI` e `CORS_ORIGIN`.
4. Colocar a URL do backend em `frontend/js/config.js`.
5. Criar na Vercel o projeto do **frontend** (Root Directory: `frontend`).
6. Atualizar `CORS_ORIGIN` no backend com a URL do frontend e fazer redeploy.

### Variáveis de ambiente (backend)

| Variável      | Obrigatória | Exemplo                                                        |
|---------------|-------------|----------------------------------------------------------------|
| `MONGODB_URI` | Sim         | `mongodb+srv://user:senha@cluster.mongodb.net/loja-esportiva`  |
| `CORS_ORIGIN` | Recomendada | `https://minha-loja.vercel.app` (várias origens separadas por vírgula; vazio libera todas) |
| `PORT`        | Não         | `3000` (só uso local)                                          |

---

## 🔧 Ajustes feitos após a geração pelos agentes

Para deixar o projeto pronto para produção, foram feitas estas correções sobre o código gerado:

- **Vercel/serverless:** separação em `app.js` (Express), `server.js` (local) e `api/index.js` (Vercel); `vercel.json` migrado do formato legado `builds` para `rewrites`.
- **Conexão com o banco:** conexão reaproveitável com cache + middleware `ensureDb`, que responde `503` com mensagem clara se o banco estiver inacessível (antes a requisição ficava pendurada).
- **Frontend:** URL da API configurável (`config.js`) em vez de fixa em `localhost`; botões dos cards agora usam `addEventListener` no lugar de `onclick` inline, evitando quebra/injeção de HTML com aspas em marca/modelo.
- **API:** tolera requisições sem body (antes dava erro 500) e valida que `foto` seja URL `http(s)`.
- **Extras:** `npm run seed`, `.gitignore` na raiz e este guia de deploy.

## 📝 Observações sobre o teste da IDE

- O fluxo com agentes gerou uma base **organizada e coerente** (arquitetura em camadas, validações, tratamento de erros, testes e documentação), mas deixou **a validação final (testes e deploy) pendente** — ver [`Roadmap.md`](Roadmap.md).
- Foram necessários ajustes manuais pontuais, listados acima.

## 🔮 Possíveis evoluções

Upload de imagens (hoje só URL), busca/filtros e paginação, categorias de esporte, estoque, autenticação para as rotas de escrita e rate limiting.
