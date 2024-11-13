document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nomeUser = document.getElementById('nomeUser').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Validação de nome e sobrenome (apenas letras e ao menos dois nomes)
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (!nomeRegex.test(nomeUser)) {
        alert('Por favor, insira seu nome completo (nome e sobrenome), sem números.');
        return;
    }

    // Validação de e-mail com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Validação de senha (mínimo 8 caracteres, ao menos 1 número, 1 caractere especial, e 1 letra maiúscula)
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!senhaRegex.test(senha)) {
        alert('A senha deve ter no mínimo 8 caracteres, incluindo ao menos 1 número, 1 caractere especial e 1 letra maiúscula.');
        return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Enviar dados para o backend
    try {
        const response = await fetch('http://localhost:3000/cadastro', {  // Altere para a URL completa do backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUser, email, senha })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.replace('../login/login.html'); // Redireciona para a mesma aba da página de login
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
});

// Evento para redirecionar ao clicar em "Cancelar"
document.getElementById('cancelar').addEventListener('click', function() {
    window.location.replace('../login/login.html'); // Redireciona para a mesma aba da página de login
});

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('senha');
    const eyeIcon = document.getElementById('eye-icon');
    
    // Verifica o tipo do campo de senha e alterna
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
    
    // Verifica o tipo do campo de confirmação de senha e alterna
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        eyeIconConfirm.src = "../../assets/icons/olhin.png"; // ícone para senha visível
    } else {
        confirmPasswordField.type = "password";
        eyeIconConfirm.src = "../../assets/icons/olhin fechado.png"; // ícone para senha oculta
    }
}