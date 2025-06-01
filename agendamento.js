const form = document.getElementById('consultaForm');
const mensagem = document.getElementById('mensagem');
const tabelaBody = document.querySelector('#agendamentosTable tbody');

let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

// Função para validar se horário está disponível
function horarioDisponivel(data, hora) {
    return !agendamentos.some(a => a.data === data && a.hora === hora);
}

function renderizarAgendamentos() {
    tabelaBody.innerHTML = '';
    if (agendamentos.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="7" class="empty-row">Nenhum agendamento encontrado.</td></tr>`;
        return;
    }
    agendamentos.forEach((agendamento, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${agendamento.data}</td>
            <td>${agendamento.hora}</td>
            <td>${agendamento.nome}</td>
            <td>${agendamento.pet}</td>
            <td>${agendamento.tipo}</td>
            <td>${agendamento.motivo}</td>
            <td><button aria-label="Cancelar agendamento de ${agendamento.pet} no dia ${agendamento.data} às ${agendamento.hora}" onclick="cancelarAgendamento(${idx})">Cancelar</button></td>
        `;
        tabelaBody.appendChild(tr);
    });
}

function cancelarAgendamento(index) {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
        agendamentos.splice(index, 1);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        renderizarAgendamentos();
        mensagem.textContent = 'Agendamento cancelado.';
        mensagem.className = 'success';
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const pet = form.pet.value.trim();
    const tipo = form.tipo.value;
    const data = form.data.value;
    const hora = form.hora.value;
    const motivo = form.motivo.value.trim();

    // Validação básica
    if (!nome || !pet || !tipo || !data || !hora || !motivo) {
        mensagem.textContent = 'Por favor, preencha todos os campos.';
        mensagem.className = 'error';
        return;
    }

    // Verifica disponibilidade
    if (!horarioDisponivel(data, hora)) {
        mensagem.textContent = 'Horário indisponível. Escolha outro horário.';
        mensagem.className = 'error';
        return;
    }

    agendamentos.push({ nome, pet, tipo, data, hora, motivo });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    mensagem.textContent = 'Consulta agendada com sucesso!';
    mensagem.className = 'success';
    form.reset();
    renderizarAgendamentos();
});

// Define data mínima para hoje
document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date().toISOString().split('T')[0];
    form.data.setAttribute('min', hoje);
    renderizarAgendamentos();
});

// Torna a função cancelarAgendamento acessível globalmente
window.cancelarAgendamento = cancelarAgendamento;
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
