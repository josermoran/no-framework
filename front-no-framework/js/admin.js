
// Obtener el token del almacenamiento local
const token = sessionStorage.getItem('authToken');
if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    window.location.href = '/html/index.html';
}

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

const verificar = async () => {
    if (token) {
        const response = await fetch('/api/usuario/findbytoken/', {headers});
        if (!response.ok) {
            throw new Error('Error obteniendo los datos del administrador');
        }
        const data = await response.json();
        const role = data.usuario.role
        if(!role.includes("sysadmin")){
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = '/html/index.html';
        }
    }
    
}
// Definir headers con el token

// Cargar datos del administrador
const cargarAdministrador = async () => {
    try {
        await verificar()
        const response = await fetch(`/api/usuario/findbyid`, { headers });
        if (!response.ok) {
            throw new Error('Error obteniendo los datos del administrador');
        }
        const data = await response.json();
        document.getElementById('username').textContent = data.usuario.username;
        document.getElementById('userEmail').textContent = `Correo: ${data.usuario.email}`;
    } catch (error) {
        console.error('Error cargando los datos del administrador:', error);
    }
};

// Cargar lista de usuarios
const cargarUsuarios = async () => {
    try {
        const response = await fetch(`${baseurl}/api/usuario/`, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error('Error obteniendo la lista de usuarios');
        }
        const data = await response.json();
        renderizarUsuarios(data.usuarios);
    } catch (error) {
        console.error('Error obteniendo la lista de usuarios:', error);
    }
};

// Renderizar lista de usuarios
const renderizarUsuarios = (usuarios) => {
    const userListContainer = document.getElementById('userListContainer');
    userListContainer.innerHTML = '';
    usuarios.forEach(usuario => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <h3>${usuario.username}</h3>
            <p>Correo: ${usuario.email}</p>
        `;
        userListContainer.appendChild(userItem);
    });
};

// Inicializar la página cargando los datos
window.addEventListener('DOMContentLoaded', () => {
    cargarAdministrador();
    cargarUsuarios();
});
