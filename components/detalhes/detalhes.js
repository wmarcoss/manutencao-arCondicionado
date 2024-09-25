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

    // Recupera os dados da manutenção do localStorage
    const detalhesManutencao = JSON.parse(localStorage.getItem('detalhesManutencao'));

    // Verifica se os dados foram recuperados corretamente
    console.log('Dados recuperados do localStorage:', detalhesManutencao);
    
    if (detalhesManutencao) {
        // Preenche a página com os dados da manutenção
        document.getElementById('local').textContent = detalhesManutencao.lugar || 'Local não informado';
        document.getElementById('modelo').textContent = detalhesManutencao.modelo || 'Modelo não informado';
        document.getElementById('data_manutencao').textContent = formatDate(detalhesManutencao.data_manutencao) || 'Data não informada';
        document.getElementById('nome').textContent = detalhesManutencao.nome || 'Profissional não informado';
    } else {
        console.error('Nenhuma manutenção encontrada no localStorage.');
    }

    // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Verifica se a string de data é válida
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };
});
