document.addEventListener("DOMContentLoaded", function() {
    // Carregar o Header
    const headerElement = document.getElementById('header-geral');
    fetch('../header/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o header.');
            }
            return response.text();
        })
        .then(data => {
            headerElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Erro ao carregar o header:', error);
        });

    // Carregar o Footer
    const footerElement = document.getElementById('footer-geral');
    fetch('../footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o footer.');
            }
            return response.text();
        })
        .then(data => {
            footerElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Erro ao carregar o footer:', error);
        });
  
    document.getElementById('manutencao-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = {
            nome: document.getElementById('profissional').value,
            data_manutencao: formatDateToDB(document.getElementById('data').value), // Converte a data para o formato do banco
            data_previsao: formatDateToDB(document.getElementById('data2').value), // Converte a data, se houver
            custo: document.getElementById('custo').value || null,
            detalhes: document.getElementById('detalhes').value || null,
            observacoes: document.getElementById('observacoes').value || null,
            lugar: document.getElementById('local').value,
            tipo_manutencao: document.getElementById('tipo-manutencao').value,
            modelo_marca: document.getElementById('modelo').value,
            tipo_conserto: document.getElementById('tipo-conserto').value,
        };

        console.log('Dados a serem enviados:', formData);

        fetch('http://localhost:3000/manutencao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Manutenção salva com sucesso!');
            
            // Limpa o formulário após salvar
            document.getElementById('manutencao-form').reset();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar a manutenção: ' + error.message);
        });
    });
});

// Função para converter a data do formato "dia-mês-ano" para "ano-mês-dia"
function formatDateToDB(dateString) {
    if (!dateString) return null; // Retorna nulo se não houver data

    const parts = dateString.split('-'); // Divide a data em partes usando o hífen como separador
    if (parts.length !== 3) return null; // Verifica se a data está no formato correto

    const day = parts[0];   // Dia
    const month = parts[1]; // Mês
    const year = parts[2];  // Ano

    return `${year}-${month}-${day}`; // Retorna a data no formato "ano-mês-dia"
}

// Função para formatar a data para exibição no formato "dia - mês - ano"
function formatDateToDisplay(dateString) {
    if (!dateString) return null;

    const parts = dateString.split('-');
    if (parts.length !== 3) return null;

    const day = parts[2];   // Ano
    const month = parseInt(parts[1], 10) - 1; // Mês (0-11)
    const year = parts[0];  // Dia

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return `${day} - ${months[month]} - ${year}`; // Retorna a data formatada
}