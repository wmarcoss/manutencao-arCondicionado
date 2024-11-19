// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    // Verifica o tipo do campo de senha e alterna
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../../assets/icons/olhin.png"; // Ícone para senha visível
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../../assets/icons/olhin fechado.png"; // Ícone para senha oculta
    }
}

// Função de login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio tradicional do formulário

    // Obtendo os valores dos campos de email e senha
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    // Verificar se os campos estão preenchidos
    if (!email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Enviar dados de login para o backend
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Armazenar o token no localStorage
            localStorage.setItem('token', data.token);

            // Redirecionar o usuário para a página inicial
            window.location.href = '../home/home.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
    });
});