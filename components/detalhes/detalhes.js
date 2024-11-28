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

// Função para validar o token
const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, exibe a mensagem de erro e redireciona após um pequeno atraso
        exibirMensagemErro('Você precisa estar autenticado para acessar esta página.');
        setTimeout(() => {
            window.location.href = '../login/login.html';  // Redireciona para o login após 3 segundos
        }, 3500); // Aguarda o tempo da animação de erro para redirecionar
        return false;
    }
    return true;
};

// Função para formatar a data no formato brasileiro
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
};

// Função para carregar o header e garantir que o conteúdo seja carregado corretamente
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

// Função para carregar o Footer
const loadFooter = () => {
    return new Promise((resolve, reject) => {
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
                resolve();
            })
            .catch(error => {
                console.error('Erro ao carregar o footer:', error);
                exibirMensagemErro('Erro ao carregar o footer. Tente novamente mais tarde.');
                reject(error);
            });
    });
};

// Função para carregar os detalhes da manutenção
const loadManutencaoDetails = async () => {
    const id = new URLSearchParams(window.location.search).get('id'); // Obtém o ID da manutenção da URL
    if (!id) return;

    const token = localStorage.getItem('token'); // Pegando o token armazenado no localStorage
    if (!token) {
        exibirMensagemErro('Você precisa estar autenticado para acessar os detalhes.');
        setTimeout(() => {
            window.location.href = '../login/login.html';  // Se não houver token, redireciona para o login
        }, 3500); // Aguarda o tempo da animação de erro para redirecionar
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
        exibirMensagemErro('Erro ao carregar os detalhes da manutenção. Verifique o console para mais informações.');
    }
};

// Função para carregar os recursos na página
window.onload = () => {
    // Carrega o header e footer primeiro
    Promise.all([carregarHeader(), loadFooter()])
        .then(() => {
            console.log("Header e Footer carregados com sucesso.");

            // Valida o token após carregar o header e footer
            if (validateToken()) {
                loadManutencaoDetails(); // Carregar os detalhes da manutenção após validação do token
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os recursos:", error);
        });
};
