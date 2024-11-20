function verificarCodigo() {
    const codigoIngresado = document.getElementById("codigo").value;
    const mensajeDiv = document.getElementById("mensaje"); 

    
    if (codigoIngresado === "12345") { 
        mensajeDiv.textContent = "¡Código verificado!";
        mensajeDiv.style.color = "green";
    } else {
        mensajeDiv.textContent = "Código incorrecto. Inténtalo de nuevo.";
        mensajeDiv.style.color = "red";
    }
}