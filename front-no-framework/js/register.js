document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password === confirmPassword) {
                const registerData = { email, username, password };

                try {
                    const response = await fetch('/api/usuario/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(registerData),
                    });

                    if (!response.ok) {
                        throw new Error('Error creando el usuario');
                    }

                    console.log('Usuario creado exitosamente');
                    // Guardar el nombre de usuario en sessionStorage para usarlo luego en confirm.html
                    sessionStorage.setItem('username', username);
                    window.location.href = '/html/feed.html';
                } catch (error) {
                    console.error('Error creando el usuario:', error);
                    alert('Error al crear el usuario. Por favor, inténtelo de nuevo.');
                }
            } else {
                alert('Las contraseñas no coinciden.');
            }
        });
    }
});
