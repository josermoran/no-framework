document.addEventListener("DOMContentLoaded", function () {
  const baseurl = "http://localhost:3000";

  // Obtener elementos del DOM
  const publicarBtn = document.getElementById("publicarBtn");
  const postListContainer = document.querySelector(".content");
  const sidebarLinks = document.querySelectorAll(".sidebarposition a");

  // Evento para manejar la navegación
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      window.location.href = href;
    });
  });

  // Función para obtener los posts desde el backend
  const obtenerPosts = async () => {
    try {
      const response = await fetch(`${baseurl}/api/feed/`);
      if (!response.ok) {
        throw new Error("Error obteniendo publicaciones");
      }
      const data = await response.json();
      renderPosts(data.posts);
    } catch (error) {
      console.error("Error obteniendo las publicaciones:", error);
    }
  };

  // Renderizar posts
  const renderPosts = (posts) => {
    // Limpiar las publicaciones actuales
    const existingPosts = document.querySelectorAll(".post");
    existingPosts.forEach((post) => post.remove());

    // Renderizar cada publicación
    posts.forEach((post) => {
      addPostToDOM(post);
    });
  };

  // Añadir un post al DOM
  const addPostToDOM = (post) => {
    const postContainer = document.createElement("div");
    postContainer.className = "post";
    postContainer.innerHTML = `
      <h4>${post.titulo}</h4>
      <p>${post.texto}</p>
      <div class="tags">
        ${post.tagscontent.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
      <button onclick="mostrarComentarios('${post._id}')">Comentar</button>
      <div id="comentarios-${post._id}" class="comentarios"></div>
    `;
    postListContainer.appendChild(postContainer);
  };

  // Mostrar comentarios
  const mostrarComentarios = async (postId) => {
    try {
      const response = await fetch(`${baseurl}/api/post/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Error obteniendo comentarios");
      }
      const data = await response.json();
      renderComments(data.comments, postId);
    } catch (error) {
      console.error("Error obteniendo los comentarios:", error);
    }
  };

  // Renderizar comentarios
  const renderComments = (comments, postId) => {
    const comentariosContainer = document.getElementById(`comentarios-${postId}`);
    comentariosContainer.innerHTML = "";
    comments.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "commentpos";
      commentDiv.innerHTML = `
        <div class="commentbck"></div>
        <div class="useIconPoscomment">
          <img class="usericoncomment" src="../assets/User_duotone_line-1.svg" />
        </div>
        <div class="usernamecomment">${comment.user.username}</div>
        <div class="usercomment">${comment.content}</div>
      `;
      comentariosContainer.appendChild(commentDiv);
    });
  };

  // Evento para crear un nuevo post
  publicarBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('authToken'); 
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const titulo = document.getElementById("tituloPost").value;
    const texto = document.getElementById("contenidoPost").value;
    const tag1 = document.getElementById("tag1").value;
    const tag2 = document.getElementById("tag2").value;
    const tag3 = document.getElementById("tag3").value;

    const tagscontent = [tag1, tag2, tag3].filter(tag => tag.trim() !== "");

    if (!titulo || !texto) {
      alert("Por favor, completa todos los campos antes de publicar.");
      return;
    }

    const postData = {
      titulo,
      texto,
      grupo: null,
      tagscontent,
    };

    try {
      const response = await fetch(`${baseurl}/api/post/`, {
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
      addPostToDOM(newPost);

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

  // Cargar las publicaciones cuando la página esté lista
  obtenerPosts();
});
