document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    // Verifica se há um token
    if (!token) {
        alert('Você precisa estar autenticado para acessar esta página.');
        window.location.href = '../login/login.html';
        return; // Impede execução do código restante
    }

    // Verifica a validade do token no backend
    fetch('http://localhost:3000/verifica-token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.auth) {
            alert('Sessão expirada ou inválida. Por favor, faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = '../login/login.html';
        }
    })
    .catch(error => {
        console.error('Erro na verificação do token:', error);
        alert('Erro ao verificar sessão. Redirecionando para o login.');
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';
    });

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
});