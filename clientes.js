const form = document.getElementById('clienteForm');
const tableBody = document.querySelector('#clientesTable tbody');
const feedback = document.getElementById('formFeedback');

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

function renderClientes() {
  tableBody.innerHTML = '';
  if (clientes.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhum cliente cadastrado.</td></tr>`;
    return;
  }
  clientes.forEach((cliente, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.endereco}</td>
      <td><button class="delete-btn" aria-label="Excluir cliente ${cliente.nome}" data-index="${index}">Excluir</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

function validateInput(input, errorId, message) {
  const errorElem = document.getElementById(errorId);
  if (!input.validity.valid) {
    errorElem.textContent = message;
    return false;
  } else {
    errorElem.textContent = '';
    return true;
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nomeInput = form.nome;
  const telefoneInput = form.telefone;
  const emailInput = form.email;
  const enderecoInput = form.endereco;

  const validNome = validateInput(nomeInput, 'nomeError', 'Por favor, insira o nome.');
  const validTelefone = validateInput(telefoneInput, 'telefoneError', 'Telefone inválido. Formato: (99) 99999-9999');
  const validEmail = validateInput(emailInput, 'emailError', 'E-mail inválido.');
  const validEndereco = validateInput(enderecoInput, 'enderecoError', 'Por favor, insira o endereço.');

  if (!(validNome && validTelefone && validEmail && validEndereco)) {
    feedback.textContent = 'Corrija os erros antes de enviar.';
    feedback.className = 'error';
    return;
  }

  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const email = emailInput.value.trim();
  const endereco = enderecoInput.value.trim();

  clientes.push({ nome, telefone, email, endereco });
  localStorage.setItem('clientes', JSON.stringify(clientes));
  renderClientes();
  form.reset();
  feedback.textContent = 'Cliente adicionado com sucesso!';
  feedback.className = 'success';
});

tableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    if (confirm(`Tem certeza que deseja excluir o cliente "${clientes[index].nome}"?`)) {
      clientes.splice(index, 1);
      localStorage.setItem('clientes', JSON.stringify(clientes));
      renderClientes();
      feedback.textContent = 'Cliente excluído.';
      feedback.className = 'success';
    }
  }
});

renderClientes();
function verificarAcesso(perfisPermitidos) {
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return false;
  }
  if (!perfisPermitidos.includes(usuarioLogado.perfil)) {
    alert('Você não tem permissão para acessar esta página.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  verificarAcesso(['admin', 'veterinario']); // Exemplo de perfis permitidos
});
