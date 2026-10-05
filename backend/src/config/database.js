const mongoose = require('mongoose');

// Em ambientes serverless (Vercel) a função pode ser reutilizada entre requisições.
// Guardamos a promessa de conexão para não abrir uma nova conexão a cada chamada.
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI não está definida. Configure a variável de ambiente.');
  }

  connectionPromise = mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 5,
    })
    .then((m) => {
      console.log(`MongoDB conectado: ${m.connection.host}`);
      return m.connection;
    })
    .catch((error) => {
      connectionPromise = null; // permite tentar de novo na próxima requisição
      throw error;
    });

  return connectionPromise;
};

const getConnectionStatus = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, getConnectionStatus };
