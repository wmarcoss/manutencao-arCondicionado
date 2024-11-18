document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nomeUser = document.getElementById('nomeUser').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    const nomeError = document.getElementById('nomeError'); // Referência ao span de erro do nome
    const emailError = document.getElementById('emailError'); // Referência ao span de erro do email
    const senhaError = document.getElementById('senhaError'); // Referência ao span de erro da senha
    const confirmarSenhaError = document.getElementById('confirmarSenhaError'); // Referência ao span de erro da confirmarSenha

    // Validação de nome e sobrenome (apenas letras e ao menos dois nomes)
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (!nomeRegex.test(nomeUser)) {
        nomeError.textContent = 'Por favor, insira seu nome completo (nome e sobrenome), sem números.';
        nomeError.style.display = 'block'; // Exibe a mensagem de erro
        return;
    } else {
        nomeError.style.display = 'none'; // Esconde a mensagem de erro se o nome for válido
    }

    // Validação de e-mail com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Por favor, insira um e-mail válido.';
        emailError.style.display = 'block'; // Exibe a mensagem de erro
        return;
    } else {
        emailError.style.display = 'none'; // Esconde a mensagem de erro se o email for válido
    }

    // Validação de senha (mínimo 8 caracteres, ao menos 1 número, 1 caractere especial, e 1 letra maiúscula)
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!senhaRegex.test(senha)) {
        senhaError.textContent = 'Ao menos 8 caracteres, 1 número, 1 caractere especial e 1 letra maiúscula.';
        senhaError.style.display = 'flex'; // Exibe a mensagem de erro
        return;
    } else {
        senhaError.style.display = 'flex'; // Esconde a mensagem de erro se a senha for válida
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
        confirmarSenhaError.textContent = 'As senhas não coincidem!';
        confirmarSenhaError.style.display = 'block'; // Exibe a mensagem de erro
        return;
    } else {
        confirmarSenhaError.style.display = 'none'; // Esconde a mensagem de erro se as senhas coincidirem
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
