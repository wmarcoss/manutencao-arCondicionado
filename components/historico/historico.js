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
    const fetchManutencao = async (filters = {}) => {
        try {
            const response = await fetch('http://localhost:3000/filtro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    historicList.innerHTML = '<tr><td colspan="5">Nenhuma manutenção encontrada.</td></tr>';
                    return;
                }
                throw new Error('Erro ao buscar manutenção');
            }

            const data = await response.json();
            historicList.innerHTML = data.map(manutencao => `
                <tr>
                    <td>${manutencao.lugar}</td>
                    <td>${manutencao.modelo_marca}</td>
                    <td>${formatDate(manutencao.data_manutencao)}</td>
                    <td>${manutencao.nome}</td>
                    <td class="lupaElixeira">
                        <a href="../detalhes/detalhes.html?id=${manutencao.id}">
                            <button>
                                <img src="../../assets/icons/lupa.png" alt="lupa" style="width: 25px;">
                            </button>
                        </a>
                        <button class="linkExcluir" data-id="${manutencao.id}">
                            <img src="../../assets/icons/lixeira.png" alt="lixeira" style="width: 25px;">
                        </button>
                    </td>
                </tr>
            `).join('');

            // Adiciona event listeners aos botões de exclusão
            const deleteButtons = document.querySelectorAll('.linkExcluir');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    currentDeleteId = button.getAttribute('data-id'); // Armazena o ID para exclusão
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
                method: 'DELETE',
            });

            if (response.ok) {
                confirmarExcluirDiv.style.display = 'none'; // Fecha o modal de confirmação
                mensagemTempora.classList.add('show'); // Adiciona a classe para mostrar a mensagem
                mensagemTempora.style.display = 'block'; // Torna a mensagem visível
                
                // Oculta a mensagem temporária após 3 segundos
                setTimeout(() => {
                    mensagemTempora.classList.remove('show'); // Remove a classe de exibição
                    mensagemTempora.classList.add('hide'); // Adiciona a classe de ocultação
                    
                    // Espera a animação de saída e então oculta completamente
                    setTimeout(() => {
                        mensagemTempora.style.display = 'none'; // Oculta a mensagem
                        mensagemTempora.classList.remove('hide'); // Remove a classe de ocultação para próxima exibição
                    }, 500); // Tempo da animação
                }, 3000);
                fetchManutencao(); // Atualiza a lista de manutenções após a exclusão
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

    // Mostrar os selects com base na opção selecionada
    document.getElementById('filtrar').addEventListener('change', function() {
        let local = document.getElementById('local');
        let modelo = document.getElementById('modelo');
        let data = document.getElementById('data');
        let profissional = document.getElementById('profissional');

        local.style.display = this.value === 'lugar' ? 'inline' : 'none';
        modelo.style.display = this.value === 'modelo_marca' ? 'inline' : 'none';
        data.style.display = this.value === 'data_manutencao' ? 'inline' : 'none';
        profissional.style.display = this.value === 'nome' ? 'inline' : 'none';

        if (this.value === 'nome') {
            fetchProfissionais(); // Carrega os profissionais quando o filtro 'nome' é selecionado
        }
    });

    // Função para buscar os profissionais e preencher o select
    const fetchProfissionais = async () => {
        try {
            const response = await fetch('http://localhost:3000/profissional');
            if (!response.ok) {
                throw new Error('Erro ao buscar profissionais');
            }
            const profissionais = await response.json();
            const profissionalSelect = document.getElementById('profissional');
            // Limpar as opções existentes, exceto a primeira
            profissionalSelect.innerHTML = '<option value="">Selecione o Profissional</option>';
            profissionais.forEach(prof => {
                profissionalSelect.innerHTML += `<option value="${prof.nome}">${prof.nome}</option>`;
            });
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error);
        }
    };

    // Função para coletar os filtros selecionados
    const getFilters = () => {
        const lugar = document.getElementById('local').value;
        const modelo_marca = document.getElementById('modelo').value;
        const data_manutencao = document.getElementById('data').value;
        const nome = document.getElementById('profissional').value;

        return {
            lugar: lugar !== '' ? lugar : null,
            modelo_marca: modelo_marca !== '' ? modelo_marca : null,
            periodo: data_manutencao !== '' ? data_manutencao : null,
            nome: nome !== '' ? nome : null,
        };
    };

    // Event listener para o botão de buscar
    document.getElementById('buscar').addEventListener('click', () => {
        const filters = getFilters();
        fetchManutencao(filters); // Chama a função com os filtros selecionados
    });

    // Carregar as manutenções ao carregar a página
    fetchManutencao();

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