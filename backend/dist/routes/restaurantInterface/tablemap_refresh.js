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
const Layout_1 = require("../../models/Layout");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Restaurant_1 = require("../../models/Restaurant");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/layout')
    .get(authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('hit')
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
        if (restaurant.active_layout_id === null) {
            return res.status(200).json({ layout: null });
        }
        ;
        const layout = yield Layout_1.Layout.findById(restaurant.active_layout_id);
        if (!layout) {
            return res.status(200).json({ layout: null });
        }
        ;
        // console.log(layout, 'ghittt')
        const fullLayout = yield layout.getFullLayout();
        return res.status(200).json({ layout: fullLayout });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/reservation')
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
        const reservations = yield restaurant.getReservations();
        return res.status(200).json({ reservations, reservationDuration: restaurant.reservation_duration_minutes });
    }
    catch (err) {
        next(err);
    }
    ;
}));
// router.route('/reservation/:section_id')
// .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
//     try {
//         const { restaurantInterface } = req;
//         if (restaurantInterface === undefined) { throw new UnauthorizedError() };
//         const restaurant = await Restaurant.findById(restaurantInterface.restaurant_id) as Restaurant | null;
//         if (restaurant === null) { throw new UnauthorizedError() };
//         const reservations = await Reservation.getReservationsByTableIDs([restaurant.id as string]); // incorrect
//         return res.status(200).json({ reservations });
//     } catch (err) {
//         next(err);
//     };
// })
exports.default = router;
