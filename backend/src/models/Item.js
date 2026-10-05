const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'A marca é obrigatória'],
      trim: true,
      maxlength: [100, 'A marca deve ter no máximo 100 caracteres'],
    },
    modelo: {
      type: String,
      required: [true, 'O modelo é obrigatório'],
      trim: true,
      maxlength: [100, 'O modelo deve ter no máximo 100 caracteres'],
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo'],
    },
    foto: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (v) => !v || /^https?:\/\/\S+$/i.test(v),
        message: 'A foto deve ser uma URL http(s) válida',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
