document.addEventListener("DOMContentLoaded", function () {
    const baseurl = "http://localhost:3000";

    // Obtener elementos del DOM
    const grupoNameElement = document.querySelector(".grupoName");
    const grupoDescElement = document.querySelector(".grupoDes");
    const publiAmountElement = document.querySelector(".publiNmembernumber");
    const memberAmountElement = document.querySelectorAll(".publiNmembernumber")[1];

    const grupoId = getGrupoIdFromURL();

    // Función para obtener los detalles del grupo desde el backend
    const getGroupDetails = async () => {
        try {
            const response = await fetch(`${baseurl}/api/grupo/${grupoId}`);
            if (!response.ok) {
                throw new Error("Error obteniendo los detalles del grupo");
            }
            const data = await response.json();
            renderGroupDetails(data.Grupo);
        } catch (error) {
            console.error("Error obteniendo los detalles del grupo:", error);
        }
    };

    // Función para obtener las publicaciones del grupo desde el backend
    const getGroupPosts = async () => {
        try {
            const response = await fetch(`${baseurl}/api/post/grupo/${grupoId}`);
            if (!response.ok) {
                throw new Error("Error obteniendo las publicaciones del grupo");
            }
            const data = await response.json();
            renderPostCount(data.posts.length);
            renderPosts(data.posts);
        } catch (error) {
            console.error("Error obteniendo las publicaciones del grupo:", error);
        }
    };

    // Renderizar detalles del grupo en el DOM
    const renderGroupDetails = (grupo) => {
        grupoNameElement.textContent = grupo.NombreGrupo;
        grupoDescElement.textContent = grupo.Descripcion;
        memberAmountElement.textContent = `#${grupo.Integrantes.length}`;
    };

    // Renderizar cantidad de publicaciones en el DOM
    const renderPostCount = (count) => {
        publiAmountElement.textContent = `#${count}`;
    };

    // Renderizar publicaciones del grupo en el DOM
    const renderPosts = (posts) => {
        const postContainer = document.querySelector('.post-container');
        postContainer.innerHTML = '';
        posts.forEach((post) => {
            const postBox = document.createElement('div');
            postBox.className = 'faposition';
            postBox.innerHTML = `
                <h3>${post.titulo}</h3>
                <p>${post.texto}</p>
                <div class="acciones">
                    <img src="/front-no-framework/assets/favorito blend.svg" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost(this)" data-post-id="${post._id}">
                    <img src="/front-no-framework/assets/comment_duotone_line.svg" alt="Comment Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="toggleComments('${post._id}')">
                </div>
            `;
            postContainer.appendChild(postBox);
        });
    };

    // Función para dar like a una publicación
    async function likePost(likeIcon) {
        const postId = likeIcon.getAttribute('data-post-id');

        try {
            // Solicitud POST para dar "like" al post
            const response = await fetch(`${baseurl}/api/feed/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

    // Función para extraer el ID del grupo desde la URL
    function getGrupoIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('grupo');
    }

    // Llamar a las funciones para obtener los datos
    getGroupDetails();
    getGroupPosts();
});

function goBack() {
    window.history.back();
}
