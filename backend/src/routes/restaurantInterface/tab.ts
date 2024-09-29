import express, { Request, Response, NextFunction } from 'express';
import { InterfaceRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, NotAllowedError } from '../../__utilities__/expressError';
import { Layout } from '../../models/Layout';
import { authenticateInterface } from '../../__utilities__/authenticateToken';
import { RestaurantInterface } from '../../models/RestaurantInterface';
import { Restaurant } from '../../models/Restaurant';
import { RestaurantTable } from '../../models/RestaurantTable';
import { Reservation } from '../../models/Reservation';
import { io } from '../../__utilities__/app';
import { Employee } from '../../models/Employee';
import { ActiveShiftProperties, Shift } from '../../models/Shift';
import { TipPool } from '../../models/TipPool';
import { RestaurantEmployee } from '../../models/RestaurantEmployee';
import { Tab } from '../../models/Tab';
import { Ticket } from '../../models/Ticket';
import { TicketItem } from '../../models/TicketItem';
import { MenuItemVariation } from '../../models/MenuItemVariation';
import { MenuItemRoot } from '../../models/MenuItemRoot';
import { validateSchema } from '../../__utilities__/validateSchema';
import tabSchema from './schemas/tabSchema';
import ticketSchema from './schemas/ticketSchema';
import ticketItemSchema from './schemas/tichetItemSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());

router.route('/')
    .post(authenticateInterface, validateSchema(tabSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { customer_name, employee_code, restaurant_table_id }: { customer_name: string, employee_code: string, restaurant_table_id: string | null } = req.body;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const activeShifts = await Shift.getActiveShiftsByRestaurantID(restaurant.id as string);
            const ActiveRestaurantEmployeeIds = activeShifts.map((shift: ActiveShiftProperties) => { return shift.restaurant_employee_id });

            const restaurantEmployee = await RestaurantEmployee.findByEmployeeCode(employee_code);
            if (restaurantEmployee === null) { throw new NotFoundError('Invalid Employee code') };
            console.log(restaurantEmployee.employee_rank !== 'admin')
            if (restaurantEmployee.employee_rank !== 'admin') {
                if (!ActiveRestaurantEmployeeIds.includes(restaurantEmployee.id as string)) { throw new UnauthorizedError('Employee must be have an active shift to be assigned to tabs') };
            }


            if (!customer_name || !employee_code || restaurant_table_id === undefined) {
                throw new BadRequestError("Required parameters are missing.");
            };

            const tab = new Tab(customer_name, restaurantEmployee.id as string, restaurant_table_id, restaurant.id as string);
            await tab.save();


            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.status(201).json({ tab });

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    });


router.route('/:tab_id/')
    .delete(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tab_id } = req.params;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new NotFoundError('Tab not found') };

            const ticketsForTab = await tab.getTickets();

            ticketsForTab.forEach((ticket: Ticket) => { if (ticket.status !== null) { throw new ForbiddenError('Cannot delete tab if they have active tickets ') } });

            await tab.delete();

            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    })


router.route('/:tab_id/ticket/')
    .post(authenticateInterface, validateSchema(ticketSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tab_id } = req.params;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };


            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new NotFoundError('Tab not found') };

            const tickets = await tab.getTickets();

            if (tickets.map(ticket => ticket.status).includes(null)) {
                throw new NotAllowedError('Submit existing ticket to kitchen before opening a new one for this tab.')
            }

            const ticket = new Ticket(tab.id as string, restaurant.id as string, '');
            await ticket.save();


            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    });

router.route('/:tab_id/ticket/:ticket_id/')
    .post(authenticateInterface, validateSchema(ticketSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        const { tab_id, ticket_id } = req.params;
        // let { status }: { status: 'in-progress' | 'completed' } = req.body;
        try {
            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new BadRequestError('Route is not properly formatted') };

            const ticket = await Ticket.findById(ticket_id) as Ticket | null;
            if (ticket === null) { throw new NotFoundError('Ticket not found') };

            const itemsInTicket = await ticket.getTicketItems();

            // let status: 'in-progress' | 'completed';

            if (itemsInTicket.length === 0) {
                await ticket.delete();
                return res.sendStatus(200);
            }
            else if (itemsInTicket.map(ticket => ticket.prep_time_required).includes(true)) {
                ticket.status = 'in-progress';
            } else {
                ticket.status = 'completed';
                ticket.time_completed = new Date();
            }

            await ticket.save();


            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    })
    .delete(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tab_id, ticket_id } = req.params;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };

            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new BadRequestError('Route is not properly formatted') };

            const ticket = await Ticket.findById(ticket_id);
            if (ticket === null) { throw new NotFoundError('Ticket not found') };
            await ticket.delete();


            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    });

