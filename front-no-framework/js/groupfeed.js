// groupfeed.js

const baseurl = "http://localhost:3000";

// Obtener elementos del DOM
const groupListContainer = document.getElementById("groupListContainer");

// Función para obtener los grupos desde el backend
const obtenerGrupos = async () => {
  try {
    const response = await fetch(`${baseurl}/api/grupo/`);
    if (!response.ok) {
      throw new Error("Error obteniendo grupos");
    }
    const data = await response.json();
    renderGroups(data.Grupos);
  } catch (error) {
    console.error("Error obteniendo los grupos:", error);
  }
};

// Renderizar grupos
const renderGroups = (grupos) => {
  // Limpiar los grupos actuales
  groupListContainer.innerHTML = "";

  // Renderizar cada grupo
  grupos.forEach((grupo) => {
    const groupContainer = document.createElement("div");
    groupContainer.className = "GPpos";
    groupContainer.onclick = () => groupClick(grupo.NombreGrupo, grupo._id);
    groupContainer.innerHTML = `
      <div class="gname">${grupo.NombreGrupo}</div>
      <div class="gmembers">Miembros: ${grupo.Integrantes.length}</div>
    `;
    groupListContainer.appendChild(groupContainer);
  });
};

// Evento para hacer clic en un grupo
const groupClick = (grupoNombre, grupoId) => {
  alert(`Navegando al grupo: ${grupoNombre}`);
  // Redirigir al detalle del grupo
  window.location.href = `group.html?groupId=${grupoId}`;
};

// Cargar los grupos cuando la página esté lista
document.addEventListener("DOMContentLoaded", obtenerGrupos);
