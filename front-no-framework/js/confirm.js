document.addEventListener('DOMContentLoaded', function () {
    const baseurl = 'http://localhost:3000'; // Cambia esto a la URL de tu API
    const username = new URLSearchParams(window.location.search).get('username');
    let userId = '';

    // Obtener el usuario por nombre de usuario
    const getUser = () => {
        axios.get(`${baseurl}/api/usuario/miusuario/${username}`)
            .then((res) => {
                userId = res.data.usuario[0]._id;
            })
            .catch((error) => {
                console.error('Error obteniendo el usuario:', error);
            });
    };

    getUser();

    // Manejar la lógica de envío del formulario
    window.handleSubmit = (e) => {
        e.preventDefault();
        const code = document.getElementById('codigo').value;
        axios.post(`${baseurl}/api/login/${userId}/verify/${code}`)
            .then(() => {
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('Error verificando el código:', error);
                alert('Código incorrecto, por favor inténtalo nuevamente.');
            });
    };
});
