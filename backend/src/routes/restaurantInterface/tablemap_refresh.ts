import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';


const router = express.Router();

router.use(express.json());


router.route('/layout')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        // console.log('hit')
        try {
            const { restaurantInterface } = req;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            if (restaurant.active_layout_id === null) { return res.status(200).json({ layout: null }) };


            const layout = await Layout.findById(restaurant.active_layout_id) as Layout | null;
            if (!layout) { return res.status(200).json({ layout: null }) };

            // console.log(layout, 'ghittt')

            const fullLayout = await layout.getFullLayout();

            return res.status(200).json({ layout: fullLayout });
        } catch (err) {
            next(err);
        };
    })

router.route('/reservation')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        try {


            const { restaurantInterface } = req;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const reservations = await restaurant.getReservations();

            return res.status(200).json({ reservations, reservationDuration: restaurant.reservation_duration_minutes });
        } catch (err) {
            next(err);
        };
    })

// router.route('/reservation/:section_id')
// .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
//     try {

//         const { restaurantInterface } = req;
//         if (restaurantInterface === undefined) { throw new UnauthorizedError() };
//         const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
//         if (restaurant === null) { throw new UnauthorizedError() };

//         const reservations = await Reservation.getReservationsByTableIDs([restaurant.id as string]); // incorrect

//         return res.status(200).json({ reservations });
//     } catch (err) {
//         next(err);
//     };
// })

export default router;