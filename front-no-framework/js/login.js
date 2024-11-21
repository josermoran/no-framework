document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            // Captura los valores de los inputs del formulario
            const identifier = document.getElementById('email').value;
            const password = document.getElementById('contrasenia').value;

            // Crea el objeto con los datos de inicio de sesión
            const loginData = { identifier, password };

            // Realiza la petición POST al backend usando fetch
            fetch('/api/login/', {
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
                // Obtiene el token de usuario desde la respuesta
                const token = data.token;

                if (token) {
                    // Almacena el token en localStorage para futuras peticiones
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('authToken', token);
                    // Redirige al usuario al feed principal
                    window.location.href = 'html/feed.html';
                } else {
                    throw new Error('Token no encontrado en la respuesta del servidor');
                }
            })
            .catch(function (error) {
                console.error('Error en el inicio de sesión:', error);
                alert('Inicio de sesión fallido. Verifique sus credenciales.');
            });
        });
    }
});
