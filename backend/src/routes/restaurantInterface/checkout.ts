import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Tab } from '../../models/Tab';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { validateSchema } from '../../__utilities__/validateSchema';
import connectSumUpOauthSchema from './schemas/connectSumUpOauthSchema';
import { JSONSchemaType } from 'ajv';
import linkSumUpSoloSchema from './schemas/linkSumUpSoloSchema';


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


router.route('/methods')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        try {
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

router.route('/sumup-oauth-login')
    .post(authenticateInterface, validateSchema(connectSumUpOauthSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        try {
            const { access_token, refresh_token, code }: { access_token: string, refresh_token: string, code: string } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            if (!access_token || !refresh_token || !code) {
                throw new BadRequestError("Required parameters are missing.");
            };

            restaurantInterface.sumup_oauth2_access_token = access_token;
            restaurantInterface.sumup_oauth2_refresh_token = refresh_token;
            restaurantInterface.sumup_oauth2_code = code;

            const user = await restaurantInterface.attemptGetSumUpProfile() as Record<string, any>

            restaurantInterface.sumup_merchant_code = user.merchant_code

            await restaurantInterface.save()

            return res.sendStatus(200);
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/verify-sumup')
    .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        try {
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const user = await restaurantInterface.attemptGetSumUpProfile() as Record<string, any>;

            restaurantInterface.sumup_merchant_code = user.merchant_code
            await restaurantInterface.save()

            return res.status(200).json({ verified: user ? true : false });
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/available-solo')
    .get(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        try {
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const data = await restaurantInterface.attemptGetAllSumUpSolos() as Record<string, any>;

            console.log(data.items)

            return res.status(200).json({ solos: data.items });
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/link-solo')
    .post(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        try {
            const { code }: { code: string } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const data = await restaurantInterface.attemptLinkSumUpSolo(code) as Record<string, any>;

            restaurantInterface.sumup_solo_id = data.id;

            await restaurantInterface.save()

            return res.status(200).json({ data });
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/select-solo')
    .post(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface;
        console.log(req.body)
        try {
            const { soloId }: { soloId: string } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const data = await restaurantInterface.attemptGetAllSumUpSolos() as Record<string, any>;

            const solos: any[] = data.items

            if (!solos.find((solo) => solo.id === soloId)) {
                throw new NotFoundError('Solo Id is not recognised')
            }

            restaurantInterface.sumup_solo_id = soloId;

            await restaurantInterface.save()

            return res.status(200).json({ data });
        } catch (err) {
            next(err);
        };
    })

export default router;