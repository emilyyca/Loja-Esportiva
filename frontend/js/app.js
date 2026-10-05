// Configuração da API (definida em js/config.js)
const API_URL = window.API_URL;

// Elementos do DOM
const itemForm = document.getElementById('item-form');
const formTitle = document.getElementById('form-title');
const itemIdInput = document.getElementById('item-id');
const marcaInput = document.getElementById('marca');
const modeloInput = document.getElementById('modelo');
const precoInput = document.getElementById('preco');
const fotoInput = document.getElementById('foto');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');
const emptyStateDiv = document.getElementById('empty-state');
const itemsGrid = document.getElementById('items-grid');
const confirmModal = document.getElementById('confirm-modal');
const confirmItemName = document.getElementById('confirm-item-name');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const btnCancelDelete = document.getElementById('btn-cancel-delete');

// Estado
let editingId = null;
let deleteId = null;

// ==================== FUNÇÕES UTILITÁRIAS ====================

function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 4000);
}

function showLoading(show) {
  loadingDiv.style.display = show ? 'block' : 'none';
}

function showEmptyState(show) {
  emptyStateDiv.style.display = show ? 'block' : 'none';
}

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function resetForm() {
  itemForm.reset();
  itemIdInput.value = '';
  editingId = null;
  formTitle.textContent = 'Cadastrar Novo Item';
  btnSubmit.textContent = 'Cadastrar';
  btnCancel.style.display = 'none';
}

function validateForm() {
  let valid = true;

  // Remover classes de erro
  document.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));

  if (!marcaInput.value.trim()) {
    marcaInput.classList.add('invalid');
    valid = false;
  }

  if (!modeloInput.value.trim()) {
    modeloInput.classList.add('invalid');
    valid = false;
  }

  const preco = parseFloat(precoInput.value);
  if (isNaN(preco) || preco < 0) {
    precoInput.classList.add('invalid');
    valid = false;
  }

  if (!valid) {
    showMessage('Preencha todos os campos obrigatórios corretamente.', 'error');
  }

  return valid;
}

// ==================== API ====================

async function fetchItems() {
  showLoading(true);
  itemsGrid.innerHTML = '';
  showEmptyState(false);

  try {
    const response = await fetch(`${API_URL}/items`);

    if (!response.ok) {
      throw new Error('Erro ao carregar itens');
    }

    const items = await response.json();

    showLoading(false);

    if (items.length === 0) {
      showEmptyState(true);
      return;
    }

    items.forEach((item) => renderCard(item));
  } catch (error) {
    showLoading(false);
    showMessage('Erro ao carregar itens. Verifique se a API está rodando.', 'error');
    console.error('Erro ao carregar itens:', error);
  }
}

async function createItem(data) {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.messages ? err.messages.join(', ') : err.error || 'Erro ao cadastrar');
  }

  return response.json();
}

async function updateItem(id, data) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.messages ? err.messages.join(', ') : err.error || 'Erro ao atualizar');
  }

  return response.json();
}

async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao excluir');
  }

  return response.json();
}

// ==================== RENDERIZAÇÃO ====================

function renderCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = item._id;

  // Imagem (ou placeholder se não houver foto / se a URL falhar)
  const placeholder = () => {
    const ph = document.createElement('div');
    ph.className = 'card-image-placeholder';
    ph.textContent = '📷';
    return ph;
  };

  if (item.foto) {
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = item.foto;
    img.alt = item.modelo;
    img.addEventListener('error', () => img.replaceWith(placeholder()));
    card.appendChild(img);
  } else {
    card.appendChild(placeholder());
  }

  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <p class="card-marca">${escapeHtml(item.marca)}</p>
    <p class="card-modelo">${escapeHtml(item.modelo)}</p>
    <p class="card-preco">${formatPrice(item.preco)}</p>
    <div class="card-actions">
      <button type="button" class="btn btn-primary btn-sm" data-action="edit">Editar</button>
      <button type="button" class="btn btn-danger btn-sm" data-action="delete">Excluir</button>
    </div>
  `;

  // Listeners em vez de onclick inline: evita quebrar/injetar HTML com aspas nos textos
  body.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(item._id));
  body
    .querySelector('[data-action="delete"]')
    .addEventListener('click', () => confirmDelete(item._id, `${item.marca} ${item.modelo}`));

  card.appendChild(body);
  itemsGrid.appendChild(card);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== AÇÕES ====================

async function startEdit(id) {
  try {
    const response = await fetch(`${API_URL}/items/${id}`);
    if (!response.ok) throw new Error('Erro ao carregar item');

    const item = await response.json();

    editingId = id;
    itemIdInput.value = id;
    marcaInput.value = item.marca;
    modeloInput.value = item.modelo;
    precoInput.value = item.preco;
    fotoInput.value = item.foto || '';

    formTitle.textContent = 'Editar Item';
    btnSubmit.textContent = 'Salvar';
    btnCancel.style.display = 'inline-block';

    // Scroll para o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Erro ao carregar item para edição.', 'error');
    console.error('Erro ao carregar item:', error);
  }
}

function confirmDelete(id, name) {
  deleteId = id;
  confirmItemName.textContent = name;
  confirmModal.style.display = 'flex';
}

function closeModal() {
  confirmModal.style.display = 'none';
  deleteId = null;
}

// ==================== EVENT LISTENERS ====================

// Submit do formulário
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const data = {
    marca: marcaInput.value.trim(),
    modelo: modeloInput.value.trim(),
    preco: parseFloat(precoInput.value),
    foto: fotoInput.value.trim(),
  };

  try {
    btnSubmit.disabled = true;

    if (editingId) {
      await updateItem(editingId, data);
      showMessage('Item atualizado com sucesso!');
    } else {
      await createItem(data);
      showMessage('Item cadastrado com sucesso!');
    }

    resetForm();
    fetchItems();
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    btnSubmit.disabled = false;
  }
});

// Cancelar edição
btnCancel.addEventListener('click', resetForm);

// Confirmar exclusão
btnConfirmDelete.addEventListener('click', async () => {
  if (!deleteId) return;

  try {
    await deleteItem(deleteId);
    showMessage('Item excluído com sucesso!');
    closeModal();
    fetchItems();
  } catch (error) {
    showMessage(error.message, 'error');
    closeModal();
  }
});

// Cancelar exclusão
btnCancelDelete.addEventListener('click', closeModal);

// Fechar modal ao clicar fora
confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) closeModal();
});

// ==================== INICIALIZAÇÃO ====================

fetchItems();
