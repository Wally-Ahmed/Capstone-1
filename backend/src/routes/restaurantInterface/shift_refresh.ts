import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { ActiveShiftProperties, Shift } from '../../models/Shift';


const router = express.Router();

router.use(express.json());


router.route('/')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        try {
            const { restaurantInterface } = req;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };


            const shifts: ActiveShiftProperties[] = await Shift.getActiveShiftsByRestaurantID(restaurant.id as string);

            return res.status(200).json({ shifts });
        } catch (err) {
            next(err);
        };
    })

export default router;