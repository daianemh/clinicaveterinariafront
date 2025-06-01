let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [
  { id: 1, nome: "Ana Souza", cargo: "Veterinário", telefone: "(11) 98888-1234", email: "ana@clinica.com" },
  { id: 2, nome: "Carlos Lima", cargo: "Recepcionista", telefone: "(11) 97777-5678", email: "carlos@clinica.com" },
  { id: 3, nome: "Fernanda Alves", cargo: "Auxiliar", telefone: "(11) 96666-4321", email: "fernanda@clinica.com" }
];
let editId = null;

const tbody = document.querySelector("#funcionariosTable tbody");
const form = document.getElementById("form");
const overlay = document.getElementById("overlay");
const formFeedback = document.getElementById("formFeedback");

function renderTable() {
  tbody.innerHTML = "";
  if (funcionarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhum funcionário cadastrado.</td></tr>`;
    return;
  }
  funcionarios.forEach(func => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${func.nome}</td>
      <td>${func.cargo}</td>
      <td>${func.telefone}</td>
      <td>${func.email}</td>
      <td>
        <button class="edit-btn" aria-label="Editar funcionário ${func.nome}" onclick="editFuncionario(${func.id})">Editar</button>
        <button class="delete-btn" aria-label="Excluir funcionário ${func.nome}" onclick="deleteFuncionario(${func.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openForm(edit = false) {
  document.getElementById("funcionarioForm").style.display = "block";
  overlay.style.display = "block";
  document.getElementById("formTitle").textContent = edit ? "Editar Funcionário" : "Adicionar Funcionário";
  formFeedback.textContent = "";
  if (!edit) {
    form.reset();
    document.getElementById("funcionarioId").value = "";
    editId = null;
  }
  document.getElementById("nome").focus();
}

function closeForm() {
  document.getElementById("funcionarioForm").style.display = "none";
  overlay.style.display = "none";
  formFeedback.textContent = "";
}

function editFuncionario(id) {
  const func = funcionarios.find(f => f.id === id);
  if (func) {
    document.getElementById("funcionarioId").value = func.id;
    document.getElementById("nome").value = func.nome;
    document.getElementById("cargo").value = func.cargo;
    document.getElementById("telefone").value = func.telefone;
    document.getElementById("email").value = func.email;
    editId = id;
    openForm(true);
  }
}

function deleteFuncionario(id) {
  if (confirm("Tem certeza que deseja excluir este funcionário?")) {
    funcionarios = funcionarios.filter(f => f.id !== id);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    renderTable();
  }
}

function validateField(field, errorId, message) {
  const errorElem = document.getElementById(errorId);
  if (!field.validity.valid) {
    errorElem.textContent = message;
    return false;
  } else {
    errorElem.textContent = "";
    return true;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = form.nome;
  const cargo = form.cargo;
  const telefone = form.telefone;
  const email = form.email;

  const validNome = validateField(nome, "nomeError", "Por favor, insira o nome.");
  const validCargo = validateField(cargo, "cargoError", "Selecione um cargo.");
  const validTelefone = validateField(telefone, "telefoneError", "Telefone inválido.");
  const validEmail = validateField(email, "emailError", "Email inválido.");

  if (!(validNome && validCargo && validTelefone && validEmail)) {
    formFeedback.textContent = "Corrija os erros antes de salvar.";
    formFeedback.className = "error";
    return;
  }

  const id = document.getElementById("funcionarioId").value;
  if (id) {
    const idx = funcionarios.findIndex(f => f.id == id);
    if (idx > -1) {
      funcionarios[idx] = { id: Number(id), nome: nome.value.trim(), cargo: cargo.value, telefone: telefone.value.trim(), email: email.value.trim() };
    }
  } else {
    const newId = funcionarios.length ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    funcionarios.push({ id: newId, nome: nome.value.trim(), cargo: cargo.value, telefone: telefone.value.trim(), email: email.value.trim() });
  }

  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  closeForm();
  renderTable();
});

overlay.onclick = closeForm;

renderTable();
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
