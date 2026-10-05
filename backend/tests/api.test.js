/**
 * Script de teste completo da API
 * Usa mongodb-memory-server para criar um MongoDB em memória
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let passed = 0;
let failed = 0;
const results = [];

function log(status, test, detail = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  const line = `${icon} ${test}${detail ? ' — ' + detail : ''}`;
  console.log(line);
  results.push({ status, test, detail });
  if (status === 'PASS') passed++;
  else failed++;
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, body: parsed, raw: data });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n========================================');
  console.log('  TESTES DA API — LOJA ESPORTIVA');
  console.log('========================================\n');

  // 1. Health Check
  console.log('--- Health Check ---');
  try {
    const res = await request('GET', '/api/health');
    if (res.status === 200 && res.body.status === 'ok') {
      log('PASS', 'GET /api/health', `status=${res.status}, body=${res.raw}`);
    } else {
      log('FAIL', 'GET /api/health', `status=${res.status}, body=${res.raw}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/health', e.message);
  }

  // 2. Rota raiz
  console.log('\n--- Rota Raiz ---');
  try {
    const res = await request('GET', '/');
    if (res.status === 200 && res.body.message) {
      log('PASS', 'GET /', `message="${res.body.message}"`);
    } else {
      log('FAIL', 'GET /', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'GET /', e.message);
  }

  // 3. 404
  console.log('\n--- 404 ---');
  try {
    const res = await request('GET', '/api/naoexiste');
    if (res.status === 404) {
      log('PASS', 'GET /api/naoexiste → 404', `body=${res.raw}`);
    } else {
      log('FAIL', 'GET /api/naoexiste → 404', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', '404 handler', e.message);
  }

  // 4. Listar itens (vazio)
  console.log('\n--- Listagem (vazia) ---');
  try {
    const res = await request('GET', '/api/items');
    if (res.status === 200 && Array.isArray(res.body) && res.body.length === 0) {
      log('PASS', 'GET /api/items (vazio)', `status=${res.status}, itens=${res.body.length}`);
    } else {
      log('FAIL', 'GET /api/items (vazio)', `status=${res.status}, body=${res.raw}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/items (vazio)', e.message);
  }

  // 5. Criar item válido
  console.log('\n--- Criação ---');
  let createdId;
  try {
    const res = await request('POST', '/api/items', {
      marca: 'Nike',
      modelo: 'Air Max 90',
      preco: 599.90,
      foto: 'https://exemplo.com/nike.jpg',
    });
    if (res.status === 201 && res.body._id && res.body.marca === 'Nike') {
      createdId = res.body._id;
      log('PASS', 'POST /api/items (válido)', `id=${createdId}, marca=${res.body.marca}`);
    } else {
      log('FAIL', 'POST /api/items (válido)', `status=${res.status}, body=${res.raw}`);
    }
  } catch (e) {
    log('FAIL', 'POST /api/items (válido)', e.message);
  }

  // 6. Validações de criação
  console.log('\n--- Validações de Criação ---');

  // Marca ausente
  try {
    const res = await request('POST', '/api/items', {
      modelo: 'Modelo X',
      preco: 100,
    });
    if (res.status === 400) {
      log('PASS', 'POST sem marca → 400', `messages=${JSON.stringify(res.body.messages)}`);
    } else {
      log('FAIL', 'POST sem marca → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'POST sem marca → 400', e.message);
  }

  // Modelo ausente
  try {
    const res = await request('POST', '/api/items', {
      marca: 'Nike',
      preco: 100,
    });
    if (res.status === 400) {
      log('PASS', 'POST sem modelo → 400', `messages=${JSON.stringify(res.body.messages)}`);
    } else {
      log('FAIL', 'POST sem modelo → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'POST sem modelo → 400', e.message);
  }

  // Preço ausente
  try {
    const res = await request('POST', '/api/items', {
      marca: 'Nike',
      modelo: 'Modelo X',
    });
    if (res.status === 400) {
      log('PASS', 'POST sem preço → 400', `messages=${JSON.stringify(res.body.messages)}`);
    } else {
      log('FAIL', 'POST sem preço → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'POST sem preço → 400', e.message);
  }

  // Preço negativo
  try {
    const res = await request('POST', '/api/items', {
      marca: 'Nike',
      modelo: 'Modelo X',
      preco: -50,
    });
    if (res.status === 400) {
      log('PASS', 'POST preço negativo → 400', `messages=${JSON.stringify(res.body.messages)}`);
    } else {
      log('FAIL', 'POST preço negativo → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'POST preço negativo → 400', e.message);
  }

  // Preço inválido (string)
  try {
    const res = await request('POST', '/api/items', {
      marca: 'Nike',
      modelo: 'Modelo X',
      preco: 'abc',
    });
    if (res.status === 400) {
      log('PASS', 'POST preço inválido (string) → 400', `messages=${JSON.stringify(res.body.messages)}`);
    } else {
      log('FAIL', 'POST preço inválido (string) → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'POST preço inválido (string) → 400', e.message);
  }

  // 7. Listar itens (com 1 item)
  console.log('\n--- Listagem (com itens) ---');
  try {
    const res = await request('GET', '/api/items');
    if (res.status === 200 && Array.isArray(res.body) && res.body.length === 1) {
      log('PASS', 'GET /api/items (1 item)', `itens=${res.body.length}`);
    } else {
      log('FAIL', 'GET /api/items (1 item)', `status=${res.status}, itens=${Array.isArray(res.body) ? res.body.length : 'N/A'}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/items (1 item)', e.message);
  }

  // 8. Consulta por ID
  console.log('\n--- Consulta por ID ---');
  if (createdId) {
    try {
      const res = await request('GET', `/api/items/${createdId}`);
      if (res.status === 200 && res.body._id === createdId) {
        log('PASS', 'GET /api/items/:id (válido)', `marca=${res.body.marca}`);
      } else {
        log('FAIL', 'GET /api/items/:id (válido)', `status=${res.status}`);
      }
    } catch (e) {
      log('FAIL', 'GET /api/items/:id (válido)', e.message);
    }
  }

  // ID inexistente (válido mas não existe)
  try {
    const res = await request('GET', '/api/items/64f1a2b3c4d5e6f7a8b9c0d1');
    if (res.status === 404) {
      log('PASS', 'GET /api/items/:id (inexistente) → 404', `error=${res.body.error}`);
    } else {
      log('FAIL', 'GET /api/items/:id (inexistente) → 404', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/items/:id (inexistente) → 404', e.message);
  }

  // ID inválido
  try {
    const res = await request('GET', '/api/items/id-invalido');
    if (res.status === 400) {
      log('PASS', 'GET /api/items/:id (inválido) → 400', `error=${res.body.error}`);
    } else {
      log('FAIL', 'GET /api/items/:id (inválido) → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/items/:id (inválido) → 400', e.message);
  }

  // 9. Atualização
  console.log('\n--- Atualização ---');
  if (createdId) {
    try {
      const res = await request('PUT', `/api/items/${createdId}`, {
        marca: 'Adidas',
        modelo: 'Ultraboost 22',
        preco: 899.90,
        foto: 'https://exemplo.com/adidas.jpg',
      });
      if (res.status === 200 && res.body.marca === 'Adidas') {
        log('PASS', 'PUT /api/items/:id', `marca=${res.body.marca}, preco=${res.body.preco}`);
      } else {
        log('FAIL', 'PUT /api/items/:id', `status=${res.status}, body=${res.raw}`);
      }
    } catch (e) {
      log('FAIL', 'PUT /api/items/:id', e.message);
    }

    // Confirmar atualização
    try {
      const res = await request('GET', `/api/items/${createdId}`);
      if (res.status === 200 && res.body.marca === 'Adidas' && res.body.preco === 899.90) {
        log('PASS', 'Confirmar atualização', `marca=${res.body.marca}, preco=${res.body.preco}`);
      } else {
        log('FAIL', 'Confirmar atualização', `marca=${res.body.marca}, preco=${res.body.preco}`);
      }
    } catch (e) {
      log('FAIL', 'Confirmar atualização', e.message);
    }
  }

  // PUT com ID inexistente
  try {
    const res = await request('PUT', '/api/items/64f1a2b3c4d5e6f7a8b9c0d1', {
      marca: 'Teste',
      modelo: 'Teste',
      preco: 10,
    });
    if (res.status === 404) {
      log('PASS', 'PUT /api/items/:id (inexistente) → 404', `error=${res.body.error}`);
    } else {
      log('FAIL', 'PUT /api/items/:id (inexistente) → 404', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'PUT /api/items/:id (inexistente) → 404', e.message);
  }

  // PUT com ID inválido
  try {
    const res = await request('PUT', '/api/items/invalido', {
      marca: 'Teste',
      modelo: 'Teste',
      preco: 10,
    });
    if (res.status === 400) {
      log('PASS', 'PUT /api/items/:id (inválido) → 400', `error=${res.body.error}`);
    } else {
      log('FAIL', 'PUT /api/items/:id (inválido) → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'PUT /api/items/:id (inválido) → 400', e.message);
  }

  // 10. Exclusão
  console.log('\n--- Exclusão ---');
  if (createdId) {
    try {
      const res = await request('DELETE', `/api/items/${createdId}`);
      if (res.status === 200 && res.body.message) {
        log('PASS', 'DELETE /api/items/:id', `message=${res.body.message}`);
      } else {
        log('FAIL', 'DELETE /api/items/:id', `status=${res.status}, body=${res.raw}`);
      }
    } catch (e) {
      log('FAIL', 'DELETE /api/items/:id', e.message);
    }

    // Confirmar exclusão
    try {
      const res = await request('GET', `/api/items/${createdId}`);
      if (res.status === 404) {
        log('PASS', 'Confirmar exclusão (GET retorna 404)', `status=${res.status}`);
      } else {
        log('FAIL', 'Confirmar exclusão (GET retorna 404)', `status=${res.status}`);
      }
    } catch (e) {
      log('FAIL', 'Confirmar exclusão', e.message);
    }
  }

  // DELETE com ID inexistente
  try {
    const res = await request('DELETE', '/api/items/64f1a2b3c4d5e6f7a8b9c0d1');
    if (res.status === 404) {
      log('PASS', 'DELETE /api/items/:id (inexistente) → 404', `error=${res.body.error}`);
    } else {
      log('FAIL', 'DELETE /api/items/:id (inexistente) → 404', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'DELETE /api/items/:id (inexistente) → 404', e.message);
  }

  // DELETE com ID inválido
  try {
    const res = await request('DELETE', '/api/items/invalido');
    if (res.status === 400) {
      log('PASS', 'DELETE /api/items/:id (inválido) → 400', `error=${res.body.error}`);
    } else {
      log('FAIL', 'DELETE /api/items/:id (inválido) → 400', `status=${res.status}`);
    }
  } catch (e) {
    log('FAIL', 'DELETE /api/items/:id (inválido) → 400', e.message);
  }

  // Lista vazia após exclusão
  console.log('\n--- Lista após exclusão ---');
  try {
    const res = await request('GET', '/api/items');
    if (res.status === 200 && Array.isArray(res.body) && res.body.length === 0) {
      log('PASS', 'GET /api/items (vazio após exclusão)', `itens=${res.body.length}`);
    } else {
      log('FAIL', 'GET /api/items (vazio após exclusão)', `itens=${Array.isArray(res.body) ? res.body.length : 'N/A'}`);
    }
  } catch (e) {
    log('FAIL', 'GET /api/items (vazio após exclusão)', e.message);
  }

  // Resumo
  console.log('\n========================================');
  console.log(`  RESULTADOS: ${passed} passou, ${failed} falhou, ${passed + failed} total`);
  console.log('========================================\n');

  return failed === 0;
}

module.exports = runTests;
