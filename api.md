# Documentação da API — Loja Esportiva

## URL Base

- **Local**: `http://localhost:3000`
- **Produção (Vercel)**: `https://SEU-BACKEND.vercel.app`

---

## Health Check

Verifica se a API está funcionando.

### `GET /api/health`

Não depende do banco: `database` indica se já há conexão ativa com o MongoDB (em serverless pode aparecer `disconnected` até a primeira requisição que use o banco).

**Resposta (200):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Exemplo com curl:**
```bash
curl http://localhost:3000/api/health
```

---

## Endpoints de Itens

### Listar todos os itens

#### `GET /api/items`

Retorna todos os itens cadastrados, ordenados por data de criação (mais recentes primeiro).

**Resposta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "marca": "Nike",
    "modelo": "Air Max 90",
    "preco": 599.90,
    "foto": "https://exemplo.com/nike-air-max.jpg",
    "createdAt": "2026-09-29T10:00:00.000Z",
    "updatedAt": "2026-09-29T10:00:00.000Z",
    "__v": 0
  }
]
```

**Exemplo com curl:**
```bash
curl http://localhost:3000/api/items
```

---

### Buscar item por ID

#### `GET /api/items/:id`

**Parâmetros de URL:**
| Parâmetro | Tipo     | Descrição        |
|-----------|----------|------------------|
| id        | ObjectId | ID do item       |

**Resposta (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "marca": "Nike",
  "modelo": "Air Max 90",
  "preco": 599.90,
  "foto": "https://exemplo.com/nike-air-max.jpg",
  "createdAt": "2026-09-29T10:00:00.000Z",
  "updatedAt": "2026-09-29T10:00:00.000Z",
  "__v": 0
}
```

**Erro — ID inválido (400):**
```json
{
  "error": "ID inválido",
  "message": "O valor 'abc123' não é um ID MongoDB válido"
}
```

**Erro — Item não encontrado (404):**
```json
{
  "error": "Item não encontrado",
  "message": "Nenhum item encontrado com o ID '64f1a2b3c4d5e6f7a8b9c0d1'"
}
```

**Exemplo com curl:**
```bash
curl http://localhost:3000/api/items/64f1a2b3c4d5e6f7a8b9c0d1
```

---

### Criar novo item

#### `POST /api/items`

**Headers:**
```
Content-Type: application/json
```

**Body:**
| Campo   | Tipo   | Obrigatório | Descrição                          |
|---------|--------|-------------|------------------------------------|
| marca   | String | Sim         | Marca do item (máx 100 caracteres) |
| modelo  | String | Sim         | Modelo do item (máx 100 caracteres)|
| preco   | Number | Sim         | Preço (>= 0)                      |
| foto    | String | Não         | URL `http(s)` da imagem            |

**Exemplo de body:**
```json
{
  "marca": "Nike",
  "modelo": "Air Max 90",
  "preco": 599.90,
  "foto": "https://exemplo.com/nike-air-max.jpg"
}
```

**Resposta (201):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "marca": "Nike",
  "modelo": "Air Max 90",
  "preco": 599.90,
  "foto": "https://exemplo.com/nike-air-max.jpg",
  "createdAt": "2026-09-29T10:00:00.000Z",
  "updatedAt": "2026-09-29T10:00:00.000Z",
  "__v": 0
}
```

**Erro — Dados inválidos (400):**
```json
{
  "error": "Dados inválidos",
  "messages": [
    "A marca é obrigatória",
    "O preço é obrigatório"
  ]
}
```

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Nike",
    "modelo": "Air Max 90",
    "preco": 599.90,
    "foto": "https://exemplo.com/nike-air-max.jpg"
  }'
```

---

### Atualizar item

#### `PUT /api/items/:id`

**Headers:**
```
Content-Type: application/json
```

**Parâmetros de URL:**
| Parâmetro | Tipo     | Descrição   |
|-----------|----------|-------------|
| id        | ObjectId | ID do item  |

**Body:** Mesmos campos do POST (todos opcionais na prática, mas validados pelo Mongoose).

**Resposta (200):** Retorna o item atualizado.

**Erros possíveis:**
- 400: ID inválido ou dados inválidos
- 404: Item não encontrado

**Exemplo com curl:**
```bash
curl -X PUT http://localhost:3000/api/items/64f1a2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Nike",
    "modelo": "Air Max 95",
    "preco": 699.90,
    "foto": "https://exemplo.com/nike-air-max-95.jpg"
  }'
```

---

### Excluir item

#### `DELETE /api/items/:id`

**Parâmetros de URL:**
| Parâmetro | Tipo     | Descrição   |
|-----------|----------|-------------|
| id        | ObjectId | ID do item  |

**Resposta (200):**
```json
{
  "message": "Item excluído com sucesso",
  "item": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "marca": "Nike",
    "modelo": "Air Max 90",
    "preco": 599.90,
    "foto": "https://exemplo.com/nike-air-max.jpg",
    "createdAt": "2026-09-29T10:00:00.000Z",
    "updatedAt": "2026-09-29T10:00:00.000Z",
    "__v": 0
  }
}
```

**Erros possíveis:**
- 400: ID inválido
- 404: Item não encontrado

**Exemplo com curl:**
```bash
curl -X DELETE http://localhost:3000/api/items/64f1a2b3c4d5e6f7a8b9c0d1
```

---

## Códigos HTTP

| Código | Significado                |
|--------|----------------------------|
| 200    | Operação realizada         |
| 201    | Recurso criado             |
| 400    | Dados inválidos / ID inválido |
| 404    | Recurso não encontrado     |
| 500    | Erro interno do servidor   |
| 503    | Banco de dados indisponível |

---

## Configuração do MongoDB

### Usando MongoDB Atlas (recomendado)

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito (M0)
3. Crie um usuário do banco de dados
4. Configure o Network Access (adicione seu IP; para a Vercel use `0.0.0.0/0`)
5. Obtenha a connection string
6. Copie o arquivo `.env.example` para `.env`
7. Cole a connection string em `MONGODB_URI`

### Usando MongoDB local

1. Instale o MongoDB Community Server
2. Inicie o serviço
3. Use `MONGODB_URI=mongodb://localhost:27017/loja-esportiva`

---

## Executar a API localmente

```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do MongoDB

# 4. Inicie a API
npm run dev

# 5. Verifique se está funcionando
curl http://localhost:3000/api/health
```

A API estará disponível em `http://localhost:3000`.

---

## Erro de banco indisponível

Se a API não conseguir conectar ao MongoDB, as rotas `/api/items` respondem **503**:

```json
{
  "error": "Banco de dados indisponível",
  "message": "Não foi possível conectar ao MongoDB. Verifique MONGODB_URI e o Network Access no Atlas."
}
```

Veja o passo a passo de deploy em [GUIA-DEPLOY.md](GUIA-DEPLOY.md).
