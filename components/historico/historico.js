document.addEventListener('DOMContentLoaded', () => {
    const historicList = document.getElementById('historicList');
    const confirmarExcluirDiv = document.querySelector('.confirmar_excluir');
    const mensagemTempora = document.getElementById('mensagemTempora');
    const overlay = document.getElementById('overlay');
    const buscarButton = document.getElementById('buscar');
    const refreshButton = document.getElementById('refresh');
    let currentDeleteId = null;

    // Função para validar o token
    const validateToken = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Se não houver token, redireciona para a página de login
            console.error("Token ausente. Redirecionando para o login...");
            window.location.href = './login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/verifica-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (!data.auth) {
                // Se o token não for válido, redireciona para o login
                console.error("Token inválido. Redirecionando para o login...");
                localStorage.removeItem('token');  // Remove o token inválido
                window.location.href = './login.html';
            }
        } catch (error) {
            console.error('Erro na verificação do token:', error);
            localStorage.removeItem('token');
            window.location.href = './login.html';
        }
    };

    // Chama a função de validação de token ao carregar a página
    validateToken();

    // Função para exibir a mensagem temporária
    function exibirMensagemTempora() {
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

    // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options);
    };

    // Função para buscar as manutenções
    const fetchManutencao = async (filters = {}) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/filtro', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    historicList.innerHTML = '<tr><td colspan="7">Nenhuma manutenção encontrada.</td></tr>';
                    return;
                }
                throw new Error('Erro ao buscar manutenção');
            }

            const data = await response.json();
            historicList.innerHTML = data.map(manutencao => ` 
                <tr>
                    <td>${manutencao.lugar}</td>
                    <td>${manutencao.modelo_marca}</td>
                    <td>${manutencao.tipo_manutencao}</td>
                    <td>${manutencao.nome}</td>
                    <td>${formatDate(manutencao.data_manutencao)}</td>
                    <td class="lupaElixeira">
                        <a href="../detalhes/detalhes.html?id=${manutencao.id}" title="Detalhes da manutenção">
                            <button>
                                <img src="../../assets/icons/lupa.png" alt="lupa" style="width: 25px;">
                            </button>
                        </a>
                        <button class="linkExcluir" data-id="${manutencao.id}" title="Excluir manutenção">
                            <img src="../../assets/icons/lixeira.png" alt="lixeira" style="width: 25px;">
                        </button>
                    </td>
                </tr>
            `).join('');            

            // Adiciona event listeners aos botões de exclusão
            const deleteButtons = document.querySelectorAll('.linkExcluir');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    currentDeleteId = button.getAttribute('data-id');
                    confirmarExcluirDiv.style.display = 'flex';
                    overlay.style.display = 'block';
                });
            });
        } catch (error) {
            console.error('Erro ao buscar manutenção:', error);
        }
    };

    // Função para deletar manutenção
    const deleteManutencao = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                confirmarExcluirDiv.style.display = 'none';
                overlay.style.display = 'none';
                exibirMensagemTempora(); // Exibe a mensagem temporária após exclusão
                fetchManutencao();
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
        confirmarExcluirDiv.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Mostrar os selects com base na opção selecionada
    document.getElementById('filtrar').addEventListener('change', function () {
        let local = document.getElementById('local');
        let modelo = document.getElementById('modelo');
        let data = document.getElementById('data');
        let profissional = document.getElementById('profissional');
        let tipo_manutencao = document.getElementById('tipo_manutencao');

        local.style.display = this.value === 'lugar' ? 'inline' : 'none';
        modelo.style.display = this.value === 'modelo_marca' ? 'inline' : 'none';
        data.style.display = this.value === 'data_manutencao' ? 'inline' : 'none';
        profissional.style.display = this.value === 'nome' ? 'inline' : 'none';
        tipo_manutencao.style.display = this.value === 'tipo_manutencao' ? 'inline' : 'none';

        if (this.value === 'nome') {
            fetchProfissionais();
        }
    });

    // Função para buscar os profissionais e preencher o select
    const fetchProfissionais = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/profissional', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar profissionais');
            }
            const profissionais = await response.json();
            const profissionalSelect = document.getElementById('profissional');
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
        const tipo_manutencao = document.getElementById('tipo_manutencao').value;

        return {
            lugar: lugar !== '' ? lugar : null,
            modelo_marca: modelo_marca !== '' ? modelo_marca : null,
            periodo: data_manutencao !== '' ? data_manutencao : null,
            nome: nome !== '' ? nome : null,
            tipo_manutencao: tipo_manutencao !== '' ? tipo_manutencao : null,
        };
    };

    // Desabilita os selects e botão de busca após o filtro ser aplicado
    const disableFilterOptions = () => {
        document.getElementById('filtrar').disabled = true;
        document.getElementById('local').disabled = true;
        document.getElementById('modelo').disabled = true;
        document.getElementById('data').disabled = true;
        document.getElementById('profissional').disabled = true;
        document.getElementById('tipo_manutencao').disabled = true;
        buscarButton.disabled = true;
    };

    // Habilita os selects e botão de busca ao limpar o filtro
    const enableFilterOptions = () => {
        document.getElementById('filtrar').disabled = false;
        document.getElementById('local').disabled = false;
        document.getElementById('modelo').disabled = false;
        document.getElementById('data').disabled = false;
        document.getElementById('profissional').disabled = false;
        document.getElementById('tipo_manutencao').disabled = false;
        buscarButton.disabled = false;
    };

    // Event listener para o botão de buscar
    buscarButton.addEventListener('click', () => {
        const filters = getFilters();

        if (Object.values(filters).some(value => value !== null)) {
            fetchManutencao(filters);
            disableFilterOptions();
        } else {
            alert("Por favor, selecione um filtro antes de buscar.");
        }
    });

    // Event listener para o botão de limpar filtro
    refreshButton.addEventListener('click', () => {
        enableFilterOptions();
        location.reload();
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