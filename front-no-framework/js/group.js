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
