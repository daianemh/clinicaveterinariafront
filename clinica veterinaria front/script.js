document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultaForm');
  const mensagem = document.getElementById('mensagem');
  const list = document.getElementById('appointmentsList');

  function renderAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    if (!list) return;
    list.innerHTML = '';
    if (appointments.length === 0) {
      list.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
      return;
    }
    appointments.forEach((appt, idx) => {
      const item = document.createElement('li');
      item.textContent = `${appt.date} ${appt.time} - ${appt.petName} (Tutor: ${appt.ownerName}) - Sintomas: ${appt.symptoms}`;
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Excluir';
      delBtn.setAttribute('aria-label', `Excluir agendamento de ${appt.petName} no dia ${appt.date}`);
      delBtn.onclick = () => {
        appointments.splice(idx, 1);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        renderAppointments();
        mensagem.textContent = 'Agendamento excluído.';
        mensagem.className = 'success';
      };
      item.appendChild(delBtn);
      list.appendChild(item);
    });
  }

  function validateForm(data) {
    const errors = [];
    if (!data.petName) errors.push('Nome do pet é obrigatório.');
    if (!data.ownerName) errors.push('Nome do tutor é obrigatório.');
    if (!data.date) errors.push('Data da consulta é obrigatória.');
    if (!data.time) errors.push('Horário da consulta é obrigatório.');
    if (!data.symptoms) errors.push('Sintomas são obrigatórios.');
    return errors;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
      petName: form.petName.value.trim(),
      ownerName: form.ownerName.value.trim(),
      date: form.date.value,
      time: form.time.value,
      symptoms: form.symptoms.value.trim()
    };

    const errors = validateForm(data);
    if (errors.length > 0) {
      mensagem.innerHTML = errors.map(err => `<div class="error">${err}</div>`).join('');
      return;
    }

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(data);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    mensagem.textContent = 'Consulta agendada com sucesso!';
    mensagem.className = 'success';
    form.reset();
    renderAppointments();
  });

  renderAppointments();
});
// Função para verificar login e permissões
function verificarAcesso(permissoesPermitidas) {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuario) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return false;
  }
  if (!permissoesPermitidas.includes(usuario.role)) {
    alert('Você não tem permissão para acessar esta página.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Exemplo: na página index.html, permitir todos os perfis
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAcesso(['admin', 'vet', 'recep'])) {
    // Acesso negado, redirecionado
  }
});
