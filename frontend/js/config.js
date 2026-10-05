// URL base da API.
//  - Rodando local (localhost/127.0.0.1): usa a API local na porta 3000.
//  - Em produção: troque PRODUCTION_API_URL pela URL do seu backend na Vercel
//    (sem barra no final, terminando em /api).
const PRODUCTION_API_URL = 'https://backend-2owb.vercel.app/api';

const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
window.API_URL = isLocal ? 'http://localhost:3000/api' : PRODUCTION_API_URL;
