document.addEventListener('DOMContentLoaded', () => {
    const historicList = document.getElementById('historicList');

    // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
    const formatDate = (dateString) => {
        // Supondo que dateString esteja no formato ISO (aaaa-mm-dd)
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };

    const fetchManuntencao = async () => {
        try {
            const response = await fetch('http://localhost:3000/manutencao');
            const data = await response.json();
            historicList.innerHTML = data.map(manutencao => `
                <tr>
                    <td>${manutencao.lugar}</td>
                    <td>${manutencao.modelo_marca}</td>
                    <td>${formatDate(manutencao.data_manutencao)}</td>
                    <td>${manutencao.nome}</td>
                    <td class="lupaElixeira">
                        <a href="../detalhes/detalhes.html"><button><img src="../../assets/icons/lupa.png" alt="lupa" style="width: 25px;"></button></a>
                        <button class="linkExcluir"><img src="../../assets/icons/lixeira.png" alt="lixeira" style="width: 25px;"></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao buscar manutenção:', error);
        }
    };

    fetchManuntencao();

    // Mostrar os selects com base na opção selecionada
    document.getElementById('filtrar').addEventListener('change', function() {
        let local = document.getElementById('local');
        let modelo = document.getElementById('modelo');
        let data = document.getElementById('data');
        let profissional = document.getElementById('profissional');

        local.style.display = this.value === 'mostrarLocal' ? 'inline' : 'none';
        modelo.style.display = this.value === 'mostrarModelo' ? 'inline' : 'none';
        data.style.display = this.value === 'mostrarData' ? 'inline' : 'none';
        profissional.style.display = this.value === 'mostrarProfissional' ? 'inline' : 'none';
    });

    // Funcionalidade de confirmação de exclusão
    document.addEventListener('DOMContentLoaded', function() {
        const linkExcluirButtons = document.querySelectorAll('.linkExcluir');
        const confirmarExcluirDiv = document.querySelector('.confirmar_excluir');

        function mostrarConfirmacao() {
            confirmarExcluirDiv.style.display = 'block';
        }

        linkExcluirButtons.forEach(button => {
            button.addEventListener('click', mostrarConfirmacao);
        });

        const checkButton = document.getElementById('check');
        const closeButton = document.getElementById('close');

        function esconderConfirmacao() {
            confirmarExcluirDiv.style.display = 'none';
        }

        checkButton.addEventListener('click', function() {
            // Lógica para confirmar a exclusão
            esconderConfirmacao();
        });

        closeButton.addEventListener('click', function() {
            // Lógica para cancelar a exclusão
            esconderConfirmacao();
        });
    });
});
