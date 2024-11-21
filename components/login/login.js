// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../../assets/icons/olhin.png"; // Ícone para senha visível
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../../assets/icons/olhin fechado.png"; // Ícone para senha oculta
    }
}

// Adiciona mensagens de erro aos campos
function exibirErro(campo, mensagem) {
    let errorElement = document.getElementById(`${campo.id}Error`);
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${campo.id}Error`;
        errorElement.className = 'error-message'; // Classe CSS para estilizar
        campo.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = mensagem;
}

// Remove mensagens de erro ao corrigir
function removerErro(campo) {
    const errorElement = document.getElementById(`${campo.id}Error`);
    if (errorElement) {
        errorElement.remove();
    }
}

// Exibir a mensagem temporária com base no tipo de erro
function exibirMensagemTempora(mensagemTipo) {
    const mensagemTempora = document.getElementById(mensagemTipo); // Usar o ID correto passado como argumento
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

// Evento para validar email ao sair do campo
document.getElementById('email').addEventListener('blur', function () {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        exibirErro(this, 'Por favor, insira um e-mail válido.');
    } else {
        removerErro(this);
    }
});

// Evento para validar senha ao sair do campo
document.getElementById('password').addEventListener('blur', function () {
    const senha = this.value;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!senhaRegex.test(senha)) {
        exibirErro(this, '8 caracteres, 1 número, 1 caractere especial e 1 letra maiúscula.');
    } else {
        removerErro(this);
    }
});

// Função de login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email');
    const senha = document.getElementById('password');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    let hasError = false;

    // Validar o email
    if (!emailRegex.test(email.value)) {
        exibirErro(email, 'Por favor, insira um e-mail válido.');
        hasError = true;
    } else {
        removerErro(email);
    }

    // Validar a senha
    if (!senhaRegex.test(senha.value)) {
        exibirErro(senha, 'Ao menos 8 caracteres, 1 número, 1 caractere especial e 1 letra maiúscula.');
        hasError = true;
    } else {
        removerErro(senha);
    }

    // Se houver erro, não prossegue
    if (hasError) {
        alert('Corrija os erros antes de continuar.');
        return;
    }

    // Envia a requisição de login para o servidor
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.value, senha: senha.value })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta da API:', data); // Para depuração

        if (data.error === 'Email não encontrado') {
            exibirMensagemTempora('mensagemEmailNaoCadastrado');
        } else if (data.error === 'Senha incorreta') {
            exibirMensagemTempora('mensagemCredenciaisInvalidas');
        } else if (data.token) {
            // Armazena o token e redireciona para a página inicial
            localStorage.setItem('token', data.token);
            window.location.href = '../home/home.html';
        } else {
            exibirMensagemTempora('mensagemErroGenerico');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        exibirMensagemTempora('mensagemErroGenerico');
    });
});