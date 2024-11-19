document.addEventListener("DOMContentLoaded", function() {
    // Carregar o Header
    const headerElement = document.getElementById('header-geral');
    fetch('../header/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o header.');
            }
            return response.text();
        })
        .then(data => {
            headerElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Erro ao carregar o header:', error);
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

    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não houver token, redireciona para a página de login
        window.location.href = '../login/login.html';
    } else {
        // Verificar a validade do token
        fetch('http://localhost:3000/verifica-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Status da resposta:', response.status); // Depuração do status
            if (response.status === 403) {
                throw new Error('Acesso negado (403). O token pode estar inválido ou expirado.');
            }
            if (!response.ok) {
                throw new Error('Erro ao verificar token');
            }
            return response.json();
        })
        .then(data => {
            if (!data.auth) {
                console.log('Token inválido ou expirado');
                localStorage.removeItem('token');
                window.location.href = '../login/login.html'; // Redireciona para o login se o token for inválido
            }
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error);
            localStorage.removeItem('token');
            window.location.href = '../login/login.html'; // Redireciona para o login caso ocorra erro
        });
    }

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
});