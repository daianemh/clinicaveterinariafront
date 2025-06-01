const formInternacao = document.getElementById('internacaoForm');
const mensagemInternacao = document.getElementById('mensagemInternacao');
const internacaoTableBody = document.querySelector('#internacaoTable tbody');

let internacoes = JSON.parse(localStorage.getItem('internacoes')) || [];

function formatarData(data) {
  if (!data) return '-';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function renderizarInternacoes() {
  internacaoTableBody.innerHTML = '';
  if (internacoes.length === 0) {
    internacaoTableBody.innerHTML = `<tr><td colspan="9" class="empty-row">Nenhuma internação registrada.</td></tr>`;
    return;
  }
  internacoes.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.animalNome}</td>
      <td>${item.tutorNome}</td>
      <td>${formatarData(item.dataEntrada)}</td>
      <td>${formatarData(item.dataSaida)}</td>
      <td>${item.veterinarioResponsavel}</td>
      <td title="${item.motivoInternacao}">${item.motivoInternacao.length > 30 ? item.motivoInternacao.substring(0, 30) + '...' : item.motivoInternacao}</td>
      <td title="${item.evolucaoClinica}">${item.evolucaoClinica.length > 30 ? item.evolucaoClinica.substring(0, 30) + '...' : item.evolucaoClinica}</td>
      <td title="${item.medicacoes}">${item.medicacoes.length > 30 ? item.medicacoes.substring(0, 30) + '...' : item.medicacoes}</td>
      <td><button aria-label="Excluir internação de ${item.animalNome}" onclick="excluirInternacao(${idx})">Excluir</button></td>
    `;
    internacaoTableBody.appendChild(tr);
  });
}

function excluirInternacao(index) {
  if (confirm('Deseja realmente excluir esta internação?')) {
    internacoes.splice(index, 1);
    localStorage.setItem('internacoes', JSON.stringify(internacoes));
    renderizarInternacoes();
    mensagemInternacao.textContent = 'Internação excluída com sucesso.';
    mensagemInternacao.className = 'success';
  }
}

formInternacao.addEventListener('submit', e => {
  e.preventDefault();

  const animalNome = formInternacao.animalNome.value.trim();
  const tutorNome = formInternacao.tutorNome.value.trim();
  const dataEntrada = formInternacao.dataEntrada.value;
  const dataSaida = formInternacao.dataSaida.value;
  const veterinarioResponsavel = formInternacao.veterinarioResponsavel.value.trim();
  const motivoInternacao = formInternacao.motivoInternacao.value.trim();
  const evolucaoClinica = formInternacao.evolucaoClinica.value.trim();
  const medicacoes = formInternacao.medicacoes.value.trim();

  if (!animalNome || !tutorNome || !dataEntrada || !veterinarioResponsavel || !motivoInternacao) {
    mensagemInternacao.textContent = 'Preencha todos os campos obrigatórios.';
    mensagemInternacao.className = 'error';
    return;
  }

  internacoes.push({
    animalNome,
    tutorNome,
    dataEntrada,
    dataSaida,
    veterinarioResponsavel,
    motivoInternacao,
    evolucaoClinica,
    medicacoes
  });

  localStorage.setItem('internacoes', JSON.stringify(internacoes));
  mensagemInternacao.textContent = 'Internação registrada com sucesso!';
  mensagemInternacao.className = 'success';
  formInternacao.reset();
  renderizarInternacoes();
});

renderizarInternacoes();

// Expor função para uso no onclick inline
window.excluirInternacao = excluirInternacao;
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
