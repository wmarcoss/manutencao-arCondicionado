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

            // Selecionar o tipo de manutenção na lista suspensa
            const tipoManutencaoSelect = document.getElementById('tipo-manutencao');
            const tipoConsertoSelect = document.getElementById('tipo-conserto');

            // Se o valor for válido, selecione o tipo
            if (tipoManutencaoSelect.options.namedItem(manutencao.tipo_manutencao)) {
                tipoManutencaoSelect.value = manutencao.tipo_manutencao;
            }

            if (tipoConsertoSelect.options.namedItem(manutencao.tipo_conserto)) {
                tipoConsertoSelect.value = manutencao.tipo_conserto;
            }
        } catch (error) {
            console.error('Erro:', error);
        }
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

            // Mostrar mensagem de sucesso
            const mensagemTempora = document.getElementById('mensagem_tempora');
            mensagemTempora.style.display = 'block';
            setTimeout(() => {
                mensagemTempora.style.display = 'none';
            }, 3000); // Ocultar a mensagem após 3 segundos
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Adicionar eventos
    document.getElementById('manutencao-form').addEventListener('submit', handleEditSubmit);
    
    // Chama a função para carregar os dados para edição
    loadManutencaoForEdit();
});