"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
exports.io = new socket_io_1.Server(server_1.server, {
    cors: {
        origin: 'http://localhost:3003',
        methods: ['GET']
    }
});
// console.log('hitter', preIo)
exports.io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
});
exports.socketServer = server_1.server;
// module.exports = { io, socketServer };
