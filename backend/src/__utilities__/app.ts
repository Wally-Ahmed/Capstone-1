import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { Server, Socket } from 'socket.io';
import { RestaurantInterface } from '../models/RestaurantInterface';
import http from 'http';
import cors from 'cors'
import restaurantAdminRouter from '../routes/restaurantAdmin/_router';
import restaurantStaffRouter from '../routes/restaurantStaff/_router';
import restaurantInterfaceRouter from '../routes/restaurantInterface/_router';
import restaurantGuestRouter from '../routes/restaurantGuest/_router';
import { ExpressError, UnauthorizedError } from './expressError';
import { adminURL, employeeURL, interfaceURL, secretKey } from '../config';

export const app = express();

const corsOptions = {
    origin: [adminURL.slice(0, -1), employeeURL.slice(0, -1), interfaceURL.slice(0, -1)],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const server = http.createServer(app);

export interface InterfaceSocket extends Socket {
    user?: RestaurantInterface;
}

export const io = new Server(server, {
    cors: {
        origin: interfaceURL.slice(0, -1),
        methods: ['GET', 'POST']
    }
});


// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`)
// })



export const tablemapNsp = io.of('/tablemap');
tablemapNsp.use(async (socket: InterfaceSocket, next) => {

    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded: any = jwt.verify(token, secretKey);


        // Check if decoded is an object and has the 'id' properties
        if (!decoded) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (decoded.code !== user.token_code) {
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
    socket.join(user.restaurant_id as string);
})

export const kitchenNsp = io.of('/kitchen');
kitchenNsp.use(async (socket: InterfaceSocket, next) => {

    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded: any = jwt.verify(token, secretKey);


        // Check if decoded is an object and has the 'id' properties
        if (!decoded) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (decoded.code !== user.token_code) {
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
        next(new UnauthorizedError('This interface does not have tablemap permissions'));
    };
});
kitchenNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.restaurant_id as string);
})

export const shiftNsp = io.of('/shift');
shiftNsp.use(async (socket: InterfaceSocket, next) => {

    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded: any = jwt.verify(token, secretKey);


        // Check if decoded is an object and has the 'id' properties
        if (!decoded) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (decoded.code !== user.token_code) {
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
        next(new UnauthorizedError('This interface does not have tablemap permissions'));
    };
});
shiftNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.restaurant_id as string);
})

export const tabNsp = io.of('/tab');
tabNsp.use(async (socket: InterfaceSocket, next) => {

    const token = socket.handshake.auth.token;
    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


        const decoded: any = jwt.verify(token, secretKey);


        // Check if decoded is an object and has the 'id' properties
        if (!decoded) {
            throw new UnauthorizedError('Invalid token');
        }
        const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
        if (user === null) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        if (decoded.code !== user.token_code) {
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
        next(new UnauthorizedError('This interface does not have tablemap permissions'));
    };
});
tabNsp.on('connection', (socket: InterfaceSocket) => {
    const user = socket.user as RestaurantInterface;
    socket.join(user.restaurant_id as string);
})


app.use('/Admin', restaurantAdminRouter);
app.use('/Staff', restaurantStaffRouter);
app.use('/Interface', restaurantInterfaceRouter);
app.use('/Guest', restaurantGuestRouter);



app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status ? err.status : 500;

    // Construct the error response object manually
    const errorResponse: { status: number, message: string, data?: object } = {
        status: statusCode,
        message: err.message,
        // Include other properties if needed
    };

    if (err.data) {
        errorResponse.data = err.data; // Optionally include additional data if present
    }

    console.log('', errorResponse)

    return res.status(statusCode).json({ error: errorResponse });
});

export { server }