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
const RestaurantTable_1 = require("../../models/RestaurantTable");
const Reservation_1 = require("../../models/Reservation");
const namespace_1 = require("../../__utilities__/namespace");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const reservationSchema_1 = __importDefault(require("./schemas/reservationSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/reservation/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(reservationSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { party_size, reservation_time, guest_name, guest_phone, guest_email, confirmation_status, restaurant_table_id } = req.body;
        if (!party_size || !reservation_time || !guest_name || !guest_phone || !guest_email || !confirmation_status) {
            console.log(!party_size, !reservation_time, !guest_name, !guest_phone, !guest_email, !confirmation_status, !restaurant_table_id);
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        // console.log('hit')
        const reservation = new Reservation_1.Reservation(party_size, reservation_time, guest_name, null, guest_phone, guest_email, restaurantInterface.restaurant_id, confirmation_status, restaurant_table_id || null);
        yield reservation.save();
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(201);
    }
    catch (err) {
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
;
router.route('/reservation/:reservation_id/')
    .patch(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    console.log('hit');
    try {
        const { reservation_id } = req.params;
        const { party_size, reservation_time, guest_name, guest_ip, guest_phone, guest_email, restaurant_table_id, confirmation_status, } = req.body;
        const reservation = yield Reservation_1.Reservation.findById(reservation_id);
        if (!reservation) {
            throw new expressError_1.NotFoundError('Reservation not found');
        }
        ;
        // Prepare the updates object
        const updates = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (party_size !== undefined && { party_size })), (reservation_time !== undefined && { reservation_time })), (guest_name !== undefined && { guest_name })), (guest_ip !== undefined && { guest_ip })), (guest_phone !== undefined && { guest_phone })), (guest_email !== undefined && { guest_email })), (restaurant_table_id !== undefined && { restaurant_table_id })), (confirmation_status !== undefined && { confirmation_status }));
        // Update the restaurant instance with new values
        Object.keys(updates).forEach(key => {
            reservation[key] = updates[key];
        });
        // Save the updated restaurant back to the database
        yield reservation.save();
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        console.log('pass');
        return res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { reservation_id } = req.params;
        const reservation = yield Reservation_1.Reservation.findById(reservation_id);
        if (!reservation) {
            throw new expressError_1.NotFoundError('Reservation not found');
        }
        ;
        // Save the updated restaurant back to the database
        yield reservation.delete();
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/reservation/:reservation_id/assign')
    .patch(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { reservation_id } = req.params;
        const { restaurant_table_id } = req.body;
        const reservation = yield Reservation_1.Reservation.findById(reservation_id);
        if (!reservation) {
            throw new expressError_1.NotFoundError('Reservation not found');
        }
        ;
        const table = yield RestaurantTable_1.RestaurantTable.findById(restaurant_table_id);
        if (table === null) {
            throw new expressError_1.BadRequestError('Invalid restaurant_table_id');
        }
        reservation.restaurant_table_id = table.id;
        yield reservation.save();
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.tablemapNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
exports.default = router;
