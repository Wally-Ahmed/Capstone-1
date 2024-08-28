import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { EmployeeRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateEmployee } from '../../__utilities__/authenticateToken'

import { Restaurant } from '../../models/Restaurant';
import { Employee } from '../../models/Employee';
import { JSONSchemaType } from 'ajv';
import { validateSchema } from '../../__utilities__/validateSchema';
import employeeSchema from './schemas/employeeSchema';

const router = express.Router();

router.use(express.json());


router.route('/employeecode')
    .get(authenticateEmployee, async (req: EmployeeRequest, res: Response, next: NextFunction) => {
        try {
            const { employee } = req;
            if (employee === undefined) { throw new UnauthorizedError() };

            // console.log(employee)

            res.status(200).json({ code: employee.employee_code });
        } catch (err) {
            next(err);
        };
    })
    .post(authenticateEmployee, validateSchema(employeeSchema as JSONSchemaType<any>), async (req: EmployeeRequest, res: Response, next: NextFunction) => {
        try {
            const { employee } = req;
            if (employee === undefined) { throw new UnauthorizedError() };

            const code = crypto.randomBytes(6).toString('hex');
            const oldE = await Employee.findByEmployeeCode(code);
            if (oldE !== null) { oldE.employee_code = null; oldE.save() };

            employee.employee_code = code;
            await employee.save();

            res.status(200).json({ code: employee.employee_code });
        } catch (err) {
            next(err);
        };
    })

router.route('/employment')
    .get(authenticateEmployee, async (req: EmployeeRequest, res: Response, next: NextFunction) => {
        try {
            const { employee } = req;
            if (employee === undefined) { throw new UnauthorizedError() };

            const restaurants = await employee.getRestaurantEmployees();


            res.status(200).json({ restaurants });
        } catch (err) {
            next(err);
        };
    });

export default router;