document.addEventListener('DOMContentLoaded', function () {
    // Redirección al hacer clic en el botón de registro
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function () {
            window.location.href = '../html/register.html'; // Ruta relativa al archivo register.html
        });
    }
});
