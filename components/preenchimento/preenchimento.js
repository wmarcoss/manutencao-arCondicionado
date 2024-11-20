document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    // Função para exibir mensagens temporárias de erro
    function exibirMensagemErro(mensagem) {
        let mensagemErro = document.getElementById('mensagemErro');

        // Cria o elemento se ele não existir
        if (!mensagemErro) {
            mensagemErro = document.createElement('div');
            mensagemErro.id = 'mensagemErro';
            mensagemErro.className = 'mensagem_erro';
            document.body.appendChild(mensagemErro);
        }

        mensagemErro.textContent = mensagem; // Define o texto da mensagem
        mensagemErro.style.display = 'block'; // Torna o elemento visível
        mensagemErro.style.right = '20px'; // Move para a tela
        mensagemErro.style.opacity = '1'; // Torna visível

        // Ocultar a mensagem após 3 segundos
        setTimeout(() => {
            mensagemErro.style.right = '-300px'; // Move para fora da tela
            mensagemErro.style.opacity = '0'; // Torna invisível

            // Após a transição, esconde completamente
            setTimeout(() => {
                mensagemErro.style.display = 'none';
            }, 500); // Tempo correspondente à duração da transição de saída
        }, 3000); // Exibe a mensagem por 3 segundos
    }

    // Função para carregar um componente HTML
    function carregarComponente(url, elemento) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar ${url}`);
                }
                return response.text();
            })
            .then(data => {
                elemento.innerHTML = data;
            })
            .catch(error => {
                console.error(`Erro ao carregar o componente (${url}):`, error);
            });
    }

    // Garantir carregamento de header e footer antes de seguir
    const headerElement = document.getElementById('header-geral');
    const footerElement = document.getElementById('footer-geral');

    Promise.all([
        carregarComponente('../header/header.html', headerElement),
        carregarComponente('../footer/footer.html', footerElement)
    ]).then(() => {
        // Após o carregamento dos componentes, validar o token
        if (!token) {
            exibirMensagemErro('Você precisa estar autenticado para acessar esta página.');
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 3500); // Tempo suficiente para o alerta ser exibido
            return;
        }

        // Verifica a validade do token no backend
        return fetch('http://localhost:3000/verifica-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    })
    .then(response => response?.json())
    .then(data => {
        if (data && !data.auth) {
            exibirMensagemErro('Sessão expirada ou inválida. Por favor, faça login novamente.');
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '../login/login.html';
            }, 3500);
        }
    })
    .catch(error => {
        console.error('Erro na verificação do token:', error);
        exibirMensagemErro('Erro ao verificar sessão. Redirecionando para o login.');
        setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '../login/login.html';
        }, 3500);
    });
});
