const formVacina = document.getElementById('vacinaForm');
const mensagemVacina = document.getElementById('mensagemVacina');
const vacinaTableBody = document.querySelector('#vacinaTable tbody');

let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];

function formatarData(data) {
  if (!data) return '-';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function renderizarVacinas() {
  vacinaTableBody.innerHTML = '';
  if (vacinas.length === 0) {
    vacinaTableBody.innerHTML = `<tr><td colspan="7" class="empty-row">Nenhum registro de vacina encontrado.</td></tr>`;
    return;
  }
  vacinas.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.animalNome}</td>
      <td>${item.vacinaNome}</td>
      <td>${item.dose}</td>
      <td>${formatarData(item.dataAplicacao)}</td>
      <td>${formatarData(item.proximaDose)}</td>
      <td>${item.veterinario}</td>
      <td><button aria-label="Excluir vacina de ${item.animalNome}" onclick="excluirVacina(${idx})">Excluir</button></td>
    `;
    vacinaTableBody.appendChild(tr);
  });
}

function excluirVacina(index) {
  if (confirm('Deseja realmente excluir este registro de vacina?')) {
    vacinas.splice(index, 1);
    localStorage.setItem('vacinas', JSON.stringify(vacinas));
    renderizarVacinas();
    mensagemVacina.textContent = 'Registro excluído com sucesso.';
    mensagemVacina.className = 'success';
  }
}

formVacina.addEventListener('submit', e => {
  e.preventDefault();

  const animalNome = formVacina.animalNome.value.trim();
  const vacinaNome = formVacina.vacinaNome.value.trim();
  const dose = formVacina.dose.value.trim();
  const dataAplicacao = formVacina.dataAplicacao.value;
  const proximaDose = formVacina.proximaDose.value;
  const veterinario = formVacina.veterinario.value.trim();

  if (!animalNome || !vacinaNome || !dose || !dataAplicacao || !veterinario) {
    mensagemVacina.textContent = 'Preencha todos os campos obrigatórios.';
    mensagemVacina.className = 'error';
    return;
  }

  vacinas.push({ animalNome, vacinaNome, dose, dataAplicacao, proximaDose, veterinario });
  localStorage.setItem('vacinas', JSON.stringify(vacinas));
  mensagemVacina.textContent = 'Vacina registrada com sucesso!';
  mensagemVacina.className = 'success';
  formVacina.reset();
  renderizarVacinas();
});

renderizarVacinas();

// Expor função para uso no onclick inline
window.excluirVacina = excluirVacina;
