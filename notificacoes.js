const formNotificacao = document.getElementById('notificacaoForm');
const mensagemStatus = document.getElementById('mensagemStatus');
const listaNotificacoes = document.getElementById('listaNotificacoes');

let notificacoes = JSON.parse(localStorage.getItem('notificacoes')) || [];

function renderizarHistorico() {
  listaNotificacoes.innerHTML = '';
  if (notificacoes.length === 0) {
    listaNotificacoes.innerHTML = '<li>Nenhuma notificação enviada ainda.</li>';
    return;
  }
  notificacoes.slice().reverse().forEach(n => {
    const li = document.createElement('li');
    li.textContent = `[${new Date(n.dataEnvio).toLocaleString('pt-BR')}] Para: ${n.clienteNome} (${n.clienteContato}) - Tipo: ${n.tipoNotificacao} - Mensagem: ${n.mensagem}`;
    listaNotificacoes.appendChild(li);
  });
}

formNotificacao.addEventListener('submit', e => {
  e.preventDefault();

  const clienteNome = formNotificacao.clienteNome.value.trim();
  const clienteContato = formNotificacao.clienteContato.value.trim();
  const tipoNotificacao = formNotificacao.tipoNotificacao.value;
  const mensagem = formNotificacao.mensagem.value.trim();

  if (!clienteNome || !clienteContato || !tipoNotificacao || !mensagem) {
    mensagemStatus.textContent = 'Por favor, preencha todos os campos.';
    mensagemStatus.className = 'error';
    return;
  }

  // Simulação de envio (no mundo real, integrar com API de SMS, WhatsApp ou e-mail)
  // Aqui, apenas armazenamos no histórico local

  const notificacao = {
    clienteNome,
    clienteContato,
    tipoNotificacao,
    mensagem,
    dataEnvio: new Date().toISOString()
  };

  notificacoes.push(notificacao);
  localStorage.setItem('notificacoes', JSON.stringify(notificacoes));

  mensagemStatus.textContent = 'Notificação enviada com sucesso (simulada).';
  mensagemStatus.className = 'success';
  formNotificacao.reset();
  renderizarHistorico();
});

// Inicializa histórico
renderizarHistorico();
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
