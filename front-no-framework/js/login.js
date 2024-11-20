document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const identifier = document.getElementById('email').value;
            const password = document.getElementById('contrasenia').value;

            const loginData = { identifier, password };

            fetch('http://localhost:3000/api/login/', {
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
                const usuarioid = data.token;
                localStorage.setItem('token', usuarioid);
                window.location.href = 'feed.html';
            })
            .catch(function (error) {
                console.error('Error en el inicio de sesión:', error);
                alert('Inicio de sesión fallido. Verifique sus credenciales.');
            });
        });
    }
});
