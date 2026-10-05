// Popula o banco com itens de exemplo: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../src/models/Item');

const itens = [
  { marca: 'Nike', modelo: 'Air Zoom Pegasus 40', preco: 799.9, foto: '' },
  { marca: 'Adidas', modelo: 'Bola Al Rihla Club', preco: 149.9, foto: '' },
  { marca: 'Puma', modelo: 'Camisa Treino Teamliga', preco: 119.9, foto: '' },
  { marca: 'Mizuno', modelo: 'Wave Rider 27', preco: 899.0, foto: '' },
  { marca: 'Olympikus', modelo: 'Corre 4', preco: 329.9, foto: '' },
];

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Defina MONGODB_URI no backend/.env antes de rodar o seed.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const total = await Item.countDocuments();
  if (total > 0 && !process.argv.includes('--force')) {
    console.log(`A coleção já tem ${total} item(ns). Use "npm run seed -- --force" para inserir mesmo assim.`);
  } else {
    await Item.insertMany(itens);
    console.log(`${itens.length} itens de exemplo inseridos.`);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
