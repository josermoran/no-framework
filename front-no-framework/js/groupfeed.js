// groupfeed.js
const baseurl = "http://192.168.1.210:3000";

// Obtener elementos del DOM
const groupListContainer = document.getElementById("groupList");

// Función para obtener los grupos desde el backend
const obtenerGrupos = async () => {
  try {
    const response = await fetch(`${baseurl}/api/grupo/`);
    if (!response.ok) {
      throw new Error("Error obteniendo grupos");
    }
    const data = await response.json();
    renderGrupos(data.Grupos);
  } catch (error) {
    console.error("Error obteniendo los grupos:", error);
  }
};

// Renderizar grupos
const renderGrupos = (grupos) => {
  // Limpiar los grupos actuales
  groupListContainer.innerHTML = "";

  // Renderizar cada grupo
  grupos.forEach((grupo) => {
    const groupContainer = document.createElement("div");
    groupContainer.className = "GPpos";
    groupContainer.innerHTML = `
      <div class="gname">${grupo.NombreGrupo}</div>
      <div class="gmembers">Miembros: ${grupo.Integrantes.length}</div>
    `;
    groupContainer.addEventListener("click", () => {
      navegarAlGrupo(grupo._id);
    });
    groupListContainer.appendChild(groupContainer);
  });
};

// Navegar al grupo específico
const navegarAlGrupo = (grupoId) => {
  window.location.href = `group.html?groupId=${grupoId}`;
};

// Cargar los grupos cuando la página esté lista
document.addEventListener("DOMContentLoaded", obtenerGrupos);
