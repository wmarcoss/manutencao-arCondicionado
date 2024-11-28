document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuOptions = document.getElementById("menu-options");
    const logout = document.getElementById("logout");

    // Exibir nome e e-mail do localStorage no menu
    const nome = localStorage.getItem("nomeUser");  // Usando nomeUser para acessar o nome
    const email = localStorage.getItem("email");

    // Verificar se o nome foi encontrado e exibir
    const nomeElement = document.getElementById("nomeUser");  // ID alterado para nomeUser
    if (nome && nomeElement) {
        const primeiroNome = nome.split(" ")[0]; // Obtém o primeiro nome
        nomeElement.textContent = `Nome: ${primeiroNome}`;
    } else if (nomeElement) {
        nomeElement.textContent = "Nome: Não disponível";
    }

    // Verificar se o e-mail foi encontrado e exibir
    const emailElement = document.getElementById("email");
    if (email && emailElement) {
        emailElement.textContent = `E-mail: ${email}`;
    } else if (emailElement) {
        emailElement.textContent = "E-mail: Não disponível";
    }

    // Alternar visibilidade do menu ao clicar no botão
    menuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        menuOptions.classList.toggle("active");
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (event) => {
        if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
            menuOptions.classList.remove("active");
        }
    });

    // Logout: remover informações do localStorage
    if (logout) {
        logout.addEventListener("click", (event) => {
            event.preventDefault();
            // Remover as informações do localStorage
            localStorage.removeItem("token");     // Remover o token
            localStorage.removeItem("nomeUser");  // Remover o nomeUser
            localStorage.removeItem("email");     // Remover o e-mail
            window.location.href = "login.html";   // Redirecionar para a página de login
        });
    } else {
        console.error("Botão de logout não encontrado no header.");
    }    
});