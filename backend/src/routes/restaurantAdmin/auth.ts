import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../../__utilities__/requestInterfaces';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateAdmin } from '../../__utilities__/authenticateToken'

import { Restaurant } from '../../models/Restaurant';
import { validateSchema } from '../../__utilities__/validateSchema';
import restaurantSchema from './schemas/restaurantSchema';
import { Employee } from '../../models/Employee';
import { RestaurantEmployee } from '../../models/RestaurantEmployee';
import { JSONSchemaType } from 'ajv';
import { json } from 'express';

const router = express.Router();

router.use(express.json());

router.post('/signup', validateSchema(restaurantSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
    const { restaurant_name, restaurant_address, email, phone, password, confirmPassword, }: { restaurant_name: string, restaurant_address: string, email: string, phone: string, password: string, confirmPassword: string, } = req.body;


    try {
        if (!restaurant_name || !restaurant_address || !email || !phone || !password || !confirmPassword) {
            throw new BadRequestError("Required parameters are missing.");
        };

        if (password !== confirmPassword) {
            throw new BadRequestError("Password and confirmation password do not match.");
        };

        if (await Restaurant.findByEmail(email) !== null) { throw new BadRequestError("An account using the email already exists") };


        if (await Restaurant.findByPhoneNumber(phone) !== null) { throw new BadRequestError("An account using the phone number already exists") };


        if (await Employee.findByEmail(email) !== null) { throw new ForbiddenError('An employee account already exists for this email, please deactivae that account first or try another email.') };


        const password_hash = await bcrypt.hash(password, 10); // Hash the password


        let employee_code: string;
        const user = new Restaurant(restaurant_name, restaurant_address, email, phone, password_hash,);
        await user.save()
        while (true) {
            employee_code = crypto.randomBytes(4).toString('hex');
            const valid = await RestaurantEmployee.validateNewEmployeeCode(employee_code, user.id as string);
            if (valid) { break };
        };
        const employee = new Employee(`${restaurant_name} Admin`, email, phone, password_hash);
        await employee.save();


        const employment = new RestaurantEmployee(employee.id as string, user.id as string, 'admin', employee_code);
        await employment.save();

        const token = await user.authenticate(password);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    };
});

// User login route
router.post('/login', validateSchema(restaurantSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password, }: { email: string, password: string, } = req.body;
        if (!email || !password) { };
        const restaurant = await Restaurant.findByEmail(email);
        if (!restaurant) { throw new NotFoundError() };

        const token = await restaurant.authenticate(password);
        if (!token) { throw new UnauthorizedError() };


        return res.status(200).json({ token });

    } catch (err) {
        if (err instanceof ExpressError) {
            if (err.status >= 400 && err.status < 500) {
                next(new UnauthorizedError('Invalid username or password.'));
            } else {
                next(err);
            }
        } else {
            // Handle non-ExpressError cases
            next(new ExpressError('An unexpected error occurred.', 500));
        }

    };
});

// User logout route
router.post('/logout', authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
        const restaurant = req.restaurant;;

        if (!restaurant) { throw new UnauthorizedError() };

        restaurant.auth_token_hash = null;
        await restaurant.save();

        return res.sendStatus(200);

    } catch (err) {
        next(err);
    };
});

// Validate login route
router.post('/validate-login', authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
        const restaurant = req.restaurant;;

        if (!restaurant) { throw new BadRequestError('Token is invalid.') };

        const user = {
            restaurant_name: restaurant.restaurant_name,
            restaurant_address: restaurant.restaurant_address,
            email: restaurant.email,
            phone_number: restaurant.phone_number,
            active_layout_id: restaurant.active_layout_id
        };

        return res.status(200).json({ user, validated: true });


    } catch (err) {
        const error = err as ExpressError;
        const statusCode = error.status ? error.status : 500;
        return res.status(statusCode).json({ validated: false });
    };
});

export default router;