import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateAdmin } from '../../__utilities__/authenticateToken';
import crypto from 'crypto';
import { Menu } from '../../models/Menu';
import { Employee } from '../../models/Employee';
import { RestaurantEmployee } from '../../models/RestaurantEmployee';
import { validateSchema } from '../../__utilities__/validateSchema';
import employeeSchema from './schemas/employeeSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());

router.route('/employee')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const employees = await restaurant.getRestaurantEmployees();


            res.status(200).json({ employees });
        } catch (err) {
            next(err);
        };
    });

router.route('/employee/link')
    .post(authenticateAdmin, validateSchema(employeeSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { restaurant } = req;
        const { code }: { code: string } = req.body;
        console.log('hit')
        try {
            if (restaurant === undefined) { throw new UnauthorizedError() };


            const employee = await Employee.findByEmployeeCode(code);
            if (employee === null) { throw new NotFoundError('Code is invalid') };

            let employee_code: string;
            while (true) {
                employee_code = crypto.randomBytes(4).toString('hex');
                const valid = await RestaurantEmployee.validateNewEmployeeCode(employee_code, restaurant.id as string);
                if (valid) { break };
            };

            const employment = new RestaurantEmployee(employee.id as string, restaurant.id as string, "employee", employee_code,)
            console.log('hit', restaurant)
            await employment.save()

            employee.employee_code = null;

            return res.status(201).json({ employment_info: employment });

        } catch (err) {
            next(err);
        };
    })

router.route('/employee/link/:employment_id')
    .patch(authenticateAdmin, validateSchema(employeeSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { employment_id } = req.params;
        const { employee_rank }: { employee_rank: string | undefined } = req.body;
        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const employment = await RestaurantEmployee.findById(employment_id) as RestaurantEmployee;
            if (employment === null) { throw new NotFoundError('Restaurant Employment details were not found') };

            if (employee_rank) { employment.employee_rank = employee_rank };

            await employment.save();

            return res.status(200).json({ employment_info: employment });
        } catch (err) {
            next(err);
        };

    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { employment_id } = req.params;

        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };


            if (employment_id === undefined) { throw new BadRequestError('Required values missing') };
            const employment = await RestaurantEmployee.findById(employment_id) as RestaurantEmployee;
            if (employment === null) { throw new NotFoundError('Restaurant Employment details were not found') };

            await employment.delete();

            return res.sendStatus(204);
        } catch (err) {
            next(err);
        };

    })


export default router;