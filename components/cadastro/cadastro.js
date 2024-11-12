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
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUser, email, senha })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = '../login/login.html'; // Redireciona para a página de login
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
});