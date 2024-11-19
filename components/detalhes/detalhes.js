// Função para validar o token
const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, redireciona para a página de login
        window.location.href = '../login/login.html';
    }
};

// Função para formatar a data no formato brasileiro
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
};

// Função para carregar o Header
const loadHeader = () => {
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
};

// Função para carregar o Footer
const loadFooter = () => {
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
};

// Função para carregar os detalhes da manutenção
const loadManutencaoDetails = async () => {
    const id = new URLSearchParams(window.location.search).get('id'); // Obtém o ID da manutenção da URL
    if (!id) return;

    const token = localStorage.getItem('token'); // Pegando o token armazenado no localStorage
    if (!token) {
        window.location.href = '../login/login.html';  // Se não houver token, redireciona para o login
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviando o token no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar os detalhes da manutenção.');
        }

        const manutencao = await response.json();

        // Preencher os campos com os dados da manutenção
        document.getElementById('local').innerText = manutencao.lugar;
        document.getElementById('modelo').innerText = manutencao.modelo_marca;
        document.getElementById('data').innerText = formatDate(manutencao.data_manutencao);
        document.getElementById('profissional').innerText = manutencao.nome;

        // Preencher outros campos
        document.getElementById('tipo-manutencao').innerText = manutencao.tipo_manutencao || '';
        document.getElementById('tipo-conserto').innerText = manutencao.tipo_conserto || '';
        document.getElementById('previsao').innerText = manutencao.data_previsao ? formatDate(manutencao.data_previsao) : '';
        document.getElementById('custo').innerText = manutencao.custo || '';
        document.getElementById('detalhes').innerText = manutencao.detalhes || '';
        document.getElementById('observacoes').innerText = manutencao.observacoes || '';

        // Adicionar o ID ao link do botão de edição
        const editarLink = document.getElementById('editar-text');
        editarLink.href = `../edit/edit.html?id=${id}`; // Atualiza o link de edição com o ID

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar os detalhes da manutenção. Verifique o console para mais informações.');
    }
};

// Chama a função de validação de token ao carregar a página
window.onload = () => {
    validateToken(); // Valida o token ao carregar a página
    loadHeader(); // Carrega o header
    loadFooter(); // Carrega o footer
    loadManutencaoDetails(); // Carrega os detalhes da manutenção após a validação
};