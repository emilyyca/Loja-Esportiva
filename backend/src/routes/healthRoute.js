const express = require('express');
const { getConnectionStatus } = require('../config/database');
const router = express.Router();

// Health check simples (não depende do banco)
router.get('/', (req, res) => {
  res.json({ status: 'ok', database: getConnectionStatus() ? 'connected' : 'disconnected' });
});

module.exports = router;
