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
                <td>
                    <div class="lupaElixeira">
                        <div class="td-lupa">
                            <button class="verMais" 
                                data-lugar="${manutencao.lugar}" 
                                data-modelo="${manutencao.modelo_marca}" 
                                data-data_manutencao="${manutencao.data_manutencao}" 
                                data-nome="${manutencao.nome}">
                                <img src="../../assets/icons/lupa.png" alt="lupa" style="width: 25px;">
                            </button>
                        </div>
                        <div class="td-lupa">
                            <button class="linkExcluir" data-id="${manutencao.id}">
                                <img src="../../assets/icons/lixeira.png" alt="lixeira" style="width: 25px;">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        // Adiciona event listeners para o botão "Ver Mais"
        const verMaisButtons = document.querySelectorAll('.verMais');
        verMaisButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const lugar = event.target.closest('.verMais').getAttribute('data-lugar');
                const modelo = event.target.closest('.verMais').getAttribute('data-modelo');
                const data_manutencao = event.target.closest('.verMais').getAttribute('data-data');
                const nome = event.target.closest('.verMais').getAttribute('data-profissional');

                // Armazena os dados no localStorage
                const detalhesManutencao = { lugar, modelo, data_manutencao, nome };
                localStorage.setItem('detalhesManutencao', JSON.stringify(detalhesManutencao));
                
                // Adicione um console.log para verificar os dados
                console.log('Dados armazenados no localStorage:', detalhesManutencao);

                // Redireciona para a página de detalhes
                window.location.href = '../detalhes/detalhes.html';
            });
        });

        // ... (código para exclusão)
    } catch (error) {
        console.error('Erro ao buscar manutenção:', error);
    }
};

// Chama a função para carregar as manutenções
fetchManuntencao();


// Função para deletar manutenção
const deleteManutencao = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/manutencao/${id}`, {
            method: 'DELETE'
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
            fetchManuntencao(); // Atualiza a lista de manutenções após a exclusão
        } else {
            alert('Erro ao deletar manutenção');
        }
    } catch (error) {
        console.error('Erro ao deletar manutenção:', error);
    }
};



document.addEventListener('DOMContentLoaded', () => {
    const historicList = document.getElementById('historicList');
    const confirmarExcluirDiv = document.querySelector('.confirmar_excluir');
    const mensagemTempora = document.getElementById('mensagemTempora');
    let currentDeleteId = null;
    
    // (Outras funções e lógicas...)
    
    // Adiciona event listener para clicar fora do modal
        document.addEventListener('click', (event) => {
        if (!confirmarExcluirDiv.contains(event.target) && event.target.closest('.linkExcluir')) {
            confirmarExcluirDiv.style.display = 'none'; // Fecha o modal de confirmação
        }
    });
    
});

// Adiciona event listener para clicar fora do modal
document.addEventListener('click', (event) => {
    // Verifica se o clique foi fora do modal e se não foi em um botão de exclusão
    if (!confirmarExcluirDiv.contains(event.target) && event.target.closest('.linkExcluir') === null) {
        confirmarExcluirDiv.style.display = 'none'; // Fecha o modal de confirmação
    }
});

    
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