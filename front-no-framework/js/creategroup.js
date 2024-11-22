// creategroup.js

const generalCheckbox = document.getElementById("generalCheckbox");
const privCheckbox = document.getElementById("privCheckbox");
const createGroupForm = document.getElementById("createGroupForm");
const nombreGrupoInput = document.getElementById("nombreGrupo");
const descripcionInput = document.getElementById("descripcionGrupo");

let token = sessionStorage.getItem("authToken");
if (!token) {
    alert("No estás autenticado. Por favor, inicia sesión.");
    window.location.href = "login.html";
}

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Obtener las empresas disponibles
const GetGroup = async () => {
    try {
        const response = await fetch(`/api/empresa/`, { headers });
        if (!response.ok) {
            throw new Error("Error obteniendo las empresas");
        }
        const data = await response.json();
        const empresas = data.Empresa;
        empresas.forEach(empresa => {
            const option = document.createElement("option");
            option.value = empresa._id;
            option.textContent = empresa.Nombre;
            empresaSelector.appendChild(option);
        });
    } catch (error) {
        console.error("Error obteniendo las empresas:", error);
    }
};

// Manejar el cambio de tipo de grupo


// Manejar el cierre del formulario
function handleClose() {
    window.location.href = 'feed.html';
}

// Manejar la creación de un grupo
createGroupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreGrupoInput.value;
    const descripcion = descripcionInput.value;
    const priv = privCheckbox.checked;

    if (!nombre || !descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const GroupData = {
        NombreGrupo: nombre,
        Empresa: null,
        Descripcion: descripcion,
        grupoEmpresarial: null,
        priv: priv
    };

    try {
        const response = await fetch(`/api/grupo/save`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(GroupData)
        });

        if (!response.ok) {
            throw new Error("Error creando el grupo");
        }

        const newGroup = await response.json();
        console.log("Grupo creado:", newGroup);
        window.location.href = 'groupfeed.html';
    } catch (error) {
        console.error("Error creando el grupo:", error);
        alert("Error al crear el grupo. Por favor, inténtelo de nuevo.");
    }
});

// Cargar las empresas cuando la página esté lista
document.addEventListener("DOMContentLoaded", GetGroup);
