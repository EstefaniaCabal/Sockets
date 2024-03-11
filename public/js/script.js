const socket = io();

socket.on("saludo", (mensaje) => {
    agregarAlHistorial("ChatBot", mensaje);
});

var enviarDatos = document.getElementById("enviarDatos");
enviarDatos.addEventListener("submit", (e) => {
    e.preventDefault();
    var mensaje = document.getElementById("mensaje").value;
    // Agrega el mensaje del usuario al historial antes de enviarlo
    agregarAlHistorial("Tú", mensaje);
    socket.emit("mensaje", mensaje);
    document.getElementById("mensaje").value = "";
});

socket.on("respuesta", ({ respuesta }) => {
    agregarAlHistorial("ChatBot", respuesta);
});

// Esta función añade mensajes al historial
function agregarAlHistorial(usuario, mensaje) {
    var historialHTML = document.getElementById("historial-chat").innerHTML;
    historialHTML += `<div>${usuario}: ${mensaje}</div>`;
    document.getElementById("historial-chat").innerHTML = historialHTML;
}
