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

function editarPerfil() {
    alert('Editar perfil en desarrollo...');
}

function editarPost(postId) {
    const postBox = document.querySelector(`[data-post-id='${postId}']`).closest('.postbox');
    const currentTitle = postBox.querySelector('h3').textContent;
    const currentText = postBox.querySelector('p').textContent;

    // Cambiar el contenido del post a un formulario de edición
    postBox.innerHTML = `
        <input type="text" id="edit-title-${postId}" value="${currentTitle}" style="width: 100%; margin-bottom: 10px;">
        <textarea id="edit-text-${postId}" style="width: 100%; height: 100px;">${currentText}</textarea>
        <button onclick="guardarPost('${postId}')">Guardar</button>
        <button onclick="cancelarEdicion('${postId}', '${currentTitle}', '${currentText}')">Cancelar</button>
    `;
}

function cancelarEdicion(postId, title, text) {
    const postBox = document.querySelector(`[data-post-id='${postId}']`).closest('.postbox');
    postBox.innerHTML = `
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="acciones">
            <img src="/front-no-framework/assets/favorito blend.svg" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost(this)" data-post-id="${postId}">
            <img src="/front-no-framework/assets/comment_duotone_line.svg" alt="Comment Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="toggleComments('${postId}')">
            <img src="/front-no-framework/assets/trash.svg" alt="Eliminar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="eliminarPost('${postId}')">
            <img src="/front-no-framework/assets/edit.svg" alt="Editar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="editarPost('${postId}')">
        </div>
        <div id="comments-${postId}" style="display: none;">
        </div>
    `;
}

async function guardarPost(postId) {
    const editedTitle = document.getElementById(`edit-title-${postId}`).value;
    const editedText = document.getElementById(`edit-text-${postId}`).value;

    try {
        // Solicitud POST para guardar los cambios del post
        const response = await fetch(`${baseurl}/api/post/${postId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ titulo: editedTitle, texto: editedText })
        });

        if (!response.ok) {
            throw new Error('Error guardando los cambios del post');
        }

        // Actualizar el contenido del post en el DOM
        const postBox = document.querySelector(`[data-post-id='${postId}']`).closest('.postbox');
        postBox.innerHTML = `
            <h3>${editedTitle}</h3>
            <p>${editedText}</p>
            <div class="acciones">
                <img src="../assets/favorito blend.svg" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost(this)" data-post-id="${postId}">
                <img src="../assets/comment_duotone_line.svg" alt="Comment Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="toggleComments('${postId}')">
                <img src="../assets/trash.svg" alt="Eliminar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="eliminarPost('${postId}')">
                <img src="../assets/edit.svg" alt="Editar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="editarPost('${postId}')">
            </div>
            <div id="comments-${postId}" style="display: none;">
            </div>
        `;
    } catch (error) {
        console.error('Error al guardar los cambios del post:', error);
    }
}

async function eliminarPost(postId) {
    try {
        const response = await fetch(`${baseurl}/api/post/${postId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error eliminando el post');
        }

        // Remover el post del DOM
        document.querySelector(`[data-post-id='${postId}']`).closest('.postbox').remove();
        alert('Publicación eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar el post:', error);
    }
}

async function likePost(likeIcon) {
    const postId = likeIcon.getAttribute('data-post-id');

    try {
        // Solicitud POST para dar "like" al post
        const response = await fetch(`${baseurl}/api/feed/${postId}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ action: 'like' })
        });

        if (!response.ok) {
            throw new Error('Error dando like al post');
        }

        // Cambiar el color del ícono de "like"
        likeIcon.style.filter = "hue-rotate(150deg)"; // Cambia el color para simular que se dio like
    } catch (error) {
        console.error('Error al dar like:', error);
    }
}

// Cargar datos del usuario
const cargarUsuario = async () => {
    try {
        const response = await fetch(`${baseurl}/api/usuario/findbyid`, { headers });
        if (!response.ok) {
            throw new Error('Error obteniendo los datos del usuario');
        }
        const data = await response.json();
        const message = data?.usuario?.empresa?.Nombre ? `Trabaja en ${data.usuario.empresa.Nombre}` : "";
        document.getElementById('username').textContent = data.usuario.username;
        document.getElementById('userCompany').textContent = message;
    } catch (error) {
        console.error('Error cargando los datos del usuario:', error);
    }
};

// Cargar publicaciones del usuario
const cargarPublicaciones = async () => {
    try {
        const response = await fetch(`${baseurl}/api/post/findbyuser/`, { method: 'PATCH', headers });
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
    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = '';
    posts.forEach((post) => {
        const postBox = document.createElement('div');
        postBox.className = 'postbox';
        postBox.setAttribute('data-post-id', post._id);
        postBox.innerHTML = `
            <h3>${post.titulo}</h3>
            <p>${post.texto}</p>
            <div class="acciones">
                <img src="../assets/favorito blend.svg" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost(this)" data-post-id="${post._id}">
                <img src="../assets/comment_duotone_line.svg" alt="Comment Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="toggleComments('${post._id}')">
                <img src="../assets/trash.svg" alt="Eliminar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="eliminarPost('${post._id}')">
                <img src="../assets/edit.svg" alt="Editar Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="editarPost('${post._id}')">
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
