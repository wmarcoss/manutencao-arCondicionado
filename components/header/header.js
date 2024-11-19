document.addEventListener("DOMContentLoaded", function() {
    // Seleciona a imagem de perfil e o select
    const profileImage = document.getElementById('profile');
    const profileOptions = document.getElementById('profileOptions');

    // Função para alternar a visibilidade do select
    function toggleProfileOptions() {
        // Verifica o estado atual do 'display'
        if (profileOptions.style.display === 'none' || profileOptions.style.display === '') {
            profileOptions.style.display = 'block';  // Exibe o select
        } else {
            profileOptions.style.display = 'none';   // Oculta o select
        }
    }

    // Evento de clique na imagem de perfil
    profileImage.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique se propague para o documento
        toggleProfileOptions();
    });

    // Fecha o select se clicar fora da área da imagem ou do select
    document.addEventListener('click', function(event) {
        if (!profileImage.contains(event.target) && !profileOptions.contains(event.target)) {
            profileOptions.style.display = 'none';  // Oculta o select se clicar fora
        }
    });
});
