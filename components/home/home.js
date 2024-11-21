document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    // Função para criar dinamicamente uma mensagem temporária
    function criarMensagemTempora(id, mensagem) {
        const mensagemTempora = document.createElement('div');
        mensagemTempora.id = id;
        mensagemTempora.className = 'mensagem_tempora';
        mensagemTempora.textContent = mensagem;
        document.body.appendChild(mensagemTempora);
        return mensagemTempora;
    }

    // Função para exibir a mensagem temporária
    function exibirMensagemTempora(mensagemTipo, mensagem, callback) {
        let mensagemTempora = document.getElementById(mensagemTipo);

        if (!mensagemTempora) {
            mensagemTempora = criarMensagemTempora(mensagemTipo, mensagem);
        }

        mensagemTempora.style.display = 'block';
        mensagemTempora.style.right = '20px';
        mensagemTempora.style.opacity = '1';

        setTimeout(() => {
            mensagemTempora.style.right = '-300px';
            mensagemTempora.style.opacity = '0';

            setTimeout(() => {
                mensagemTempora.style.display = 'none';
                if (callback) callback();
            }, 500);
        }, 3000);
    }

    // Função para carregar o header
    function carregarHeader() {
        return new Promise((resolve, reject) => {
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

                    // Inicializa os eventos do perfil após carregar o header
                    inicializarPerfil();
                    resolve();
                })
                .catch(error => {
                    console.error('Erro ao carregar o header:', error);
                    reject(error);
                });
        });
    }

    // Função para inicializar o comportamento do menu de perfil
    function inicializarPerfil() {
        const profileImage = document.getElementById('profile');
        const profileOptions = document.getElementById('profileOptions');

        if (profileImage && profileOptions) {
            // Alterna a visibilidade do menu
            function toggleProfileOptions() {
                profileOptions.style.display =
                    profileOptions.style.display === 'block' ? 'none' : 'block';
            }

            // Evento de clique na imagem do perfil
            profileImage.addEventListener('click', function (event) {
                event.stopPropagation(); // Evita propagação do clique
                toggleProfileOptions();
            });

            // Fecha o menu se clicar fora
            document.addEventListener('click', function (event) {
                if (!profileImage.contains(event.target) &&
                    !profileOptions.contains(event.target)) {
                    profileOptions.style.display = 'none';
                }
            });

            // Logout (opcional)
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    localStorage.removeItem('token');
                    window.location.href = '../login/login.html';
                });
            }
        }
    }

    // Função para verificar o token
    function verificarToken() {
        if (!token) {
            exibirMensagemTempora(
                'mensagem-erro-autenticacao',
                'Você precisa estar autenticado para acessar esta página.',
                () => {
                    window.location.href = '../login/login.html';
                }
            );
            return;
        }

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
                    exibirMensagemTempora(
                        'mensagem-erro-sessao-expirada',
                        'Sessão expirada ou inválida.',
                        () => {
                            localStorage.removeItem('token');
                            window.location.href = '../login/login.html';
                        }
                    );
                }
            })
            .catch(error => {
                console.error('Erro na verificação do token:', error);
                exibirMensagemTempora(
                    'mensagem-erro-verificacao',
                    'Erro ao verificar sessão. Redirecionando para o login.',
                    () => {
                        localStorage.removeItem('token');
                        window.location.href = '../login/login.html';
                    }
                );
            });
    }

    // Executar o fluxo de inicialização
    carregarHeader()
        .then(() => {
            verificarToken();
        })
        .catch(error => {
            console.error('Erro durante o carregamento inicial:', error);
        });
});
