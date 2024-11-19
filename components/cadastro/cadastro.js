// Evento para validar nome ao sair do campo
document.getElementById('nomeUser').addEventListener('blur', function () {
    const nomeUser = this.value;
    const nomeError = document.getElementById('nomeError');
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

    if (!nomeRegex.test(nomeUser)) {
        nomeError.textContent = 'Por favor, insira seu nome completo (nome e sobrenome), sem números.';
        nomeError.style.display = 'block';
    } else {
        nomeError.style.display = 'none';
    }
});

// Evento para validar e-mail ao sair do campo
document.getElementById('email').addEventListener('blur', function () {
    const email = this.value;
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        emailError.textContent = 'Por favor, insira um e-mail válido.';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

// Evento para validar senha ao sair do campo
document.getElementById('senha').addEventListener('blur', function () {
    const senha = this.value;
    const senhaError = document.getElementById('senhaError');
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!senhaRegex.test(senha)) {
        senhaError.textContent = 'Ao menos 8 caracteres, 1 número, 1 caractere especial e 1 letra maiúscula.';
        senhaError.style.display = 'block';
    } else {
        senhaError.style.display = 'none';
    }
});

// Evento para validar a confirmação de senha ao sair do campo
document.getElementById('confirmarSenha').addEventListener('blur', function () {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = this.value;
    const confirmarSenhaError = document.getElementById('confirmarSenhaError');

    if (senha !== confirmarSenha) {
        confirmarSenhaError.textContent = 'As senhas não coincidem!';
        confirmarSenhaError.style.display = 'block';
    } else {
        confirmarSenhaError.style.display = 'none';
    }
});

// Evento para submissão do formulário
document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nomeUser = document.getElementById('nomeUser').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    const nomeError = document.getElementById('nomeError');
    const emailError = document.getElementById('emailError');
    const senhaError = document.getElementById('senhaError');
    const confirmarSenhaError = document.getElementById('confirmarSenhaError');

    // Verificar se há erros
    if (nomeError.style.display === 'block' ||
        emailError.style.display === 'block' ||
        senhaError.style.display === 'block' ||
        confirmarSenhaError.style.display === 'block') {
        alert('Por favor, corrija os erros antes de continuar.');
        return;
    }

    // Enviar dados para o backend
    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUser, email, senha })
        });

        const result = await response.json();
        if (response.ok) {
            exibirMensagemTempora();
            setTimeout(() => {
                window.location.replace('../login/login.html'); // Redireciona para a página de login
            }, 3000);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
});

// Evento para redirecionar ao clicar em "Cancelar"
document.getElementById('cancelar').addEventListener('click', function () {
    window.location.replace('../login/login.html'); // Redireciona para a página de login
});

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('senha');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../../assets/icons/olhin.png"; // ícone para senha visível
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../../assets/icons/olhin fechado.png"; // ícone para senha oculta
    }
}

// Função para alternar a visibilidade da confirmação de senha
function toggleConfirmPasswordVisibility() {
    const confirmPasswordField = document.getElementById('confirmarSenha');
    const eyeIconConfirm = document.getElementById('eye-icon-confirm');

    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        eyeIconConfirm.src = "../../assets/icons/olhin.png"; // ícone para senha visível
    } else {
        confirmPasswordField.type = "password";
        eyeIconConfirm.src = "../../assets/icons/olhin fechado.png"; // ícone para senha oculta
    }
}

// Função para exibir a mensagem temporária
function exibirMensagemTempora() {
    const mensagemTempora = document.getElementById('mensagemTempora');
    mensagemTempora.style.display = 'block';
    mensagemTempora.style.right = '20px';
    mensagemTempora.style.opacity = '1';

    setTimeout(() => {
        mensagemTempora.style.right = '-300px';
        mensagemTempora.style.opacity = '0';

        setTimeout(() => {
            mensagemTempora.style.display = 'none';
        }, 500);
    }, 3000);
}