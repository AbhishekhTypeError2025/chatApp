const commonFunctions = require("../app/utils/utils");

async function setUpSocket(io) {
    io.use(async(socket, next) => {
        const token = socket.handshake.auth.token;
        console.log(token);
        try {
            const result = commonFunctions.decryptJwt(token);
            socket.id = result.userId;
            next();

        } catch (err) {
            console.log("error in socket authentication",err.message);
        }
    })

    io.on("connection", (socket) => {
        console.log("Connection of user -->", socket.id);
        console.log(socket.handshake.auth);
    })
}

module.exports = setUpSocket;