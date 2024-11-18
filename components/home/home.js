document.addEventListener("DOMContentLoaded", function() {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, redireciona para a página de login
        window.location.href = '../login/login.html';
    } else {
        // Verificar a validade do token
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
                // Se o token não for válido, redireciona para o login
                localStorage.removeItem('token');
                window.location.href = '../login/login.html';
            }
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error);
            // Se houver um erro na verificação do token, redireciona para o login
            localStorage.removeItem('token');
            window.location.href = '../login/login.html';
        });
    }

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