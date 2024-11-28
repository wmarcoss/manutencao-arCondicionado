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
        document.getElementById("nomeUser").textContent = nome ? `Nome: ${nome.split(" ")[0]}` : "Nome: Não disponível";
        document.getElementById("email").textContent = email ? `E-mail: ${email}` : "E-mail: Não disponível";
    
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

    // Verifica se há um token
    if (!token) {
        exibirMensagemErro('Você precisa estar autenticado para acessar esta página.');
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 3500); // Tempo suficiente para o alerta ser exibido
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

    // Função para manipular o envio do formulário de manutenção
    document.getElementById('manutencao-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = {
            nome: document.getElementById('profissional').value,
            data_manutencao: document.getElementById('data').value, // A data já está no formato correto (YYYY-MM-DD)
            data_previsao: document.getElementById('data2').value || null, // Se não houver data, envia null
            custo: document.getElementById('custo').value || null,
            detalhes: document.getElementById('detalhes').value || null,
            observacoes: document.getElementById('observacoes').value || null,
            lugar: document.getElementById('local').value,
            tipo_manutencao: document.getElementById('tipo-manutencao').value,
            modelo_marca: document.getElementById('modelo').value,
            tipo_conserto: document.getElementById('tipo-conserto').value,
        };

        console.log('Dados a serem enviados:', formData);

        // Envio para o servidor via fetch
        fetch('http://localhost:3000/manutencao', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho para autenticação
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

            // Exibir a mensagem temporária de sucesso
            exibirMensagemTempora();

            // Redireciona após 3.5 segundos (ajustando para o tempo de transição da mensagem)
            setTimeout(() => {
                window.location.href = `../historico/historico.html`;
            }, 3500);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar a manutenção: ' + error.message);
        });
    });

    // Função para exibir a mensagem temporária
    function exibirMensagemTempora() {
        const mensagemTempora = document.getElementById('mensagemTempora');
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
    }

    document.getElementById('cancelar').addEventListener('click', function() {
        document.getElementById('manutencao-form').reset(); // Reseta o formulário
    });

    function mostrarCalendario() {
        const inputDate = document.getElementById('calendario-icon');
        inputDate.focus(); // Isso simula o clique e abre o seletor de data
    }

    const trigger = document.getElementById('local-trigger', 'modelo-trigger');
    const optionsList = document.getElementById('local-options', 'modelo-options');
    const options = document.querySelectorAll('.custom-option');
    const triggerText = trigger.querySelector('span');

    // Ao clicar no select (trigger), alterna a visibilidade das opções
    trigger.addEventListener('click', function () {
        optionsList.classList.toggle('opened'); // Alterna a classe 'opened' para mostrar ou esconder as opções
        trigger.closest('.custom-select').classList.toggle('opened'); // Adiciona ou remove a classe 'opened' do select
    });

    // Quando uma opção é selecionada
    options.forEach(option => {
        option.addEventListener('click', function () {
            triggerText.textContent = option.textContent; // Atualiza o texto do trigger
            optionsList.classList.remove('opened'); // Fecha o select
        });
    });

    // Fecha as opções quando clicar fora do select
    document.addEventListener('click', function (event) {
        if (!trigger.contains(event.target)) {
            optionsList.classList.remove('opened');
            trigger.closest('.custom-select').classList.remove('opened');
        }
    });
});