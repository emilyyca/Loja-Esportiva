require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const healthRoute = require('./routes/healthRoute');
const ensureDb = require('./middlewares/ensureDb');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS — CORS_ORIGIN aceita várias origens separadas por vírgula.
// Sem CORS_ORIGIN, libera qualquer origem (útil em desenvolvimento).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean)
  : null;

app.use(
  cors({
    origin: allowedOrigins || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

// Parse JSON
app.use(express.json());

// Rotas
app.use('/api/health', healthRoute);
app.use('/api/items', ensureDb, itemRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Loja Esportiva',
    endpoints: {
      health: '/api/health',
      items: '/api/items',
    },
  });
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use(errorHandler);

// O app apenas é exportado:
//  - localmente quem inicia o servidor é src/server.js
//  - na Vercel quem o usa é api/index.js
module.exports = app;
