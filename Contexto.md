# Contexto do Projeto

## Objetivo

Aplicação web para cadastrar, consultar, editar e excluir itens esportivos de uma loja. Sistema CRUD completo com API REST no backend e interface web separada no frontend.

## Arquitetura

- **Backend**: API REST com Node.js + Express + Mongoose
- **Frontend**: HTML/CSS/JavaScript puro, consumindo a API via `fetch`
- **Banco de dados**: MongoDB (via MongoDB Atlas, pois não há MongoDB local)
- **Deploy**: Backend preparado para Vercel (serverless)
- **Comunicação**: JSON via HTTP, com CORS configurado

## Stack

- Node.js 22+ (engines 22.x, suportado pela Vercel)
- Express.js
- MongoDB (Atlas)
- Mongoose
- HTML5
- CSS3 (responsivo, sem frameworks)
- JavaScript (ES6+, sem frameworks)
- Vercel (deploy serverless)
- dotenv (variáveis de ambiente)
- cors (middleware)

## Estrutura

```
loja-esportiva/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── itemController.js
│   │   ├── models/
│   │   │   └── Item.js
│   │   ├── routes/
│   │   │   ├── itemRoutes.js
│   │   │   └── healthRoute.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js
│   │   │   ├── validateId.js
│   │   │   └── ensureDb.js
│   │   ├── app.js
│   │   └── server.js
│   ├── api/index.js
│   ├── scripts/seed.js
│   ├── tests/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── vercel.json
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── config.js
│       └── app.js
│
├── GUIA-DEPLOY.md
├── Roadmap.md
├── Contexto.md
├── api.md
└── README.md
```

## Banco de dados

### Model: Item

| Campo     | Tipo    | Regras                                        |
|-----------|---------|-----------------------------------------------|
| _id       | ObjectId| Gerado automaticamente                        |
| marca     | String  | Obrigatório, trim, máx 100 caracteres         |
| modelo    | String  | Obrigatório, trim, máx 100 caracteres         |
| preco     | Number  | Obrigatório, mínimo 0 (não pode ser negativo) |
| foto      | String  | Opcional, URL da imagem, default vazio         |
| createdAt | Date    | Gerado automaticamente (timestamps)           |
| updatedAt | Date    | Gerado automaticamente (timestamps)           |

## API

| Método | Endpoint          | Descrição                    |
|--------|-------------------|------------------------------|
| GET    | /api/health       | Health check                 |
| GET    | /api/items        | Listar todos os itens        |
| GET    | /api/items/:id    | Buscar item por ID           |
| POST   | /api/items        | Criar novo item              |
| PUT    | /api/items/:id    | Atualizar item existente     |
| DELETE | /api/items/:id    | Excluir item                 |
| GET    | /                 | Informações da API           |

## Frontend

### Funcionalidades implementadas
- Listagem de itens em grid de cards
- Formulário de cadastro com validação
- Edição de itens (carrega dados no formulário)
- Exclusão com modal de confirmação
- Exibição de imagens com fallback para URL quebrada
- Mensagens de sucesso e erro
- Estado de carregamento (loading)
- Estado vazio (nenhum item cadastrado)
- Escape de HTML para proteção contra XSS
- Layout responsivo (desktop e mobile)
- Formatação de preço em Real (BRL)

## Configuração

### Variáveis de ambiente (backend/.env)
```
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/loja-esportiva
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5500
```

### CORS
- Configurado via variável `CORS_ORIGIN` (aceita múltiplas origens separadas por vírgula)
- Em desenvolvimento, aceita qualquer origem se não configurado
- Métodos permitidos: GET, POST, PUT, DELETE
- Header permitido: Content-Type

## Decisões técnicas

1. **MongoDB Atlas em vez de local**: MongoDB não está instalado localmente. A aplicação usa MongoDB Atlas via `MONGODB_URI`.
2. **Node.js 22**: versão LTS suportada na Vercel; `engines` fixado em 22.x.
3. **`app.js` / `server.js` / `api/index.js`**: `app.js` só configura e exporta o Express; `server.js` sobe o servidor local; `api/index.js` é o handler serverless da Vercel. (Revisão pós-agentes: antes o `app.js` fazia tudo.)
4. **Foto como URL**: Na primeira versão, fotos são URLs externas. Sem upload de arquivos.
5. **`--watch` nativo**: Usando `node --watch` do Node.js em vez de `nodemon` para reduzir dependências.
6. **CORS configurável**: Origem controlada por variável de ambiente para flexibilidade entre dev e produção.

## Estado atual

- Backend e frontend completos e revisados
- Testes da API: 23 verificações passando (ver `backend/tests`)
- Conexão com MongoDB adaptada para serverless (cache + `ensureDb`, 503 se indisponível)
- Frontend com URL da API configurável (`frontend/js/config.js`)
- Documentação completa, incluindo `GUIA-DEPLOY.md`

## Pendente (depende de credenciais do dono do projeto)

- Criar cluster no MongoDB Atlas e obter `MONGODB_URI`
- Deploy do backend e do frontend na Vercel e ajuste de `CORS_ORIGIN`
- Validar o fluxo em produção

Ver `GUIA-DEPLOY.md`.
