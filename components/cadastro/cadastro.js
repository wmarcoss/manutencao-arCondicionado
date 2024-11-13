document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nomeUser = document.getElementById('nomeUser').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
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
            alert(result.message);
            window.location.replace('../login/login.html'); 
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
});

// Evento para redirecionar ao clicar em "Cancelar"
document.getElementById('cancelar').addEventListener('click', function() {
<<<<<<< HEAD
    window.location.replace('../login/login.html'); // Redireciona para a mesma aba da página de login
});

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
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
    const confirmPasswordField = document.getElementById('confirmPassword');
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
=======
    window.location.replace('../login/login.html'); 
});
>>>>>>> 74d955f0759eea65d795a4d4a8ce81b976dd96a0
