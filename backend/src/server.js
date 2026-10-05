// Inicia o servidor HTTP (uso local / servidores tradicionais). Na Vercel, veja api/index.js.
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Conecta já na inicialização para avisar cedo se a MONGODB_URI estiver errada
  connectDB().catch((err) => console.error(`Erro ao conectar ao MongoDB: ${err.message}`));
});
