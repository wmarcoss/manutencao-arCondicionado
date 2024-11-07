document.addEventListener("DOMContentLoaded", function () {
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

    // Função para carregar os dados da manutenção para edição
    const loadManutencaoForEdit = async () => {
        const id = new URLSearchParams(window.location.search).get('id'); // Obtém o ID da manutenção da URL
        if (!id) return;

        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados da manutenção para edição.');
            }
            const manutencao = await response.json();

            // Preencher o formulário com os dados da manutenção, se os campos existirem
            const setValueIfExists = (elementId, value) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = value !== null && value !== undefined ? value : ''; // Define como vazio se `null` ou `undefined`
                }
            };

            setValueIfExists('local', manutencao.lugar);
            setValueIfExists('modelo', manutencao.modelo_marca);
            setValueIfExists('tipo-manutencao', manutencao.tipo_manutencao);
            setValueIfExists('tipo-conserto', manutencao.tipo_conserto);
            setValueIfExists('data', manutencao.data_manutencao ? manutencao.data_manutencao.split('T')[0] : '');
            setValueIfExists('data2', manutencao.data_previsao ? manutencao.data_previsao.split('T')[0] : '');
            setValueIfExists('nome', manutencao.nome);
            setValueIfExists('custo', manutencao.custo);
            setValueIfExists('detalhes', manutencao.detalhes);
            setValueIfExists('observacoes', manutencao.observacoes);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para exibir a mensagem temporária de sucesso
    const exibirMensagemTempora = () => {
        const mensagemTempora = document.getElementById('mensagem_tempora');
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
    };

    // Função para enviar o formulário de edição
    const handleEditSubmit = async (event) => {
        event.preventDefault(); // Prevenir o envio do formulário padrão

        const id = new URLSearchParams(window.location.search).get('id');
        const formData = new FormData(document.getElementById('manutencao-form'));
        const data = Object.fromEntries(formData);

        // Substituir campos vazios por null
        for (const key in data) {
            if (data[key] === '') {
                data[key] = null; // Define como null se o campo estiver vazio
            }
        }

        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar a manutenção.');
            }

            // Exibir a mensagem temporária de sucesso
            exibirMensagemTempora();

            // Aguarda 3 segundos antes de redirecionar para a página de detalhes com o ID
            setTimeout(() => {
                window.location.href = `../detalhes/detalhes.html?id=${id}`;
            }, 3500); // Redireciona após 3.5 segundos (ajustando para o tempo de transição da mensagem)
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Redirecionar para a página de detalhes com o ID ao cancelar
    const handleCancel = () => {
        const id = new URLSearchParams(window.location.search).get('id');
        if (id) {
            window.location.href = `../detalhes/detalhes.html?id=${id}`;
        }
    };

    // Adicionar eventos
    document.getElementById('manutencao-form').addEventListener('submit', handleEditSubmit);
    document.getElementById('cancelar').addEventListener('click', handleCancel);

    // Chama a função para carregar os dados para edição
    loadManutencaoForEdit();
});