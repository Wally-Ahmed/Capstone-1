import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { shiftNsp } from '../../__utilities__/app';
import { Employee } from '../../models/Employee';
import { ActiveShiftProperties, Shift } from '../../models/Shift';
import { TipPool } from '../../models/TipPool';
import { RestaurantEmployee } from '../../models/RestaurantEmployee';
import { validateSchema } from '../../__utilities__/validateSchema';
import shiftSchema from './schemas/shiftSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());

router.route('/')
    .post(authenticateInterface, validateSchema(shiftSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { employee_code }: { employee_code: string } = req.body;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const restaurantEmployee = await RestaurantEmployee.findByEmployeeCode(employee_code);

            if (restaurantEmployee === null) { throw new NotFoundError('Invalid Employee code') };

            const currentDate = new Date();

            let tipPool = await TipPool.findByDate(currentDate);
            if (tipPool === null) {
                tipPool = new TipPool(restaurantInterface.restaurant_id, currentDate, 0);
                await tipPool.save();
            };

            const restaurantEmployeeIds = (await Shift.getActiveShiftsByRestaurantID(restaurant.id as string)).map((shift: ActiveShiftProperties) => { return shift.restaurant_employee_id })

            if (restaurantEmployeeIds.includes(restaurantEmployee.id as string)) { throw new ForbiddenError('Employee already has an active shift') };

            const shift = new Shift(currentDate, restaurant.id as string, tipPool.id as string, restaurantEmployee.id as string);
            await shift.save();


            shiftNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            return res.sendStatus(201);

        } catch (err) {
            shiftNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })


router.route('/:shift_id/')
    .post(authenticateInterface, validateSchema(shiftSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { shift_id } = req.params;
            // const { exit_code }: { exit_code: string } = req.body;
            const { employee_code }: { employee_code: string } = req.body;

            const shift = await Shift.findById(shift_id) as Shift | null;
            if (!shift) { throw new NotFoundError('Shift not found') };

            const restaurantEmployee = await RestaurantEmployee.findByEmployeeCode(employee_code);
            if (!restaurantEmployee) {
                throw new BadRequestError("Invalid Employee Code");
            }
            else if (restaurantEmployee.id === shift.restaurant_employee_id) {
                shift.exit_code = 'employee-exit'
            }
            else if (restaurantEmployee.employee_rank === 'admin' || restaurantEmployee.employee_rank === 'manager') {
                shift.exit_code = 'manager-exit'
            }
            else {
                throw new BadRequestError("Must provide the employee code of the selected employee or the employee code of a manager or the admin");
            }
            shift.end_date_time = new Date();
            shift.save();


            shiftNsp.to(restaurantInterface.restaurant_id as string).emit('update');

            return res.sendStatus(200);

        } catch (err) {
            shiftNsp.to(restaurantInterface.restaurant_id as string).emit('update');
            next(err);
        };
    })


export default router;