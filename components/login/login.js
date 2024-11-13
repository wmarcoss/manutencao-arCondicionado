// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    // Verifica o tipo do campo de senha e alterna
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../../assets/icons/olhin.png"; // ícone para senha visível
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../../assets/icons/olhin fechado.png"; // ícone para senha oculta
    }
}

// Função para alternar a visibilidade da confirmação de senha
function toggleConfirmPasswordVisibility() {
    const confirmPasswordField = document.getElementById('confirmPassword');
    const eyeIconConfirm = document.getElementById('eye-icon-confirm');
    
    // Verifica o tipo do campo de confirmação de senha e alterna
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        eyeIconConfirm.src = "../../assets/icons/olhin.png"; // ícone para senha visível
    } else {
        confirmPasswordField.type = "password";
        eyeIconConfirm.src = "../../assets/icons/olhin fechado.png"; // ícone para senha oculta
    }
}