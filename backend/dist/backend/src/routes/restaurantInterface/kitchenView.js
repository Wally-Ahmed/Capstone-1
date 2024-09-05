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
const namespace_1 = require("../../__utilities__/namespace");
const Ticket_1 = require("../../models/Ticket");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const ticketSchema_1 = __importDefault(require("./schemas/ticketSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/ticket/:ticket_id/')
    .patch(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(ticketSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { ticket_id } = req.params;
        const { status } = req.body;
        const ticket = yield Ticket_1.Ticket.findById(ticket_id);
        if (!ticket) {
            throw new expressError_1.NotFoundError('Ticket not found');
        }
        ;
        if (!status) {
            throw new expressError_1.BadRequestError('Required data is missing or improperly formatted');
        }
        ;
        // Save the updated ticket back to the database
        if (status === 'completed') {
            ticket.time_completed = new Date();
        }
        ;
        ticket.status = status;
        yield ticket.save();
        namespace_1.kitchenNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.kitchenNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
exports.default = router;
