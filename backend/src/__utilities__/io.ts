import { Server, Socket } from 'socket.io';
import { RestaurantInterface } from '../models/RestaurantInterface';

import http from 'http';
import { app } from './app';
import cors from 'cors';

app.use(cors());

const server = http.createServer(app);

export interface InterfaceSocket extends Socket {
    user?: RestaurantInterface;
}

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3003',
        methods: ['GET']
    }
});

// console.log('hitter', preIo)

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)
})






// export const socketServer = server

// module.exports = { io, socketServer };