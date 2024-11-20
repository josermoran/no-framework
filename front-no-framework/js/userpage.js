// userpage.js

const baseurl = "http://localhost:3000";

// Obtener el token del almacenamiento local
const token = sessionStorage.getItem('authToken');
if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    window.location.href = 'login.html';
}

// Definir headers con el token
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Cargar datos del usuario
const cargarUsuario = async () => {
    try {
        const response = await fetch(`${baseurl}/api/usuario/findbyid`, { headers });
        if (!response.ok) {
            throw new Error('Error obteniendo los datos del usuario');
        }
        const data = await response.json();
        document.getElementById('username').textContent = data.usuario.username;
        document.getElementById('userCompany').textContent = `Trabaja en ${data.usuario.empresa.Nombre}`;
    } catch (error) {
        console.error('Error cargando los datos del usuario:', error);
    }
};

// Cargar publicaciones del usuario
const cargarPublicaciones = async () => {
    try {
        const response = await fetch(`${baseurl}/api/feed/user`, { headers });
        if (!response.ok) {
            throw new Error('Error obteniendo publicaciones del usuario');
        }
        const data = await response.json();
        renderizarPublicaciones(data.posts);
    } catch (error) {
        console.error('Error obteniendo las publicaciones:', error);
    }
};

// Renderizar publicaciones
const renderizarPublicaciones = (posts) => {
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = '';
    posts.forEach((post) => {
        const postBox = document.createElement('div');
        postBox.className = 'postbox';
        postBox.innerHTML = `
            <h3>${post.titulo}</h3>
            <p>${post.texto}</p>
            <div class="acciones">
                <img src="/front-no-framework/assets/favorito blend.svg" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost('${post._id}')">
                <img src="/front-no-framework/assets/comment_duotone_line.svg" alt="Comment Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="toggleComments('${post._id}')">
            </div>
            <div id="comments-${post._id}" style="display: none;">
                ${post.comments.map(comment => `<p>${comment.user.username}: ${comment.content}</p>`).join('')}
            </div>
        `;
        postContainer.appendChild(postBox);
    });
};

// Inicializar la página cargando los datos
window.addEventListener('DOMContentLoaded', () => {
    cargarUsuario();
    cargarPublicaciones();
});
