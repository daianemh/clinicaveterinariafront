const formUsuario = document.getElementById('usuarioForm');
const mensagemUsuario = document.getElementById('mensagemUsuario');
const usuariosTableBody = document.querySelector('#usuariosTable tbody');

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Função para renderizar tabela de usuários
function renderizarUsuarios() {
  usuariosTableBody.innerHTML = '';
  if (usuarios.length === 0) {
    usuariosTableBody.innerHTML = `<tr><td colspan="4" class="empty-row">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }
  usuarios.forEach((usuario, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.nome}</td>
      <td>${usuario.login}</td>
      <td>${usuario.perfil.charAt(0).toUpperCase() + usuario.perfil.slice(1)}</td>
      <td>
        <button aria-label="Editar usuário ${usuario.nome}" onclick="editarUsuario(${idx})">Editar</button>
        <button aria-label="Excluir usuário ${usuario.nome}" onclick="excluirUsuario(${idx})">Excluir</button>
      </td>
    `;
    usuariosTableBody.appendChild(tr);
  });
}

// Função para editar usuário
function editarUsuario(index) {
  const usuario = usuarios[index];
  formUsuario.usuarioId.value = index;
  formUsuario.nomeUsuario.value = usuario.nome;
  formUsuario.loginUsuario.value = usuario.login;
  formUsuario.senhaUsuario.value = ''; // senha não é exibida por segurança
  formUsuario.perfilUsuario.value = usuario.perfil;
  mensagemUsuario.textContent = `Editando usuário: ${usuario.nome}`;
  mensagemUsuario.className = '';
}

// Função para excluir usuário
function excluirUsuario(index) {
  if (confirm('Deseja realmente excluir este usuário?')) {
    usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderizarUsuarios();
    mensagemUsuario.textContent = 'Usuário excluído com sucesso.';
    mensagemUsuario.className = 'success';
    formUsuario.reset();
  }
}

// Função para validar formulário
function validarFormulario(nome, login, senha, perfil, editando) {
  if (!nome || !login || !perfil) {
    mensagemUsuario.textContent = 'Preencha todos os campos obrigatórios.';
    mensagemUsuario.className = 'error';
    return false;
  }
  if (!editando && (!senha || senha.length < 6)) {
    mensagemUsuario.textContent = 'Senha deve ter pelo menos 6 caracteres.';
    mensagemUsuario.className = 'error';
    return false;
  }
  // Verificar login único
  const loginExistente = usuarios.some((u, idx) => u.login === login && idx !== editando);
  if (loginExistente) {
    mensagemUsuario.textContent = 'Login já cadastrado para outro usuário.';
    mensagemUsuario.className = 'error';
    return false;
  }
  return true;
}

formUsuario.addEventListener('submit', e => {
  e.preventDefault();

  const id = formUsuario.usuarioId.value;
  const nome = formUsuario.nomeUsuario.value.trim();
  const login = formUsuario.loginUsuario.value.trim();
  const senha = formUsuario.senhaUsuario.value;
  const perfil = formUsuario.perfilUsuario.value;

  const editando = id !== '';

  if (!validarFormulario(nome, login, senha, perfil, editando)) {
    return;
  }

  if (editando) {
    // Atualizar usuário (senha só atualiza se preenchida)
    usuarios[id].nome = nome;
    usuarios[id].login = login;
    usuarios[id].perfil = perfil;
    if (senha) {
      usuarios[id].senha = senha;
    }
    mensagemUsuario.textContent = 'Usuário atualizado com sucesso.';
  } else {
    // Adicionar novo usuário
    usuarios.push({ nome, login, senha, perfil });
    mensagemUsuario.textContent = 'Usuário cadastrado com sucesso.';
  }

  mensagemUsuario.className = 'success';
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  formUsuario.reset();
  renderizarUsuarios();
});

renderizarUsuarios();

// Tornar funções globais para uso nos botões
window.editarUsuario = editarUsuario;
window.excluirUsuario = excluirUsuario;
