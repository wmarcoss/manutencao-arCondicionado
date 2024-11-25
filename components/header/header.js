document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuOptions = document.getElementById("menu-options");

    // Alternar visibilidade ao clicar no botão Menu
    menuButton.addEventListener("click", () => {
        const isHidden = menuOptions.style.display === "none" || menuOptions.style.display === "";
        menuOptions.style.display = isHidden ? "flex" : "none";
    });

    // Fechar menu se clicar fora
    document.addEventListener("click", (event) => {
        if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
            menuOptions.style.display = "none";
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const menuOptions = document.getElementById('menu-options');

    if (menuButton && menuOptions) {
        menuButton.addEventListener('click', () => {
            menuOptions.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
                menuOptions.classList.remove('active');
            }
        });
    }
});

