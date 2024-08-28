import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { tablemapNsp } from '../../__utilities__/namespace'
import { validateSchema } from '../../__utilities__/validateSchema';
import reservationSchema from './schemas/reservationSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());


router.route('/reservation/')
    .post(authenticateInterface, validateSchema(reservationSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { party_size, reservation_time, guest_name, guest_phone, guest_email, confirmation_status, restaurant_table_id }
                : { party_size: number, reservation_time: Date, guest_name: string, guest_phone: string, guest_email: string, restaurant_id: string, confirmation_status: string | null, restaurant_table_id: string | null, }
                = req.body;


            if (!party_size || !reservation_time || !guest_name || !guest_phone || !guest_email || !confirmation_status) {

                console.log(!party_size, !reservation_time, !guest_name, !guest_phone, !guest_email, !confirmation_status, !restaurant_table_id)
                throw new BadRequestError("Required parameters are missing.");
            };
            // console.log('hit')

            const reservation = new Reservation(party_size, reservation_time, guest_name, null, guest_phone, guest_email, restaurantInterface.restaurant_id, confirmation_status, restaurant_table_id || null);

            await reservation.save();


            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            return res.sendStatus(201);

        } catch (err) {
            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })


// Define the type for the updates
interface ReservationUpdates {
    [key: string]: string | number | null | Date | undefined;
    party_size?: number | string | undefined,
    reservation_time?: Date | undefined,
    guest_name?: string | undefined,
    guest_ip?: string | undefined,
    guest_phone?: string | undefined,
    guest_email?: string | undefined,
    restaurant_table_id?: string | undefined,
    confirmation_status?: string | null | undefined,

};
router.route('/reservation/:reservation_id/')
    .patch(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        console.log('hit')
        try {
            const { reservation_id } = req.params;
            const { party_size, reservation_time, guest_name, guest_ip, guest_phone, guest_email, restaurant_table_id, confirmation_status, }
                : ReservationUpdates
                = req.body;
            const reservation = await Reservation.findById(reservation_id) as Reservation | null;

            if (!reservation) { throw new NotFoundError('Reservation not found') };

            // Prepare the updates object
            const updates: ReservationUpdates = {
                ...(party_size !== undefined && { party_size }),
                ...(reservation_time !== undefined && { reservation_time }),
                ...(guest_name !== undefined && { guest_name }),
                ...(guest_ip !== undefined && { guest_ip }),
                ...(guest_phone !== undefined && { guest_phone }),
                ...(guest_email !== undefined && { guest_email }),
                ...(restaurant_table_id !== undefined && { restaurant_table_id }),
                ...(confirmation_status !== undefined && { confirmation_status })
            };


            // Update the restaurant instance with new values
            Object.keys(updates).forEach(key => {
                reservation[key] = updates[key];
            });

            // Save the updated restaurant back to the database

            await reservation.save();


            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            console.log('pass')
            return res.sendStatus(200);

        } catch (err) {
            console.log(err)
            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })
    .delete(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { reservation_id } = req.params;
            const reservation = await Reservation.findById(reservation_id) as Reservation | null;

            if (!reservation) { throw new NotFoundError('Reservation not found') };

            // Save the updated restaurant back to the database

            await reservation.delete();


            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            return res.sendStatus(200);

        } catch (err) {
            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })


router.route('/reservation/:reservation_id/assign')
    .patch(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { reservation_id } = req.params;
            const { restaurant_table_id }: { restaurant_table_id: string } = req.body;

            const reservation = await Reservation.findById(reservation_id) as Reservation | null;

            if (!reservation) { throw new NotFoundError('Reservation not found') };

            const table = await RestaurantTable.findById(restaurant_table_id) as RestaurantTable | null;
            if (table === null) { throw new BadRequestError('Invalid restaurant_table_id') }

            reservation.restaurant_table_id = table.id as string;
            await reservation.save();

            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            return res.sendStatus(200);
        } catch (err) {
            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })

export default router;