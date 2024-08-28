import jwt from 'jsonwebtoken';
import { secretKey } from '../config';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from './expressError';

import { io, socketServer, InterfaceSocket } from "./io";
import { RestaurantInterface } from "../models/RestaurantInterface";

// console.log('hit', io)


// const nsp = io.of('/namespace');
// nsp.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id} nsp`)
// })


export const tablemapNsp = io.of('/tablemap');
tablemapNsp.use(async (socket: InterfaceSocket, next) => {
    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded = jwt.verify(token, secretKey);

        // Check if decoded is an object and has the 'id' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new UnauthorizedError('Invalid token');
        }


        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Invalid JWT'));
    }
})
tablemapNsp.use(async (socket: InterfaceSocket, next) => {
    try {
        const user = socket.user as RestaurantInterface;
        if (!user.tablemap_permission) { throw new Error() }
        next()
    } catch (err) {
        next(new UnauthorizedError('This interface does not have tablemap permissions'));
    };
});
tablemapNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.id as string);
})

export const tabNsp = io.of('/tab');
tabNsp.use(async (socket: InterfaceSocket, next) => {
    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded = jwt.verify(token, secretKey);

        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new UnauthorizedError('Invalid token');
        }


        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Invalid JWT'));
    }
})
tabNsp.use(async (socket: InterfaceSocket, next) => {
    try {
        const user = socket.user as RestaurantInterface;
        if (!user.tab_permission) { throw new Error() }
        next()
    } catch (err) {
        next(new UnauthorizedError('This interface does not have tab permissions'));
    }
});
tabNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.id as string);
})

export const kitchenNsp = io.of('/kitchenView');
kitchenNsp.use(async (socket: InterfaceSocket, next) => {
    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded = jwt.verify(token, secretKey);

        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new UnauthorizedError('Invalid token');
        }


        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Invalid JWT'));
    }
})
kitchenNsp.use(async (socket: InterfaceSocket, next) => {
    try {
        const user = socket.user as RestaurantInterface;
        if (!user.kitchen_permission) { throw new Error() }
        next()
    } catch (err) {
        next(new UnauthorizedError('This interface does not have kitchen permissions'));
    }
});
kitchenNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.id as string);
})

export const shiftNsp = io.of('/shift');
shiftNsp.use(async (socket: InterfaceSocket, next) => {
    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded = jwt.verify(token, secretKey);
        console.log('hitter')

        // Check if decoded is an object and has the 'id' and 'col' properties
        if (!(typeof decoded === 'object' && decoded.id)) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (token !== user.interface_token) {
            throw new UnauthorizedError('Invalid token');
        }


        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Invalid JWT'));
    }
})
shiftNsp.use(async (socket: InterfaceSocket, next) => {
    try {
        const user = socket.user as RestaurantInterface;
        if (!user.shift_permission) { throw new Error() }
        next()
    } catch (err) {
        next(new UnauthorizedError('This interface does not have shift permissions'));
    }
});
shiftNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.id as string);
})

export const server = socketServer


// module.exports = { tablemapNsp, tabNsp, kitchenNsp, shiftNsp };