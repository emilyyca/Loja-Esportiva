/**
 * Runner de testes — inicia MongoDB em memória e executa os testes da API
 */

const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  console.log('Iniciando MongoDB em memória...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`MongoDB em memória rodando: ${uri}`);

  // Configurar variáveis de ambiente
  process.env.MONGODB_URI = uri;
  process.env.PORT = '3000';
  process.env.NODE_ENV = 'test';

  // Carregar a aplicação e subir o servidor HTTP na porta de teste
  const app = require('../src/app');
  const { connectDB } = require('../src/config/database');
  await connectDB();
  const server = app.listen(3000);
  await new Promise((r) => server.once('listening', r));
  console.log('MongoDB conectado e servidor de teste no ar.');

  // Executar testes
  const runTests = require('./api.test');
  const success = await runTests();

  // Limpar
  server.close();
  await require('mongoose').disconnect();
  await mongod.stop();

  process.exit(success ? 0 : 1);
}

main().catch((err) => {
  console.error('Erro ao executar testes:', err);
  process.exit(1);
});
