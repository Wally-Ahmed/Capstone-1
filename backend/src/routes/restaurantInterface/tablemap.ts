import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { tablemapNsp } from '../../__utilities__/app'
import { validateSchema } from '../../__utilities__/validateSchema';
import tableSchema from './schemas/tableSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());

router.route('/table/:table_id/')
    .patch(authenticateInterface, validateSchema(tableSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { table_id } = req.params;
            const { table_status }: { table_status: string } = req.body;

            if (!table_status) {
                throw new BadRequestError("Required parameters are missing.");
            };

            const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;

            if (!restaurantTable) { throw new NotFoundError('Table not found') };

            restaurantTable.table_status = table_status;
            await restaurantTable.save();

            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update')

            return res.sendStatus(200);
        } catch (err) {
            tablemapNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    });

export default router;