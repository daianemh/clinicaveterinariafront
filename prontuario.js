const formProntuario = document.getElementById('prontuarioForm');
const mensagemProntuario = document.getElementById('mensagemProntuario');
const prontuarioTableBody = document.querySelector('#prontuarioTable tbody');

let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function renderizarAtendimentos() {
  prontuarioTableBody.innerHTML = '';
  if (atendimentos.length === 0) {
    prontuarioTableBody.innerHTML = `<tr><td colspan="6" class="empty-row">Nenhum atendimento registrado.</td></tr>`;
    return;
  }
  atendimentos.forEach((atendimento, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatarData(atendimento.dataAtendimento)}</td>
      <td>${atendimento.nomeAnimal}</td>
      <td>${atendimento.nomeTutor}</td>
      <td>${atendimento.veterinario}</td>
      <td title="${atendimento.diagnostico}">${atendimento.diagnostico.length > 30 ? atendimento.diagnostico.substring(0, 30) + '...' : atendimento.diagnostico}</td>
      <td>
        <button aria-label="Ver detalhes do atendimento de ${atendimento.nomeAnimal}" onclick="verDetalhes(${idx})">Ver</button>
        <button aria-label="Excluir atendimento de ${atendimento.nomeAnimal}" onclick="excluirAtendimento(${idx})">Excluir</button>
      </td>
    `;
    prontuarioTableBody.appendChild(tr);
  });
}

function verDetalhes(index) {
  const atendimento = atendimentos[index];
  alert(
    `Detalhes do Atendimento:\n\n` +
    `Animal: ${atendimento.nomeAnimal}\n` +
    `Tutor: ${atendimento.nomeTutor}\n` +
    `Data: ${formatarData(atendimento.dataAtendimento)}\n` +
    `Veterinário: ${atendimento.veterinario}\n\n` +
    `Anamnese:\n${atendimento.anamnese}\n\n` +
    `Exame Físico:\n${atendimento.exameFisico || 'Não informado'}\n\n` +
    `Diagnóstico:\n${atendimento.diagnostico || 'Não informado'}\n\n` +
    `Tratamento:\n${atendimento.tratamento || 'Não informado'}\n\n` +
    `Observações:\n${atendimento.observacoes || 'Nenhuma'}`
  );
}

function excluirAtendimento(index) {
  if (confirm('Deseja realmente excluir este atendimento?')) {
    atendimentos.splice(index, 1);
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    renderizarAtendimentos();
    mensagemProntuario.textContent = 'Atendimento excluído com sucesso.';
    mensagemProntuario.className = 'success';
  }
}

formProntuario.addEventListener('submit', e => {
  e.preventDefault();

  const novoAtendimento = {
    nomeAnimal: formProntuario.nomeAnimal.value.trim(),
    nomeTutor: formProntuario.nomeTutor.value.trim(),
    dataAtendimento: formProntuario.dataAtendimento.value,
    veterinario: formProntuario.veterinario.value.trim(),
    anamnese: formProntuario.anamnese.value.trim(),
    exameFisico: formProntuario.exameFisico.value.trim(),
    diagnostico: formProntuario.diagnostico.value.trim(),
    tratamento: formProntuario.tratamento.value.trim(),
    observacoes: formProntuario.observacoes.value.trim()
  };

  // Validação simples
  if (!novoAtendimento.nomeAnimal || !novoAtendimento.nomeTutor || !novoAtendimento.dataAtendimento || !novoAtendimento.veterinario || !novoAtendimento.anamnese) {
    mensagemProntuario.textContent = 'Por favor, preencha os campos obrigatórios.';
    mensagemProntuario.className = 'error';
    return;
  }

  atendimentos.push(novoAtendimento);
  localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
  mensagemProntuario.textContent = 'Atendimento registrado com sucesso!';
  mensagemProntuario.className = 'success';
  formProntuario.reset();
  renderizarAtendimentos();
});

renderizarAtendimentos();
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
