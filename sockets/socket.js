function socket(io) {
    io.on("connection", (socket) => {
        // io.emit("ayuda", "hola, ¿En que te puedo ayudar?");
        socket.on("nombre", (nombre) => {
            console.log("Hola " + nombre);
            io.emit("saludo", "Hola " + nombre);
        });
    });
}

module.exports= socket;