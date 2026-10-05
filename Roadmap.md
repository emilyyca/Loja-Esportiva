# Roadmap

## Fase 1 — Planejamento
- [x] Analisar requisitos
- [x] Verificar ambiente (Node.js 24.11.1, npm 11.6.2, Git 2.49.0)
- [x] Verificar compatibilidade Vercel (Node.js 24 suportado)
- [x] Identificar limitação: MongoDB não instalado localmente → usar MongoDB Atlas
- [x] Definir arquitetura (API REST + Frontend separado)
- [x] Definir estrutura de pastas

## Fase 2 — Backend
- [x] Inicializar Node.js (package.json)
- [x] Configurar Express
- [x] Configurar conexão MongoDB (Mongoose)
- [x] Criar model Item
- [x] Criar rotas (itemRoutes, healthRoute)
- [x] Criar controllers (itemController)
- [x] Criar middlewares (errorHandler, validateId)
- [x] Implementar validações (campos obrigatórios, preço não negativo)
- [x] Implementar tratamento de erros
- [x] Configurar CORS
- [x] Criar .env.example
- [x] Criar .gitignore
- [x] Instalar dependências (npm install)

## Fase 3 — API
- [x] GET /api/health
- [x] GET /api/items
- [x] GET /api/items/:id
- [x] POST /api/items
- [x] PUT /api/items/:id
- [x] DELETE /api/items/:id
- [x] GET / (rota raiz com informações da API)
- [x] 404 handler para rotas não encontradas
- [x] Testar todos os endpoints

## Fase 4 — Frontend
- [x] Criar HTML (index.html)
- [x] Criar CSS (style.css) com responsividade
- [x] Criar JavaScript (app.js)
- [x] Implementar listagem com grid de cards
- [x] Implementar cadastro com formulário
- [x] Implementar edição (carregar dados no formulário)
- [x] Implementar exclusão com modal de confirmação
- [x] Implementar tratamento de imagem com fallback
- [x] Implementar mensagens de sucesso/erro
- [x] Implementar estado de carregamento
- [x] Implementar estado vazio
- [x] Implementar escape de HTML (segurança XSS)

## Fase 5 — Testes
- [x] Testar health check
- [x] Testar listagem de itens
- [x] Testar criação com dados válidos
- [x] Testar validações (marca ausente, modelo ausente, preço ausente/negativo/inválido)
- [x] Testar consulta por ID (válido, inexistente, inválido)
- [x] Testar atualização
- [x] Testar exclusão
- [x] Testar JSON inválido
- [ ] Testar frontend manualmente (com a API e o banco reais)

## Fase 6 — Deploy
- [x] Criar vercel.json
- [x] Configurar export do app para Vercel
- [ ] Configurar variáveis de ambiente na Vercel (passo do dono do projeto)
- [ ] Validar API em produção (passo do dono do projeto)
- [x] Documentar deploy (GUIA-DEPLOY.md)

## Fase 7 — Finalização
- [x] Atualizar documentação final
- [x] Revisar código
- [x] Corrigir problemas encontrados
- [x] Executar testes finais
