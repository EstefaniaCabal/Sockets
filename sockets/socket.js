function socket(io) {
    let historialChat = [];

    io.on("connection", (socket) => {
        socket.emit("saludo", "Hola, soy un chatbot de recomendaciones literarias. ¿Cuál es tu nombre?");

        let nombreUsuario = "";
        let esperandoGenero = false;
        let esperandoDetalle = false; // Para esperar si si se quiere detashe de algún libro
        let ultimasRecomendaciones = []; // Para guardar las últimas recomendaciones y poder dar los DETASHITOSss

        socket.on("mensaje", (mensaje) => {
            historialChat.push({ usuario: nombreUsuario || 'Cliente', mensaje });

            var respuesta;
            if (!nombreUsuario) {
                nombreUsuario = mensaje;
                respuesta = `Hola ${nombreUsuario}, ¿te gustaría una recomendación de libro? Si es así, por favor di 'si'.`;
            } else if (mensaje.toLowerCase() === "si" && !esperandoGenero && !esperandoDetalle) {
                esperandoGenero = true;
                respuesta = "Genial, ¿de qué género literario te gustaría recibir recomendaciones? (Romance, Fantasía, Suspenso)";
            } else if (esperandoGenero) {
                esperandoGenero = false;
                esperandoDetalle = true; // Ahora esperamos ver si quieren detalles
                switch (mensaje.toLowerCase()) {
                    case "romance":
                        ultimasRecomendaciones = ["Orgullo y Prejuicio", "Deja que fluya", "Yo antes de ti"];
                        respuesta = "Para 'Romance', te recomiendo: 1. Orgullo y Prejuicio, 2. Deja que fluya, 3. Yo antes de ti. ¿Quieres aclaraciones de alguno?";
                        break;
                    case "fantasía":
                        ultimasRecomendaciones = ["El principe cruel", "Harry Potter", "Percy Jackson"];
                        respuesta = "Para 'Fantasía', te recomiendo: 1. El principe cruel, 2. Harry Potter, 3. Percy Jackson. ¿Quieres aclaraciones de alguno?";
                        break;
                    case "suspenso":
                        ultimasRecomendaciones = ["La chica del tren", "Fuego cruzado", "El psicoanalista"];
                        respuesta = "Para 'Suspenso', te recomiendo: 1. La chica del tren, 2. Fuego cruzado, 3. El psicoanalista. ¿Quieres aclaraciones de alguno?";
                        break;
                    default:
                        respuesta = "Lo siento, no tengo recomendaciones para ese género. ¿Puedes elegir entre Romance, Fantasía o Suspenso?";
                        esperandoGenero = true;
                        esperandoDetalle = false;
                        break;
                }
            } else if (esperandoDetalle) {
                if (mensaje.toLowerCase() === "no") {
                    esperandoDetalle = false; // Si no quieren detalles, continuamos con la programación habitual
                    respuesta = "Entendido. Si tienes otra pregunta o necesitas más recomendaciones, házmelo saber. ¿Quieres continuar?";
                } else {
                    const libroSeleccionado = parseInt(mensaje) - 1;
                    if (libroSeleccionado >= 0 && libroSeleccionado < ultimasRecomendaciones.length) {
                        respuesta = `'${ultimasRecomendaciones[libroSeleccionado]}': [Supongamos que aqui va una reseña]. ¿Quieres continuar o saber más sobre otro libro?`;
                    } else {
                        respuesta = "No entendí tu selección. Por favor, indica el número del libro del cual quieres saber más o di 'no' si no quieres detalles.";
                    }
                }
            } else {
                respuesta = "No estoy seguro de cómo responder a eso. ¿Te gustaría una recomendación de algún libro? Si es así, escribe 'si'.";
            }

            historialChat.push({ usuario: 'ChatBot', mensaje: respuesta });
            socket.emit("respuesta", { respuesta });
            io.emit("historial", historialChat);
        });
    });
}

module.exports = socket;
