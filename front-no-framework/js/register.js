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
                    const response = await axios.post(`${baseurl}/api/usuario/`, registerData, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.status === 200) {
                        console.log('User created successfully');
                        window.location.href = './confirm.html';
                    } else {
                        console.error('Error creando el usuario');
                    }
                } catch (error) {
                    console.error('Error creando el usuario:', error);
                }
            } else {
                alert('Las contraseñas no coinciden.');
            }
        });
    }
});
