import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { validateSchema } from '../../__utilities__/validateSchema';
import connectSchema from './schemas/connectSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());

// Validate link route
router.post('/validate-link', authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
    try {
        // console.log('hit')
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;

        const user = { tablemap_permission: restaurantInterface.tablemap_permission, tab_permission: restaurantInterface.tab_permission, kitchen_permission: restaurantInterface.kitchen_permission, shift_permission: restaurantInterface.shift_permission }
        return res.status(200).json({ user, validated: true });

    } catch (err) {
        const error = err as ExpressError;
        const statusCode = error.status ? error.status : 500;
        return res.status(statusCode).json({ validated: false });
    };
});


router.route('/link')
    // .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
    //     try {
    //         const restaurantInterface = req.restaurantInterface as RestaurantInterface;
    //         restaurantInterface.shift_permission;

    //         res.status(200).json({ tablemap_permission: restaurantInterface.tablemap_permission, tab_permission: restaurantInterface.tab_permission, kitchen_permission: restaurantInterface.kitchen_permission, shift_permission: restaurantInterface.shift_permission });
    //     } catch (err) {
    //         next(err);
    //     };
    // })
    .post(validateSchema(connectSchema as JSONSchemaType<any>), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { link_code }: { link_code: string } = req.body;

            const restaurantInterface = await RestaurantInterface.findByLinkCode(link_code);
            if (restaurantInterface === null) { throw new NotFoundError('Code is invalid') };

            const token = await restaurantInterface._setToken();

            res.status(200).json({ token });

        } catch (err) {
            next(err);
        };
    })

export default router;