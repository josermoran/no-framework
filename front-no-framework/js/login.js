document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerButton = document.getElementById('registerButton');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Previene el comportamiento por defecto del formulario

            // Captura los valores de los inputs
            const identifier = document.getElementById('email').value;
            const password = document.getElementById('contrasenia').value;

            // Realiza la petición POST al backend usando Axios
            axios.post(`${baseurl}/api/login/`, { identifier, password })
                .then(function (response) {
                    // Obtén el token del usuario desde la respuesta
                    const usuarioid = response.data.token;

                    // Almacena el token en localStorage y redirige
                    localStorage.setItem('token', usuarioid);
                    window.location.href = 'feed.html';
                })
                .catch(function (error) {
                    // Maneja el error en caso de credenciales incorrectas o error en el servidor
                    console.error('Error en el inicio de sesión:', error);
                    alert('Inicio de sesión fallido. Verifique sus credenciales.');
                });
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function () {
            window.location.href = 'register.html';
        });
    }
});
