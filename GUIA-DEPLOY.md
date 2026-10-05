# 📦 Guia de Deploy — do zero até o site no ar

Tempo estimado: 20–30 minutos. Tudo usando planos gratuitos.

Você vai criar: **1 banco** (MongoDB Atlas) + **2 projetos na Vercel** (backend e frontend) a partir do **mesmo repositório do GitHub**.

---

## Checklist rápido

- [ ] 1. Criar o banco no MongoDB Atlas e copiar a connection string
- [ ] 2. Testar localmente (opcional, mas recomendado)
- [ ] 3. Subir o código para o GitHub
- [ ] 4. Deploy do **backend** na Vercel (Root Directory `backend`)
- [ ] 5. Colocar a URL do backend em `frontend/js/config.js` e dar push
- [ ] 6. Deploy do **frontend** na Vercel (Root Directory `frontend`)
- [ ] 7. Configurar `CORS_ORIGIN` no backend e redeploy
- [ ] 8. Testar tudo

---

## 1. MongoDB Atlas (banco de dados)

1. Acesse <https://www.mongodb.com/atlas> e crie uma conta.
2. **Create a deployment** → plano **M0 (Free)** → escolha qualquer região (ex.: São Paulo / AWS) → **Create**.
3. **Database User:** crie um usuário e senha.
   - ⚠️ Use uma senha **sem caracteres especiais** (`@ : / ? # %`), senão a connection string quebra. Prefira letras e números. Anote a senha.
4. **Network Access** (menu *Security → Network Access*) → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   - A Vercel não tem IP fixo, por isso é necessário liberar geral. A proteção fica por conta do usuário/senha.
5. **Connect → Drivers** → copie a connection string. Ela é parecida com:
   ```
   mongodb+srv://meuusuario:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Substitua `<password>` pela sua senha e **adicione o nome do banco** antes do `?`:
   ```
   mongodb+srv://meuusuario:minhasenha123@cluster0.abcde.mongodb.net/loja-esportiva?retryWrites=true&w=majority
   ```
   Essa é a sua `MONGODB_URI`. Não precisa criar coleção: o Mongoose cria `items` sozinho no primeiro cadastro.

---

## 2. Testar localmente (recomendado)

```bash
cd backend
npm install
cp .env.example .env
```

Abra o `.env` e cole sua `MONGODB_URI`. Depois:

```bash
npm run dev
```

Em outro terminal, `curl http://localhost:3000/api/items` deve retornar `[]`. Para ver dados de exemplo: `npm run seed`.

Frontend: `cd frontend && npx serve . -l 5500` e abra <http://localhost:5500>.

---

## 3. Subir para o GitHub

Na pasta raiz do projeto (`loja-esportiva/`):

```bash
git init
git add .
git commit -m "Loja esportiva - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/loja-esportiva.git
git push -u origin main
```

Crie antes o repositório vazio em <https://github.com/new>.
Confira que o `.env` **não** foi enviado (ele está no `.gitignore`).

---

## 4. Deploy do backend na Vercel

1. Em <https://vercel.com> faça login com o GitHub → **Add New… → Project** → importe o repositório.
2. Configure:
   - **Project Name:** por exemplo `loja-esportiva-api`
   - **Root Directory:** clique em *Edit* e selecione **`backend`**
   - **Framework Preset:** `Other`
   - Build/Output/Install commands: deixe o padrão
3. Abra **Environment Variables** e adicione:

   | Nome          | Valor                                          |
   |---------------|------------------------------------------------|
   | `MONGODB_URI` | a connection string do passo 1                 |
   | `CORS_ORIGIN` | deixe em branco por enquanto (volta no passo 7)|

4. **Deploy**.
5. Teste no navegador (troque pela sua URL):
   - `https://loja-esportiva-api.vercel.app/api/health` → `{"status":"ok","database":"disconnected"}` na primeira chamada é normal (o health não abre o banco)
   - `https://loja-esportiva-api.vercel.app/api/items` → `[]`

   Se o `/api/items` retornar `[]`, **banco e API estão funcionando**. 🎉

---

## 5. Configurar a URL da API no frontend

Edite `frontend/js/config.js` e troque a URL de produção pela do seu backend (**com `/api` no final, sem barra depois**):

```js
const PRODUCTION_API_URL = 'https://loja-esportiva-api.vercel.app/api';
```

Salve e envie:

```bash
git add .
git commit -m "Configura URL da API em produção"
git push
```

---

## 6. Deploy do frontend na Vercel

1. **Add New… → Project** → importe **o mesmo repositório** de novo.
2. Configure:
   - **Project Name:** por exemplo `loja-esportiva`
   - **Root Directory:** **`frontend`**
   - **Framework Preset:** `Other` (sem build command)
3. **Deploy**. Anote a URL final, por exemplo `https://loja-esportiva.vercel.app`.

---

## 7. Liberar o frontend no CORS do backend

1. Projeto do **backend** na Vercel → **Settings → Environment Variables**.
2. Edite/adicione `CORS_ORIGIN` = `https://loja-esportiva.vercel.app` (URL do frontend, **sem barra no final**).
   - Mais de uma origem? Separe por vírgula: `https://a.vercel.app,https://b.vercel.app`
3. **Deployments** → no último deploy, menu `⋯` → **Redeploy** (variáveis só valem após novo deploy).

---

## 8. Teste final

Abra a URL do frontend e:
- cadastre um item → deve aparecer no grid;
- edite o item;
- exclua o item (modal de confirmação).

No Atlas, em **Browse Collections**, você verá o banco `loja-esportiva` → coleção `items` com os dados.

---

## 🩺 Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `/api/items` retorna **503** "Banco de dados indisponível" | `MONGODB_URI` ausente/errada, ou IP não liberado | Confira a variável na Vercel (e redeploy); no Atlas, libere `0.0.0.0/0`; veja os logs em *Deployments → Logs* |
| Log com `bad auth` / `Authentication failed` | Usuário ou senha errados | Recrie o usuário no Atlas com senha simples e atualize a variável |
| Log com `querySrv ENOTFOUND` | Connection string mal formatada (senha com caractere especial, `<>` sobrando) | Use senha alfanumérica e remova os sinais `<` `>` |
| Frontend mostra "Erro ao carregar itens" e o console tem erro de **CORS** | `CORS_ORIGIN` diferente da URL do frontend, ou sem redeploy | Ajuste (sem barra final), redeploy do backend. Para testar, deixe `CORS_ORIGIN` vazio |
| Frontend chama `SEU-BACKEND.vercel.app` | Esqueceu o passo 5 ou não deu push antes do deploy do frontend | Edite `config.js`, push (a Vercel redeploya sozinha) |
| **404** em qualquer rota do backend na Vercel | Root Directory não está em `backend` | Settings → General → Root Directory = `backend` e redeploy |
| Funciona local, mas na Vercel dá erro de versão do Node | Versão do Node no projeto | Settings → General → Node.js Version = 22.x |
| Imagem do item não aparece | URL da foto não é pública/direta | Use link direto da imagem (termina em .jpg/.png) com `https://` |
| Primeira requisição demora alguns segundos | *Cold start* da função serverless + conexão com o Atlas | Normal no plano gratuito; as seguintes são rápidas |

---

## 🔁 Atualizações futuras

Basta fazer `git push` na branch `main`: a Vercel redeploya backend e frontend automaticamente.
