// feed.js

const baseurl = "http://localhost:3000";

// Obtener elementos del DOM
const crearPostForm = document.querySelector(".crear-post");
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
  posts.forEach((post) => {
    const postContainer = document.createElement("div");
    postContainer.className = "post";
    postContainer.innerHTML = `
      <h4>${post.titulo}</h4>
      <p>${post.texto}</p>
      <button onclick="mostrarComentarios('${post._id}')">Comentar</button>
      <div id="comentarios-${post._id}" class="comentarios"></div>
    `;
    postListContainer.appendChild(postContainer);
  });
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
crearPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.querySelector(".crear-post input").value;
  const texto = document.querySelector(".crear-post textarea").value;

  const postData = {
    titulo,
    texto,
    grupo: null,
    tagscontent: [],
  };

  try {
    const response = await fetch(`${baseurl}/api/post/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Error creando la publicación");
    }

    const newPost = await response.json();
    console.log("Publicación creada:", newPost);
    obtenerPosts();
  } catch (error) {
    console.error("Error creando la publicación:", error);
  }
});

// Cargar las publicaciones cuando la página esté lista
document.addEventListener("DOMContentLoaded", obtenerPosts);
