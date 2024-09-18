import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Tab } from '../../models/Tab';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';


const router = express.Router();

router.use(express.json());



// 

// Server must identify the most recent transaction method. Interface object stores a property called recent_checkout.
// This is not the UUID of the checkout instrument. This should be a fk refference to the checkout_types table with the
//  value being the table name of the table containing stored checkout instrument.

// We must return the value of the inteface's recent_checkout

// 

// GET checkout methods
// POST new checkout method - deletes previous method
// DELETE checkout method
// POST complete checkout with cash


router.route('/checkout-method')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        try {
            const { restaurantInterface } = req;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const methods = [
                {
                    method: "Cash"
                }
            ]

            return res.status(200).json({ methods });
        } catch (err) {
            next(err);
        };
    })

router.route('/verify-sumup')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        console.log('hit')
        try {
            const { restaurantInterface } = req;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tokensVerified = false;

            return res.status(200).json({ verified: tokensVerified });
        } catch (err) {
            next(err);
        };
    })

export default router;