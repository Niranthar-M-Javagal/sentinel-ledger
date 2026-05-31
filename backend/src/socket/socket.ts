import { Server } from "socket.io";

let io: Server;

export function initializeSocket(server: any) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }

    return io;
}