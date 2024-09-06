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
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Reservation_1 = require("../../models/Reservation");
const namespace_1 = require("../../__utilities__/namespace");
const reservation_1 = __importDefault(require("./schemas/reservation"));
const validateSchema_1 = require("../../__utilities__/validateSchema");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/reservation/:restaurant_id')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(reservation_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant_id } = req.params;
    try {
        const { party_size, reservation_time, guest_name, guest_phone, guest_email, restaurant_id, } = req.body;
        const reservation = new Reservation_1.Reservation(party_size, reservation_time, guest_name, null, guest_phone, guest_email, restaurant_id);
        yield reservation.save();
        namespace_1.tablemapNsp.to(restaurant_id).emit('new-reservation');
        return res.sendStatus(201);
    }
    catch (err) {
        namespace_1.tablemapNsp.to(restaurant_id).emit('new-reservation');
        next(err);
    }
    ;
}));
exports.default = router;
