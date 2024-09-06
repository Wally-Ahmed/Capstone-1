"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Restaurant_1 = require("../../models/Restaurant");
const namespace_1 = require("../../__utilities__/namespace");
const Shift_1 = require("../../models/Shift");
const RestaurantEmployee_1 = require("../../models/RestaurantEmployee");
const Tab_1 = require("../../models/Tab");
const Ticket_1 = require("../../models/Ticket");
const TicketItem_1 = require("../../models/TicketItem");
const MenuItemVariation_1 = require("../../models/MenuItemVariation");
const MenuItemRoot_1 = require("../../models/MenuItemRoot");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const tabSchema_1 = __importDefault(require("./schemas/tabSchema"));
const ticketSchema_1 = __importDefault(require("./schemas/ticketSchema"));
const tichetItemSchema_1 = __importDefault(require("./schemas/tichetItemSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(tabSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { customer_name, employee_code, restaurant_table_id } = req.body;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const activeShifts = yield Shift_1.Shift.getActiveShiftsByRestaurantID(restaurant.id);
        const ActiveRestaurantEmployeeIds = activeShifts.map((shift) => { return shift.restaurant_employee_id; });
        const restaurantEmployee = yield RestaurantEmployee_1.RestaurantEmployee.findByEmployeeCode(employee_code);
        if (restaurantEmployee === null) {
            throw new expressError_1.NotFoundError('Invalid Employee code');
        }
        ;
        console.log(restaurantEmployee.employee_rank !== 'admin');
        if (restaurantEmployee.employee_rank !== 'admin') {
            if (!ActiveRestaurantEmployeeIds.includes(restaurantEmployee.id)) {
                throw new expressError_1.UnauthorizedError('Employee must be have an active shift to be assigned to tabs');
            }
            ;
        }
        if (!customer_name || !employee_code || restaurant_table_id === undefined) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        const tab = new Tab_1.Tab(customer_name, restaurantEmployee.id, restaurant_table_id, restaurant.id);
        yield tab.save();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.status(201).json({ tab });
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:tab_id/')
    .delete(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id } = req.params;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.NotFoundError('Tab not found');
        }
        ;
        const ticketsForTab = yield tab.getTickets();
        ticketsForTab.forEach((ticket) => { if (ticket.status !== null) {
            throw new expressError_1.ForbiddenError('Cannot delete tab if they have active tickets ');
        } });
        yield tab.delete();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:tab_id/ticket/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(ticketSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id } = req.params;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.NotFoundError('Tab not found');
        }
        ;
        const tickets = yield tab.getTickets();
        if (tickets.map(ticket => ticket.status).includes(null)) {
            throw new expressError_1.NotAllowedError('Submit existing ticket to kitchen before opening a new one for this tab.');
        }
        const ticket = new Ticket_1.Ticket(tab.id, restaurant.id, '');
        yield ticket.save();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:tab_id/ticket/:ticket_id/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(ticketSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    const { tab_id, ticket_id } = req.params;
    // let { status }: { status: 'in-progress' | 'completed' } = req.body;
    try {
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (ticket === null) {
            throw new expressError_1.NotFoundError('Ticket not found');
        }
        ;
        const itemsInTicket = yield ticket.getTicketItems();
        // let status: 'in-progress' | 'completed';
        if (itemsInTicket.length === 0) {
            yield ticket.delete();
            return res.sendStatus(200);
        }
        else if (itemsInTicket.map(ticket => ticket.prep_time_required).includes(true)) {
            ticket.status = 'in-progress';
        }
        else {
            ticket.status = 'completed';
            ticket.time_completed = new Date();
        }
        yield ticket.save();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id, ticket_id } = req.params;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (ticket === null) {
            throw new expressError_1.NotFoundError('Ticket not found');
        }
        ;
        yield ticket.delete();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:tab_id/ticket/:ticket_id/item/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(tichetItemSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id, ticket_id } = req.params;
        const { menu_item_variation_id } = req.body;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (ticket === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItem = yield MenuItemVariation_1.MenuItemVariation.findById(menu_item_variation_id);
        if (menuItem === null) {
            throw new expressError_1.NotFoundError('Menu Item not found');
        }
        ;
        const menuItemRoot = yield MenuItemRoot_1.MenuItemRoot.findById(menuItem.menu_item_root_id);
        if (menuItemRoot === null) {
            throw new expressError_1.ExpressError('Unexecpted error has occurred', 500);
        }
        ;
        if (!menu_item_variation_id) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        const item = new TicketItem_1.TicketItem(menuItem.id, ticket.id, tab.id, '', menuItemRoot.prep_time_required, parseFloat(`${menuItemRoot.base_price}`) + parseFloat(`${menuItem.price_difference}`), menuItemRoot.menu_item_root_name, menuItem.menu_item_variation_description);
        yield item.save();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(201);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:tab_id/ticket/:ticket_id/item/:item_id')
    .patch(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(tichetItemSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id, ticket_id, item_id } = req.params;
        const { employee_code, price_adjustment, comments } = req.body;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (ticket === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const item = yield TicketItem_1.TicketItem.findById(item_id);
        if (item === null) {
            throw new expressError_1.NotFoundError('Ticket Item not found');
        }
        ;
        if (price_adjustment && !employee_code) {
            throw new expressError_1.BadRequestError("Manager Code Required to adjust price missing.");
        }
        else if (price_adjustment && employee_code) {
            const restaurantEmployee = yield RestaurantEmployee_1.RestaurantEmployee.findByEmployeeCode(employee_code);
            if (restaurantEmployee === null) {
                throw new expressError_1.UnauthorizedError('Invalid employee code');
            }
            ;
            if (restaurantEmployee.employee_rank !== 'admin' &&
                restaurantEmployee.employee_rank !== 'manager') {
                throw new expressError_1.UnauthorizedError('Employee does not have authorization for this action');
            }
            ;
            item.price_adjustment = price_adjustment;
        }
        if (comments) {
            item.comments = comments;
        }
        ;
        yield item.save();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(tichetItemSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { tab_id, ticket_id, item_id } = req.params;
        const { employee_code } = req.body;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tab = yield Tab_1.Tab.findById(tab_id);
        if (tab === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (ticket === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const item = yield TicketItem_1.TicketItem.findById(item_id);
        if (item === null) {
            throw new expressError_1.NotFoundError('Ticket Item not found');
        }
        ;
        if (!employee_code) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        const restaurantEmployee = yield RestaurantEmployee_1.RestaurantEmployee.findByEmployeeCode(employee_code);
        if (restaurantEmployee === null) {
            throw new expressError_1.UnauthorizedError('Invalid employee code');
        }
        ;
        if (ticket.status !== null) {
            if (restaurantEmployee.employee_rank !== 'admin' &&
                restaurantEmployee.employee_rank !== 'manager') {
                throw new expressError_1.UnauthorizedError('Employee does not have authorization for this action');
            }
            ;
        }
        ;
        if (!employee_code) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        yield item.delete();
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tabNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
exports.default = router;
