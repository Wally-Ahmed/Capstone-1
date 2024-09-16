import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { io } from '../../__utilities__/app'
import { JSONSchemaType } from 'ajv';
import reservationSchema from './schemas/reservation';
import { validateSchema } from '../../__utilities__/validateSchema';

const router = express.Router();

router.use(express.json());


router.route('/reservation/:restaurant_id')
    .post(authenticateInterface, validateSchema(reservationSchema as JSONSchemaType<any>), async (req: Request, res: Response, next: NextFunction) => {
        const { restaurant_id } = req.params;
        try {
            const { party_size, reservation_time, guest_name, guest_phone, guest_email, restaurant_id, }
                : { party_size: number, reservation_time: Date, guest_name: string, guest_ip: null, guest_phone: string, guest_email: string, restaurant_id: string, }
                = req.body;

            const reservation = new Reservation(party_size, reservation_time, guest_name, null, guest_phone, guest_email, restaurant_id,)

            await reservation.save();


            io.to(restaurant_id as string).emit('new-reservation');

            return res.sendStatus(201);

        } catch (err) {
            io.to(restaurant_id as string).emit('new-reservation');
            next(err);
        };
    })

export default router;