const formPrescricao = document.getElementById('prescricaoForm');
const mensagemPrescricao = document.getElementById('mensagemPrescricao');
const prescricaoTableBody = document.querySelector('#prescricaoTable tbody');

let prescricoes = JSON.parse(localStorage.getItem('prescricoes')) || [];

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function renderizarPrescricoes() {
  prescricaoTableBody.innerHTML = '';
  if (prescricoes.length === 0) {
    prescricaoTableBody.innerHTML = `<tr><td colspan="6" class="empty-row">Nenhuma prescrição registrada.</td></tr>`;
    return;
  }
  prescricoes.forEach((item, idx) => {
    const tr = document.createElement('tr');
    const linkExame = item.arquivoExame ? `<a href="${item.arquivoExame}" target="_blank" rel="noopener">Ver Exame</a>` : 'Sem exame';
    tr.innerHTML = `
      <td>${formatarData(item.dataPrescricao)}</td>
      <td>${item.animalNome}</td>
      <td>${item.veterinarioNome}</td>
      <td title="${item.descricaoPrescricao}">${item.descricaoPrescricao.length > 30 ? item.descricaoPrescricao.substring(0, 30) + '...' : item.descricaoPrescricao}</td>
      <td>${linkExame}</td>
      <td><button aria-label="Excluir prescrição de ${item.animalNome}" onclick="excluirPrescricao(${idx})">Excluir</button></td>
    `;
    prescricaoTableBody.appendChild(tr);
  });
}

function excluirPrescricao(index) {
  if (confirm('Deseja realmente excluir esta prescrição?')) {
    prescricoes.splice(index, 1);
    localStorage.setItem('prescricoes', JSON.stringify(prescricoes));
    renderizarPrescricoes();
    mensagemPrescricao.textContent = 'Prescrição excluída com sucesso.';
    mensagemPrescricao.className = 'success';
  }
}

formPrescricao.addEventListener('submit', e => {
  e.preventDefault();

  const animalNome = formPrescricao.animalNome.value.trim();
  const veterinarioNome = formPrescricao.veterinarioNome.value.trim();
  const dataPrescricao = formPrescricao.dataPrescricao.value;
  const descricaoPrescricao = formPrescricao.descricaoPrescricao.value.trim();
  const arquivoInput = formPrescricao.arquivoExame;

  if (!animalNome || !veterinarioNome || !dataPrescricao || !descricaoPrescricao) {
    mensagemPrescricao.textContent = 'Preencha todos os campos obrigatórios.';
    mensagemPrescricao.className = 'error';
    return;
  }

  // Processar arquivo (simulação: armazenar como URL base64)
  if (arquivoInput.files.length > 0) {
    const file = arquivoInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      salvarPrescricao(event.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    salvarPrescricao(null);
  }

  function salvarPrescricao(arquivoExame) {
    const novaPrescricao = {
      animalNome,
      veterinarioNome,
      dataPrescricao,
      descricaoPrescricao,
      arquivoExame
    };
    prescricoes.push(novaPrescricao);
    localStorage.setItem('prescricoes', JSON.stringify(prescricoes));
    mensagemPrescricao.textContent = 'Prescrição salva com sucesso!';
    mensagemPrescricao.className = 'success';
    formPrescricao.reset();
    renderizarPrescricoes();
  }
});

renderizarPrescricoes();
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
