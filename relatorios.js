const relatorios = {
    consultas: {
        titulo: "Consultas Realizadas",
        colunas: ["Data", "Paciente", "Espécie", "Veterinário", "Status"],
        dados: [
            ["2024-06-01", "Rex", "Cão", "Dr. Silva", "Concluída"],
            ["2024-06-02", "Mimi", "Gato", "Dra. Souza", "Agendada"]
        ]
    },
    internacoes: {
        titulo: "Internações",
        colunas: ["Data Entrada", "Paciente", "Espécie", "Veterinário Responsável", "Status"],
        dados: [
            ["2024-05-28", "Toby", "Cão", "Dr. Silva", "Em andamento"],
            ["2024-05-30", "Luna", "Gato", "Dra. Souza", "Alta"]
        ]
    },
    faturamento: {
        titulo: "Faturamento",
        colunas: ["Data", "Descrição", "Valor (R$)", "Responsável"],
        dados: [
            ["2024-06-01", "Consulta - Rex", "120,00", "Dr. Silva"],
            ["2024-06-02", "Vacina - Mimi", "80,00", "Dra. Souza"]
        ]
    }
};

document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const relatorio = relatorios[tipo];

    document.getElementById('relatorioTitulo').textContent = relatorio.titulo;

    // Monta o cabeçalho
    let thead = '<tr>';
    relatorio.colunas.forEach(col => {
        thead += `<th>${col}</th>`;
    });
    thead += '</tr>';
    document.querySelector('#relatorioTabela thead').innerHTML = thead;

    // Filtra os dados por data, se informado
    let dadosFiltrados = relatorio.dados;
    if (dataInicio || dataFim) {
        const idxData = 0; // Assume que a primeira coluna é a data
        dadosFiltrados = dadosFiltrados.filter(linha => {
            const data = linha[idxData];
            if (dataInicio && data < dataInicio) return false;
            if (dataFim && data > dataFim) return false;
            return true;
        });
    }

    // Monta o corpo da tabela
    let tbody = '';
    if (dadosFiltrados.length === 0) {
        tbody = `<tr><td colspan="${relatorio.colunas.length}">Nenhum registro encontrado.</td></tr>`;
    } else {
        dadosFiltrados.forEach(linha => {
            tbody += '<tr>';
            linha.forEach(celula => {
                tbody += `<td>${celula}</td>`;
            });
            tbody += '</tr>';
        });
    }
    document.querySelector('#relatorioTabela tbody').innerHTML = tbody;
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
