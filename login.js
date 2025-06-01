const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

const usuarioAdmin = {
  username: 'adm',
  password: '123',
  nome: 'Administrador',
  perfil: 'admin'
};

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;

  if (!username || !password) {
    loginMessage.textContent = 'Por favor, preencha usuário e senha.';
    loginMessage.className = 'error';
    return;
  }

  if (username === usuarioAdmin.username && password === usuarioAdmin.password) {
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioAdmin));
    loginMessage.textContent = `Bem-vindo(a), ${usuarioAdmin.nome}! Redirecionando...`;
    loginMessage.className = 'success';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    loginMessage.textContent = 'Usuário ou senha incorretos.';
    loginMessage.className = 'error';
  }
});
