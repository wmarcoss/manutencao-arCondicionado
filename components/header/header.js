document.addEventListener("DOMContentLoaded", function () {
    const profileImage = document.getElementById('profile');
    const profileOptions = document.getElementById('profileOptions');

    // Alternar visibilidade do menu ao clicar na imagem
    profileImage.addEventListener('click', function (event) {
        event.stopPropagation(); // Impede que o clique feche o menu
        profileOptions.classList.toggle('hidden'); // Mostra ou esconde o menu
    });

    // Adicionar ações ao clicar em cada opção
    profileOptions.addEventListener('click', function (event) {
        const selectedOption = event.target.getAttribute('data-value');

        switch (selectedOption) {
            case 'perfil':
                alert('Abrindo página de perfil...');
                break;
            case 'config':
                alert('Abrindo configurações...');
                break;
            case 'sair':
                alert('Saindo...');
                localStorage.removeItem('token'); // Exemplo: remover token
                window.location.href = '../login/login.html'; // Redirecionar para login
                break;
            default:
                break;
        }

        // Esconder o menu após selecionar uma opção
        profileOptions.classList.add('hidden');
    });

    // Fecha o menu se clicar fora
    document.addEventListener('click', function () {
        profileOptions.classList.add('hidden');
    });
});
