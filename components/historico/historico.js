// Mostrar o segundo select quando uma opção específica é selecionada no primeiro select
document.getElementById('filtrar').addEventListener('change', function() {
    let local = document.getElementById('local');

    if (this.value === 'mostrarLocal') {
        local.style.display = 'inline';
    } else {
        local.style.display = 'none';
    }
});

// Mostrar o segundo select quando uma opção específica é selecionada no primeiro select
document.getElementById('filtrar').addEventListener('change', function() {
    let modelo = document.getElementById('modelo');

    if (this.value === 'mostrarModelo') {
        modelo.style.display = 'inline';
    } else {
        modelo.style.display = 'none';
    }
});

// Mostrar o segundo select quando uma opção específica é selecionada no primeiro select
document.getElementById('filtrar').addEventListener('change', function() {
    let data = document.getElementById('data');

    if (this.value === 'mostrarData') {
        data.style.display = 'inline';
    } else {
        data.style.display = 'none';
    }
});

// Mostrar o segundo select quando uma opção específica é selecionada no primeiro select
document.getElementById('filtrar').addEventListener('change', function() {
    let profissional = document.getElementById('profissional');

    if (this.value === 'mostrarProfissional') {
        profissional.style.display = 'inline';
    } else {
        profissional.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões com a classe 'linkExcluir'
    const linkExcluirButtons = document.querySelectorAll('.linkExcluir');

    // Seleciona a div que deve ser exibida
    const confirmarExcluirDiv = document.querySelector('.confirmar_excluir');

    // Função para exibir a div de confirmação
    function mostrarConfirmacao() {
        confirmarExcluirDiv.style.display = 'block';
    }

    // Adiciona um evento de clique a cada botão com a classe 'linkExcluir'
    linkExcluirButtons.forEach(button => {
        button.addEventListener('click', mostrarConfirmacao);
    });

    // Adiciona funcionalidade aos botões de confirmação e fechamento
    const checkButton = document.getElementById('check');
    const closeButton = document.getElementById('close');

    // Função para esconder a div de confirmação
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