const formFinanceiro = document.getElementById('financeiroForm');
const mensagemFinanceiro = document.getElementById('mensagemFinanceiro');
const saldoAtual = document.getElementById('saldoAtual');
const financeiroTableBody = document.querySelector('#financeiroTable tbody');

let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularSaldo() {
  return movimentacoes.reduce((acc, mov) => {
    return mov.tipo === 'receita' ? acc + mov.valor : acc - mov.valor;
  }, 0);
}

function renderizarMovimentacoes() {
  financeiroTableBody.innerHTML = '';
  if (movimentacoes.length === 0) {
    financeiroTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhuma movimentação registrada.</td></tr>`;
    saldoAtual.textContent = formatarValor(0);
    return;
  }
  movimentacoes.forEach((mov, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mov.data}</td>
      <td>${mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}</td>
      <td>${mov.descricao}</td>
      <td>${formatarValor(mov.valor)}</td>
      <td><button aria-label="Excluir movimentação ${mov.descricao}" onclick="excluirMovimentacao(${idx})">Excluir</button></td>
    `;
    financeiroTableBody.appendChild(tr);
  });
  saldoAtual.textContent = formatarValor(calcularSaldo());
}

function excluirMovimentacao(index) {
  if (confirm('Deseja realmente excluir esta movimentação?')) {
    movimentacoes.splice(index, 1);
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
    renderizarMovimentacoes();
    mensagemFinanceiro.textContent = 'Movimentação excluída com sucesso.';
    mensagemFinanceiro.className = 'success';
  }
}

formFinanceiro.addEventListener('submit', e => {
  e.preventDefault();
  const tipo = formFinanceiro.tipo.value;
  const descricao = formFinanceiro.descricao.value.trim();
  const valor = parseFloat(formFinanceiro.valor.value);
  const data = formFinanceiro.data.value;

  if (!tipo || !descricao || isNaN(valor) || valor <= 0 || !data) {
    mensagemFinanceiro.textContent = 'Por favor, preencha todos os campos corretamente.';
    mensagemFinanceiro.className = 'error';
    return;
  }

  movimentacoes.push({ tipo, descricao, valor, data });
  localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
  mensagemFinanceiro.textContent = 'Movimentação registrada com sucesso!';
  mensagemFinanceiro.className = 'success';
  formFinanceiro.reset();
  renderizarMovimentacoes();
});

renderizarMovimentacoes();

// Expor função para uso no onclick inline
window.excluirMovimentacao = excluirMovimentacao;
// Atualizar o saldo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  saldoAtual.textContent = formatarValor(calcularSaldo());
});
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
