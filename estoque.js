const formEstoque = document.getElementById('estoqueForm');
const mensagemEstoque = document.getElementById('mensagemEstoque');
const estoqueTableBody = document.querySelector('#estoqueTable tbody');

let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function renderizarProdutos() {
  estoqueTableBody.innerHTML = '';
  if (produtos.length === 0) {
    estoqueTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhum produto cadastrado.</td></tr>`;
    return;
  }
  produtos.forEach((produto, idx) => {
    const tr = document.createElement('tr');
    const validadeFormatada = formatarData(produto.validade);
    const hoje = new Date();
    const validadeDate = new Date(produto.validade);
    const expirado = validadeDate < hoje;
    tr.innerHTML = `
      <td>${produto.nomeProduto}</td>
      <td>${produto.quantidade}</td>
      <td style="color: ${expirado ? 'red' : 'inherit'}">${validadeFormatada}</td>
      <td title="${produto.descricaoProduto}">${produto.descricaoProduto.length > 30 ? produto.descricaoProduto.substring(0, 30) + '...' : produto.descricaoProduto}</td>
      <td>
        <button aria-label="Editar produto ${produto.nomeProduto}" onclick="editarProduto(${idx})">Editar</button>
        <button aria-label="Excluir produto ${produto.nomeProduto}" onclick="excluirProduto(${idx})">Excluir</button>
      </td>
    `;
    estoqueTableBody.appendChild(tr);
  });
}

function editarProduto(index) {
  const produto = produtos[index];
  formEstoque.nomeProduto.value = produto.nomeProduto;
  formEstoque.quantidade.value = produto.quantidade;
  formEstoque.validade.value = produto.validade;
  formEstoque.descricaoProduto.value = produto.descricaoProduto;
  formEstoque.dataset.editIndex = index;
  mensagemEstoque.textContent = `Editando produto: ${produto.nomeProduto}`;
  mensagemEstoque.className = '';
}

function excluirProduto(index) {
  if (confirm('Deseja realmente excluir este produto?')) {
    produtos.splice(index, 1);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    renderizarProdutos();
    mensagemEstoque.textContent = 'Produto excluído com sucesso.';
    mensagemEstoque.className = 'success';
    delete formEstoque.dataset.editIndex;
    formEstoque.reset();
  }
}

formEstoque.addEventListener('submit', e => {
  e.preventDefault();

  const nomeProduto = formEstoque.nomeProduto.value.trim();
  const quantidade = parseInt(formEstoque.quantidade.value, 10);
  const validade = formEstoque.validade.value;
  const descricaoProduto = formEstoque.descricaoProduto.value.trim();

  if (!nomeProduto || isNaN(quantidade) || quantidade < 0 || !validade) {
    mensagemEstoque.textContent = 'Preencha todos os campos obrigatórios corretamente.';
    mensagemEstoque.className = 'error';
    return;
  }

  const editIndex = formEstoque.dataset.editIndex;
  if (editIndex !== undefined) {
    produtos[editIndex] = { nomeProduto, quantidade, validade, descricaoProduto };
    mensagemEstoque.textContent = 'Produto atualizado com sucesso!';
    delete formEstoque.dataset.editIndex;
  } else {
    produtos.push({ nomeProduto, quantidade, validade, descricaoProduto });
    mensagemEstoque.textContent = 'Produto adicionado com sucesso!';
  }

  mensagemEstoque.className = 'success';
  localStorage.setItem('produtos', JSON.stringify(produtos));
  formEstoque.reset();
  renderizarProdutos();
});

renderizarProdutos();

// Expor funções para uso no onclick inline
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
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
