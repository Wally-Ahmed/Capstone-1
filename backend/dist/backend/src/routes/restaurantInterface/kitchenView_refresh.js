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
const Ticket_1 = require("../../models/Ticket");
const TicketItem_1 = require("../../models/TicketItem");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/')
    .get(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantInterface } = req;
        if (restaurantInterface === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const tickets = yield Ticket_1.Ticket.getActiveTicketsByRestaurantID(restaurant.id);
        const allTicketItems = yield TicketItem_1.TicketItem.getTicketItemsByTicketIDs(tickets.map(ticket => ticket.id));
        const fullTickets = tickets.map(ticket => {
            const itemsInTicket = allTicketItems.filter(item => item.ticket_id === ticket.id);
            return Object.assign(Object.assign({}, ticket), { ticketItems: itemsInTicket });
        });
        return res.status(200).json({ tickets: fullTickets });
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
