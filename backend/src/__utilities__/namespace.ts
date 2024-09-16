// import jwt from 'jsonwebtoken';
// import { secretKey } from '../config';

// import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from './expressError';

// import { io, InterfaceSocket } from "./app";
// import { RestaurantInterface } from "../models/RestaurantInterface";
// import { ExtendedError } from 'socket.io/dist/namespace';

// export const tablemapNsp = io.of('/tablemap');


// const nspAuthenticate = async (socket: InterfaceSocket, next: (err?: ExtendedError) => void) => {

//     const token = socket.handshake.auth.token;
//     try {
//         if (!token) { throw new UnauthorizedError('No token provided') };
//         const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
//         if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };


//         const decoded: any = jwt.verify(token, secretKey);


//         // Check if decoded is an object and has the 'id' properties
//         if (!decoded) {
//             throw new UnauthorizedError('Invalid token');
//         }
//         const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
//         if (user === null) {
//             throw new UnauthorizedError('Invalid or expired token');
//         }
//         if (decoded.code !== user.token_code) {
//             throw new UnauthorizedError('Invalid token');
//         }

//         socket.user = user;
//         next();
//     } catch (err) {
//         next(new Error('Invalid JWT'));
//     }
// }
// const nspVerifyPermission = async (socket: InterfaceSocket, next: (err?: ExtendedError) => void) => {
//     try {
//         const user = socket.user as RestaurantInterface;
//         if (!user.tablemap_permission) { throw new Error() }
//         next()
//     } catch (err) {
//         next(new UnauthorizedError('This interface does not have tablemap permissions'));
//     };
// };
// tablemapNsp.on('connection', (socket: InterfaceSocket) => {
//     const user = socket.user as RestaurantInterface;
//     socket.join(user.restaurant_id as string);
// })