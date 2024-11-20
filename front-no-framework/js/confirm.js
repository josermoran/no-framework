document.addEventListener('DOMContentLoaded', async function () {
    const baseurl = 'http://localhost:3000'; // Cambia esto a la URL de tu API

    // Obtener el nombre de usuario desde sessionStorage
    const username = sessionStorage.getItem('username');
    let userId = '';

    if (!username) {
        alert('No se pudo encontrar el usuario. Por favor, regístrate nuevamente.');
        window.location.href = './register.html';
        return;
    }

    // Obtener el usuario por nombre de usuario
    try {
        const response = await fetch(`${baseurl}/api/usuario/miusuario/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error obteniendo el usuario');
        }

        const data = await response.json();
        userId = data.usuario[0]._id;
    } catch (error) {
        console.error('Error obteniendo el usuario:', error);
        alert('Error obteniendo el usuario. Por favor, inténtalo de nuevo.');
    }

    // Manejar la lógica de envío del formulario
    const confirmForm = document.getElementById('confirmForm');
    if (confirmForm) {
        confirmForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const code = document.getElementById('codigo').value;

            try {
                const response = await fetch(`${baseurl}/api/login/${userId}/verify/${code}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Código incorrecto');
                }

                console.log('Código verificado correctamente');
                window.location.href = './feed.js';
            } catch (error) {
                console.error('Error verificando el código:', error);
                alert('Código incorrecto, por favor inténtalo nuevamente.');
            }
        });
    }
});
