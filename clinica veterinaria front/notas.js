const formNota = document.getElementById('notaForm');
const mensagemNota = document.getElementById('mensagemNota');
const notasTableBody = document.querySelector('#notasTable tbody');

let notas = JSON.parse(localStorage.getItem('notas')) || [];

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarNotas() {
  notasTableBody.innerHTML = '';
  if (notas.length === 0) {
    notasTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhuma nota emitida.</td></tr>`;
    return;
  }
  notas.forEach((nota, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nota.clienteNome}</td>
      <td>${nota.servicoDescricao}</td>
      <td>${formatarValor(nota.valorServico)}</td>
      <td>${formatarData(nota.dataEmissao)}</td>
      <td><button aria-label="Excluir nota de ${nota.clienteNome}" onclick="excluirNota(${idx})">Excluir</button></td>
    `;
    notasTableBody.appendChild(tr);
  });
}

function excluirNota(index) {
  if (confirm('Deseja realmente excluir esta nota?')) {
    notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(notas));
    renderizarNotas();
    mensagemNota.textContent = 'Nota excluída com sucesso.';
    mensagemNota.className = 'success';
  }
}

formNota.addEventListener('submit', e => {
  e.preventDefault();

  const clienteNome = formNota.clienteNome.value.trim();
  const servicoDescricao = formNota.servicoDescricao.value.trim();
  const valorServico = parseFloat(formNota.valorServico.value);
  const dataEmissao = formNota.dataEmissao.value;

  if (!clienteNome || !servicoDescricao || isNaN(valorServico) || valorServico <= 0 || !dataEmissao) {
    mensagemNota.textContent = 'Preencha todos os campos corretamente.';
    mensagemNota.className = 'error';
    return;
  }

  notas.push({ clienteNome, servicoDescricao, valorServico, dataEmissao });
  localStorage.setItem('notas', JSON.stringify(notas));
  mensagemNota.textContent = 'Nota emitida com sucesso (simulada).';
  mensagemNota.className = 'success';
  formNota.reset();
  renderizarNotas();
});

renderizarNotas();

// Expor função para uso no onclick inline
window.excluirNota = excluirNota;
