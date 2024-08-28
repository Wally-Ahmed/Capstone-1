import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest, EmployeeRequest, InterfaceRequest } from './requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from './expressError';

import { Restaurant } from '../models/Restaurant';
import { Employee } from '../models/Employee';
import { RestaurantInterface } from '../models/RestaurantInterface';

const router = express.Router();

router.use(express.json());

// Middleware to authenticate tokens

export async function authenticateAdmin(req: AdminRequest, res: Response, next: NextFunction) {
    const token: string | undefined = req.headers.authorization;

    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const restaurant = await Restaurant.authorize(token);
        if (!restaurant) { throw new UnauthorizedError('Invalid Token') };

        req.restaurant = restaurant;
        next();
    } catch (error: any) {
        const message = error.message || "Unauthorized: Invalid or expired token"
        res.status(401).json({ message });
    }
};

export async function authenticateEmployee(req: EmployeeRequest, res: Response, next: NextFunction) {
    const token: string | undefined = req.headers.authorization;

    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: employee, col } = await Employee.authorize(token);
        if (!employee) { throw new UnauthorizedError('Invalid Token') };

        req.employee = employee;
        req.colNum = col;
        next();
    } catch (error: any) {
        const message = error.message || "Unauthorized: Invalid or expired token"
        res.status(401).json({ message });
    }
};

export async function authenticateInterface(req: InterfaceRequest, res: Response, next: NextFunction) {
    const token: string | undefined = req.headers.authorization;

    try {
        if (!token) { throw new UnauthorizedError('No token provided') };
        const { user: restaurantInterface }: { user: RestaurantInterface } = await RestaurantInterface.authorize(token);
        // console.log('hit hit', restaurantInterface)
        if (!restaurantInterface) { throw new UnauthorizedError('Invalid Token') };

        req.restaurantInterface = restaurantInterface;
        next();
    } catch (error: any) {
        const message = error.message || "Unauthorized: Invalid or expired token"
        res.status(401).json({ message });
    }
};


module.exports = { authenticateAdmin, authenticateEmployee, authenticateInterface }