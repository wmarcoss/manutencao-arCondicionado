document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuOptions = document.getElementById("menu-options");
    const logout = document.getElementById("logout"); // Botão de logout

    // Alternar visibilidade ao clicar no botão Menu
    menuButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Impede que o evento suba para o document
        menuOptions.classList.toggle("active"); // Alterna a visibilidade do menu
    });

    // Fechar menu se clicar fora dele
    document.addEventListener("click", (event) => {
        if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
            menuOptions.classList.remove("active"); // Remove a classe "active" se o clique for fora
        }
    });

    // Verificar se o botão de logout está presente
    if (logout) {
        logout.addEventListener("click", (event) => {
            event.preventDefault(); // Impede o comportamento padrão (se houver)

            // Remover o token de autenticação (se armazenado no localStorage ou sessionStorage)
            localStorage.removeItem("token"); // Caso o token esteja no localStorage
            // sessionStorage.removeItem("token"); // Se o token for armazenado no sessionStorage

            // Redirecionar para a página de login
            window.location.href = "login.html"; // Substitua pelo caminho correto da página de login
        });
    } else {
        console.error("Botão de logout não encontrado no header.");
    }
});
