import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';
import cors from 'cors'

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
import checkoutSchema from './schemas/checkoutSchema';
import { io } from '../../__utilities__/app';


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
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const methods = [
                {
                    method: "Cash"
                }
            ]

            if (restaurantInterface.sumup_solo_id) {
                const availableSolos = await restaurantInterface.attemptGetAllSumUpSolos()
                if (availableSolos && availableSolos.items.find((solo: { id: string }) => solo.id === restaurantInterface.sumup_solo_id)) {
                    methods.push({ method: "SumUp-Solo" })
                }
            }

            return res.status(200).json({ methods });
        } catch (err) {
            next(err);
        };
    })

router.route('/process-checkout/cash')
    .post(authenticateInterface, validateSchema(checkoutSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tabId, tipAmount }: { tabId: string, tipAmount: number } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tab = await Tab.findById(tabId) as Tab;
            if (!tab) { throw new NotFoundError('Invalid tab id') };

            tab.tab_status = "resolved";
            tab.total_tip = tipAmount;
            tab.calculated_tax = 0;

            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            await tab.save();

            return res.sendStatus(200);
        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    })

router.route('/sumup-oauth-login')
    .post(authenticateInterface, validateSchema(connectSumUpOauthSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
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
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const user = await restaurantInterface.attemptGetSumUpProfile() as Record<string, any>;

            if (user) { restaurantInterface.sumup_merchant_code = user.merchant_code }
            await restaurantInterface.save()

            return res.status(200).json({ verified: user ? true : false });
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/sumup-solo')
    .get(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const data = await restaurantInterface.attemptGetAllSumUpSolos() as Record<string, any>;


            return res.status(200).json({ solos: data.items });
        } catch (err) {
            next(err);
        };
    })
    .post(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
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
    .delete(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { soloId }: { soloId: string } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const data = await restaurantInterface.attemptRemoveSumUpSolo(soloId) as Record<string, any>;

            if (restaurantInterface.sumup_solo_id === soloId) {
                restaurantInterface.sumup_solo_id = null;
                await restaurantInterface.save()
            }

            console.log(data)

            return res.sendStatus(204);
        } catch (err) {
            next(err);
        };
    })

router.route('/sumup/sumup-solo/select')
    .post(authenticateInterface, validateSchema(linkSumUpSoloSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
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

router.route('/sumup/sumup-solo/initiate-checkout')
    .post(authenticateInterface, validateSchema(checkoutSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tabId }: { tabId: string } = req.body;
            if (restaurantInterface === undefined) { throw new UnauthorizedError() };
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tab = await Tab.findById(tabId) as Tab;
            if (!tab) { throw new NotFoundError('Invalid tab id') };

            const data = await restaurantInterface.attemptInitiateSumUpSoloTransaction(tab);
            if (!data) {
                return res.sendStatus(400);
            }
            else {
                tab.transaction_id = data.data.client_transaction_id;
                await tab.save();
                return res.status(200).json({ data });
            };
        } catch (err) {
            next(err);
        };
    })


router.use(cors({ origin: '*', optionsSuccessStatus: 200 }))

router.route('/sumup/sumup-solo/process-checkout')
    .post(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, payload }: { id: string, payload: { checkout_id: string, reference: string, status: 'PENDING' | 'PAID' | 'FAILED' } } = req.body;


            io.emit('transaction');

            const tab = await Tab.findByTransactionId(id) as Tab;

            const restaurant = await Restaurant.findById(tab.restaurant_id) as Restaurant;

            tab.tab_status = "resolved"
            await tab.save();

            io.to(restaurant.id as string).emit('transaction');

            console.log(req.body)

            return res.sendStatus(200)

        } catch (err) {
            next(err);
        };
    })

export default router;