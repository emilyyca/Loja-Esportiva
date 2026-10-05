const mongoose = require('mongoose');

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      message: `O valor '${id}' não é um ID MongoDB válido`,
    });
  }

  next();
};

module.exports = validateId;
