document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerButton = document.getElementById('registerButton');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Previene el comportamiento por defecto del formulario

            // Captura los valores de los inputs
            const identifier = document.getElementById('email').value;
            const password = document.getElementById('contrasenia').value;

            // Crea un objeto con los datos de inicio de sesión
            const loginData = { identifier, password };

            // Realiza la petición POST al backend usando fetch
            fetch(`${baseurl}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(function (data) {
                // Obtén el token del usuario desde la respuesta
                const usuarioid = data.token;

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
