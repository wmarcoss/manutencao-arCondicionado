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
            // Armazenando o token no localStorage
            localStorage.setItem('token', data.token);

            // Redirecionar para a página de home
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

// Verificar se o usuário já está autenticado
window.onload = () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:3000/verifica-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.auth) {
                window.location.href = '../home/home.html'; // Redireciona para home se token for válido
            } else {
                alert('Token expirado ou inválido. Por favor, faça login novamente.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error);
            alert('Erro na verificação do token. Faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = './login.html';
        });
    } else {
        window.location.href = './login.html'; // Redireciona para login se não houver token
    }
};