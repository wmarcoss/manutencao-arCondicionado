document.addEventListener('DOMContentLoaded', () => {
    const historicList = document.getElementById('historicList');
    const confirmarExcluirDiv = document.querySelector('.confirmar_excluir');
    const mensagemTempora = document.getElementById('mensagemTempora');
    let currentDeleteId = null;

    // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };

    // Função para buscar as manutenções
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
                        <button class="linkExcluir" data-id="${manutencao.id}"><img src="../../assets/icons/lixeira.png" alt="lixeira" style="width: 25px;"></button>
                    </td>
                </tr>
            `).join('');

            // Adiciona event listeners aos botões de exclusão
            const deleteButtons = document.querySelectorAll('.linkExcluir');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    currentDeleteId = event.target.closest('.linkExcluir').getAttribute('data-id');
                    confirmarExcluirDiv.style.display = 'flex'; // Exibe o modal de confirmação
                });
            });
        } catch (error) {
            console.error('Erro ao buscar manutenção:', error);
        }
    };

    // Função para deletar manutenção
    const deleteManutencao = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                confirmarExcluirDiv.style.display = 'none'; // Fecha o modal de confirmação
                mensagemTempora.style.display = 'block'; // Exibe a mensagem temporária
                // Oculta a mensagem temporária após 3 segundos
                setTimeout(() => {
                    mensagemTempora.style.display = 'none';
                }, 3000);
                fetchManuntencao(); // Atualiza a lista de manutenções após a exclusão
            } else {
                alert('Erro ao deletar manutenção');
            }
        } catch (error) {
            console.error('Erro ao deletar manutenção:', error);
        }
    };

    // Event listener para confirmar exclusão
    document.getElementById('check').addEventListener('click', () => {
        if (currentDeleteId) {
            deleteManutencao(currentDeleteId);
        }
    });

    // Event listener para cancelar exclusão
    document.getElementById('close').addEventListener('click', () => {
        confirmarExcluirDiv.style.display = 'none'; // Fecha o modal de confirmação
    });

    // Chama a função para carregar as manutenções
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
});
