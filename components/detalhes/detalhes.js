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
    
    if (detalhesManutencao) {
        // Preenche a página com os dados da manutenção
        document.getElementById('local').textContent = detalhesManutencao.lugar;
        document.getElementById('modelo').textContent = detalhesManutencao.modelo;
        document.getElementById('data').textContent = formatDate(detalhesManutencao.data);
        document.getElementById('profissional').textContent = detalhesManutencao.profissional;
    } else {
        console.error('Nenhuma manutenção encontrada no localStorage.');
    }

    // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };
});
console.log(localStorage.getItem('detalhesManutencao'));
