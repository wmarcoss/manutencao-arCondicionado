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

            // Preencher o formulário com os dados da manutenção
            document.getElementById('local').value = manutencao.lugar || '';
            document.getElementById('modelo').value = manutencao.modelo_marca || '';
            document.getElementById('tipo-manutencao').value = manutencao.tipo_manutencao || '';
            document.getElementById('tipo-conserto').value = manutencao.tipo_conserto || '';
            document.getElementById('data').value = manutencao.data_manutencao.split('T')[0]; // Formato yyyy-mm-dd
            document.getElementById('data2').value = manutencao.data_previsao ? manutencao.data_previsao.split('T')[0] : '';
            document.getElementById('profissional').value = manutencao.nome || '';
            document.getElementById('custo').value = manutencao.custo || '';
            document.getElementById('detalhes').value = manutencao.detalhes || '';
            document.getElementById('observacoes').value = manutencao.observacoes || '';

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
            document.getElementById('mensagemTempora').style.display = 'block';
            setTimeout(() => {
                document.getElementById('mensagemTempora').style.display = 'none';
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