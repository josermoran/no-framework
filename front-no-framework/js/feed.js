document.addEventListener("DOMContentLoaded", function () {

  // Obtener elementos del DOM
  const token = sessionStorage.getItem('authToken'); 
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
        if(role.includes("sysadmin")){
          addSidebarLink('Admin', '/html/admin.html');
        }
        
    }
    
}
  // Función para obtener los posts desde el backend
  const obtenerPosts = async () => {
    try {
      const response = await fetch(`/api/feed/`);
      if (!response.ok) {
        throw new Error("Error obteniendo publicaciones");
      }
      const data = await response.json();
      console.log(data.posts)
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
        ${post.tags[0].content.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
      <div id="comentarios-${post._id}" class="comentarios"></div>
    `;
    postListContainer.appendChild(postContainer);
  };

  function addSidebarLink(text, href) {
    // Get the sidebar div
    const sidebar = document.querySelector('.sidebarposition');

    // Create a new <a> element
    const newLink = document.createElement('a');
    newLink.href = href; // Set the href attribute
    newLink.textContent = text; // Set the text of the link

    // Append the new link to the sidebar
    sidebar.appendChild(newLink);
}

  // Evento para crear un nuevo post
  publicarBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const titulo = document.getElementById("tituloPost").value;
    const texto = document.getElementById("contenidoPost").value;
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
      grupo: null,
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
  verificar();
});
