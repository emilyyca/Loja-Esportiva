const { connectDB } = require('../config/database');

// Garante que o banco está conectado antes de processar rotas que usam o MongoDB.
const ensureDb = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    res.status(503).json({
      error: 'Banco de dados indisponível',
      message:
        'Não foi possível conectar ao MongoDB. Verifique MONGODB_URI e o Network Access no Atlas.',
    });
  }
};

module.exports = ensureDb;