router.route('/:tab_id/ticket/:ticket_id/item/')
    .post(authenticateInterface, validateSchema(ticketItemSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;


        try {
            const { tab_id, ticket_id } = req.params;
            const { menu_item_variation_id }: { menu_item_variation_id: string } = req.body;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };


            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new BadRequestError('Route is not properly formatted') };

            const ticket = await Ticket.findById(ticket_id);
            if (ticket === null) { throw new BadRequestError('Route is not properly formatted') };

            const menuItem = await MenuItemVariation.findById(menu_item_variation_id) as MenuItemVariation | null;
            if (menuItem === null) { throw new NotFoundError('Menu Item not found') };

            const menuItemRoot = await MenuItemRoot.findById(menuItem.menu_item_root_id) as MenuItemRoot | null;
            if (menuItemRoot === null) { throw new ExpressError('Unexecpted error has occurred', 500) };

            if (!menu_item_variation_id) {
                throw new BadRequestError("Required parameters are missing.");
            };

            const item = new TicketItem(menuItem.id as string, ticket.id as string, tab.id as string, '', menuItemRoot.prep_time_required, parseFloat(`${menuItemRoot.base_price}`) + parseFloat(`${menuItem.price_difference}`), menuItemRoot.menu_item_root_name, menuItem.menu_item_variation_description);

            await item.save();

            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(201);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    });

router.route('/:tab_id/ticket/:ticket_id/item/:item_id')
    .patch(authenticateInterface, validateSchema(ticketItemSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tab_id, ticket_id, item_id } = req.params;
            const { employee_code, price_adjustment, comments }: { employee_code: string, price_adjustment: number, comments?: string } = req.body;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };


            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new BadRequestError('Route is not properly formatted') };

            const ticket = await Ticket.findById(ticket_id);
            if (ticket === null) { throw new BadRequestError('Route is not properly formatted') };

            const item = await TicketItem.findById(item_id) as TicketItem | null;
            if (item === null) { throw new NotFoundError('Ticket Item not found') };


            if (price_adjustment && !employee_code) {
                throw new BadRequestError("Manager Code Required to adjust price missing.");
            } else if (price_adjustment && employee_code) {
                const restaurantEmployee = await RestaurantEmployee.findByEmployeeCode(employee_code);
                if (restaurantEmployee === null) { throw new UnauthorizedError('Invalid employee code') };
                if (
                    restaurantEmployee.employee_rank !== 'admin' &&
                    restaurantEmployee.employee_rank !== 'manager'
                ) { throw new UnauthorizedError('Employee does not have authorization for this action') };

                item.price_adjustment = price_adjustment;
            }

            if (comments) { item.comments = comments };

            await item.save();

            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    })
    .delete(authenticateInterface, validateSchema(ticketItemSchema as JSONSchemaType<any>), async (req: InterfaceRequest, res: Response, next: NextFunction) => {
        const restaurantInterface = req.restaurantInterface as RestaurantInterface;
        try {
            const { tab_id, ticket_id, item_id } = req.params;
            const { employee_code }: { employee_code: string, price_adjustment: number } = req.body;

            const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
            if (restaurant === null) { throw new UnauthorizedError() };


            const tab = await Tab.findById(tab_id) as Tab | null;
            if (tab === null) { throw new BadRequestError('Route is not properly formatted') };

            const ticket = await Ticket.findById(ticket_id) as Ticket | null;
            if (ticket === null) { throw new BadRequestError('Route is not properly formatted') };

            const item = await TicketItem.findById(item_id) as TicketItem | null;
            if (item === null) { throw new NotFoundError('Ticket Item not found') };


            if (!employee_code) {
                throw new BadRequestError("Required parameters are missing.");
            };

            const restaurantEmployee = await RestaurantEmployee.findByEmployeeCode(employee_code);
            if (restaurantEmployee === null) { throw new UnauthorizedError('Invalid employee code') };

            if (ticket.status !== null) {
                if (
                    restaurantEmployee.employee_rank !== 'admin' &&
                    restaurantEmployee.employee_rank !== 'manager'
                ) { throw new UnauthorizedError('Employee does not have authorization for this action') };
            };

            if (!employee_code) {
                throw new BadRequestError("Required parameters are missing.");
            };

            await item.delete();

            io.to(restaurantInterface.restaurant_id as string).emit('update-register');

            return res.sendStatus(200);

        } catch (err) {
            io.to(restaurantInterface.restaurant_id as string).emit('update-register');
            next(err);
        };
    });

export default router;