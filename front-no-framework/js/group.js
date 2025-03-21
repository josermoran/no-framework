document.addEventListener("DOMContentLoaded", function () {

    // Obtener elementos del DOM
    const grupoNameElement = document.querySelector(".grupoName");
    const grupoDescElement = document.querySelector(".grupoDes");
    const publiAmountElement = document.querySelector(".publiNmembernumber");
    const memberAmountElement = document.querySelectorAll(".publiNmembernumber")[1];
    const publicarBtn = document.getElementById("publicarBtn");
    const token = sessionStorage.getItem('authToken'); 

    const grupoId = getGrupoIdFromURL();

    // Función para obtener los detalles del grupo desde el backend
    const getGroupDetails = async () => {
        try {
            const response = await fetch(`/api/grupo/${grupoId}`);
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
            const response = await fetch(`/api/post/grupo/${grupoId}`, { method: 'GET' });
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
            postBox.setAttribute('data-post-id', post._id);
            postBox.setAttribute('data-liked', post.likes.includes(sessionStorage.getItem('authToken')) ? 'true' : 'false');
            postBox.innerHTML = `
                <h3>${post.titulo}</h3>
                <p>${post.texto}</p>
                <div class="tags">
                    ${post.tags.content?.map(tag => `<span class="tag">#${tag}</span>`).join('') || ''}
                </div>
                <div class="acciones">
                    <img src="${post.likes.includes(sessionStorage.getItem('authToken')) ? '../assets/corazon.png' : '../assets/favorito blend.svg'}" alt="Like Icon" style="width: 20px; height: 20px; cursor: pointer;" onclick="likePost(this)" data-post-id="${post._id}" data-liked="${post.likes.includes(sessionStorage.getItem('authToken'))}">
                </div>
            `;
            postContainer.appendChild(postBox);
        });
    };

    
    

    // Función para dar like a una publicación
    async function likePost(likeIcon) {
        const postId = likeIcon.getAttribute('data-post-id');
        const liked = likeIcon.getAttribute('data-liked') === 'true';

        try {
            // Solicitud POST para dar "like" o "unlike" al post
            const response = await fetch(`/api/feed/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ action: liked ? 'unlike' : 'like' })
            });

            if (!response.ok) {
                throw new Error('Error dando like al post');
            }

            // Cambiar el ícono de "like" y actualizar el estado
            likeIcon.src = liked ? '../assets/favorito blend.svg' : '../assets/corazon.png';
            likeIcon.setAttribute('data-liked', liked ? 'false' : 'true');
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    }

    // Función para extraer el ID del grupo desde la URL
    function getGrupoIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('groupId');
    }

    publicarBtn.addEventListener("click", async (e) => {
        e.preventDefault();
    
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
    
        const titulo = document.getElementById("new-post-title").value;
        const texto = document.getElementById("new-post-text").value;
        const tag1 = document.getElementById("tag1").value;
        const tag2 = document.getElementById("tag2").value;
        const tag3 = document.getElementById("tag3").value;
        const tag4 = document.getElementById("tag4").value;
        const tagscontent = [tag1, tag2, tag3, tag4].filter(tag => tag.trim() !== "");
    
        if (!titulo || !texto) {
          alert("Por favor, completa todos los campos antes de publicar.");
          return;
        }
    
        const postData = {
          titulo,
          texto,
          grupo: grupoId,
          tagscontent: tagscontent
        };
    
        try {
          const response = await fetch(`/api/post/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
          });
    
          if (!response.ok) {
            throw new Error("Error creando la publicación");
          }
    
          const newPost = await response.json();
    
          // Añadir la nueva publicación directamente al DOM
          renderPosts(newPost);
    
          // Alternativamente, puedes volver a obtener todas las publicaciones:
          // obtenerPosts();
        } catch (error) {
          console.error("Error creando la publicación:", error);
        }
    
        // Limpiar los campos del formulario
        document.getElementById("tituloPost").value = "";
        document.getElementById("contenidoPost").value = "";
        document.getElementById("tag1").value = "";
        document.getElementById("tag2").value = "";
        document.getElementById("tag3").value = "";
      });

    // Llamar a las funciones para obtener los datos
    getGroupDetails();
    getGroupPosts();
});

function goBack() {
    window.history.back();
}
