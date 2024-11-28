document.addEventListener("DOMContentLoaded", function () {
    // Função para exibir a mensagem temporária de erro
    const exibirMensagemErro = (mensagem) => {
        const mensagemErro = document.getElementById('mensagemErro');

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
    };

    // Função para validar o token
    const validateToken = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Se não houver token, exibe a mensagem de erro e redireciona após um pequeno atraso
            exibirMensagemErro('Você precisa estar autenticado para acessar esta página.');
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 3500); // Aguarda o tempo da animação de erro para redirecionar
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/verifica-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (!data.auth) {
                // Se o token não for válido, exibe a mensagem de erro e redireciona para o login
                exibirMensagemErro('Token inválido. Redirecionando para o login...');
                localStorage.removeItem('token');  // Remove o token inválido
                setTimeout(() => {
                    window.location.href = '../login/login.html';
                }, 3500); // Redireciona após o tempo de exibição da mensagem de erro
            }
        } catch (error) {
            console.error('Erro na verificação do token:', error);
            localStorage.removeItem('token');
            exibirMensagemErro('Erro na verificação do token. Redirecionando para o login...');
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 3500); // Redireciona após o tempo de exibição da mensagem de erro
        }
    };

    // Chama a função de validação de token ao carregar a página
    validateToken();

    /// Função para carregar o header e garantir que o conteúdo seja carregado corretamente
    function carregarHeader() {
        const headerElement = document.getElementById('header-geral');
        fetch('../header/header.html')
            .then(response => response.ok ? response.text() : Promise.reject('Erro ao carregar o header.'))
            .then(data => {
                headerElement.innerHTML = data;
                inicializarHeader(); // Inicializa os eventos após o carregamento do header
            })
            .catch(error => console.error(error));
    }
    
    function inicializarHeader() {
        const menuButton = document.getElementById("menu-button");
        const menuOptions = document.getElementById("menu-options");
        const logoutButton = document.getElementById("logout");
    
        // Exibir nome e e-mail do localStorage
        const nome = localStorage.getItem("nomeUser");
        const email = localStorage.getItem("email");
    
        // Atualizar informações no menu
        document.getElementById("nomeUser").textContent = nome ? ` ${nome.split(" ")[0]}` : " Não disponível";
        document.getElementById("email").textContent = email ? ` ${email}` : " Não disponível";
    
        // Alternar visibilidade do menu
        if (menuButton && menuOptions) {
            menuButton.addEventListener("click", (event) => {
                event.stopPropagation();
                menuOptions.classList.toggle("active");
            });
            document.addEventListener("click", (event) => {
                if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
                    menuOptions.classList.remove("active");
                }
            });
        }
    
        // Logout: remover informações do localStorage
        if (logoutButton) {
            logoutButton.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.clear();  // Limpa o localStorage
                window.location.href = "../login/login.html";  // Redireciona para o login
            });
        }
    }

    // Caso o código seja chamado em outras páginas após carregamento dinâmico do conteúdo (como a de preenchimento):
    window.addEventListener('load', function () {
        // Chama novamente a inicialização do header caso não tenha ocorrido na página preenchimento
        if (document.getElementById('header-geral') && !document.querySelector('#header-geral .menu-button-inicializado')) {
            console.log('Reinicializando o header na página preenchimento...');
            carregarHeader();
        }
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

    // Função para carregar os dados da manutenção para edição
    const loadManutencaoForEdit = async () => {
        const id = new URLSearchParams(window.location.search).get('id'); // Obtém o ID da manutenção da URL
        if (!id) return;

        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados da manutenção para edição.');
            }
            const manutencao = await response.json();

            // Preencher o formulário com os dados da manutenção, se os campos existirem
            const setValueIfExists = (elementId, value) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = value !== null && value !== undefined ? value : ''; // Define como vazio se `null` ou `undefined`
                }
            };

            setValueIfExists('local', manutencao.lugar);
            setValueIfExists('modelo', manutencao.modelo_marca);
            setValueIfExists('tipo-manutencao', manutencao.tipo_manutencao);
            setValueIfExists('tipo-conserto', manutencao.tipo_conserto);
            setValueIfExists('data', manutencao.data_manutencao ? manutencao.data_manutencao.split('T')[0] : '');
            setValueIfExists('data2', manutencao.data_previsao ? manutencao.data_previsao.split('T')[0] : '');
            setValueIfExists('nome', manutencao.nome);
            setValueIfExists('custo', manutencao.custo);
            setValueIfExists('detalhes', manutencao.detalhes);
            setValueIfExists('observacoes', manutencao.observacoes);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para exibir a mensagem temporária de sucesso
    const exibirMensagemTempora = () => {
        const mensagemTempora = document.getElementById('mensagem_tempora');
        mensagemTempora.style.display = 'block'; // Torna o elemento visível
        mensagemTempora.style.right = '20px'; // Move para a tela
        mensagemTempora.style.opacity = '1'; // Torna visível

        // Ocultar a mensagem após 3 segundos
        setTimeout(() => {
            mensagemTempora.style.right = '-300px'; // Move para fora da tela
            mensagemTempora.style.opacity = '0'; // Torna invisível

            // Após a transição, esconde completamente
            setTimeout(() => {
                mensagemTempora.style.display = 'none';
            }, 500); // Tempo correspondente à duração da transição de saída
        }, 3000); // Exibe a mensagem por 3 segundos
    };

    // Função para enviar o formulário de edição
    const handleEditSubmit = async (event) => {
        event.preventDefault(); // Prevenir o envio do formulário padrão
    
        const id = new URLSearchParams(window.location.search).get('id');
        const formData = new FormData(document.getElementById('manutencao-form'));
        const data = Object.fromEntries(formData);
    
        // Substituir campos vazios por null
        for (const key in data) {
            if (data[key] === '') {
                data[key] = null;
            }
        }
    
        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao editar a manutenção.');
            }
    
            exibirMensagemTempora();
    
            setTimeout(() => {
                window.location.href = `../detalhes/detalhes.html?id=${id}`;
            }, 3500);
        } catch (error) {
            console.error('Erro:', error);
        }
    };    

    // Redirecionar para a página de detalhes com o ID ao cancelar
    const handleCancel = () => {
        const id = new URLSearchParams(window.location.search).get('id');
        if (id) {
            window.location.href = `../detalhes/detalhes.html?id=${id}`;
        }
    };

    // Adicionar eventos
    document.getElementById('manutencao-form').addEventListener('submit', handleEditSubmit);
    document.getElementById('cancelar').addEventListener('click', handleCancel);

    // Chama a função para carregar os dados para edição
    loadManutencaoForEdit();
});