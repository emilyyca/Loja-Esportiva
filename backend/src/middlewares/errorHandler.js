const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err.message);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Dados inválidos',
      messages,
    });
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      message: `O valor '${err.value}' não é um ID válido`,
    });
  }

  // Erro de JSON inválido
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'O corpo da requisição contém JSON inválido',
    });
  }

  // Erro genérico
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Erro interno do servidor'
      : err.message;

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;
