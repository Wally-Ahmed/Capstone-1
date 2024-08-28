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
const crypto_1 = __importDefault(require("crypto"));
const RestaurantInterface_1 = require("../../models/RestaurantInterface");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const restaurantInterfaceSchema_1 = __importDefault(require("./schemas/restaurantInterfaceSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/interface')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantInterfaces = yield restaurant.getRestaurantInterfaces();
        res.status(200).json({ restaurantInterfaces });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(restaurantInterfaceSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interface_name, tablemap_permission, tab_permission, kitchen_permission, shift_permission } = req.body;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantInterface = new RestaurantInterface_1.RestaurantInterface(restaurant.id, interface_name || '', tablemap_permission || false, tab_permission || false, kitchen_permission || false, shift_permission || false);
        yield restaurantInterface.save();
        res.status(201).json({ restaurantInterface });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/interface/:interface_id')
    .post(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interface_id } = req.params;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantInterface = yield RestaurantInterface_1.RestaurantInterface.findById(interface_id);
        if (restaurantInterface === null) {
            throw new expressError_1.NotFoundError('Restaurant Interface not found');
        }
        ;
        let code;
        while (true) {
            code = crypto_1.default.randomBytes(6).toString('hex');
            const oldI = yield RestaurantInterface_1.RestaurantInterface.findByLinkCode(code);
            if (oldI === null) {
                break;
            }
            ;
        }
        ;
        restaurantInterface.link_code = code;
        restaurantInterface.save();
        res.status(200).json({ restaurantInterface });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(restaurantInterfaceSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interface_id } = req.params;
    // Destructure all possible parameters
    const { interface_name, tablemap_permission, tab_permission, kitchen_permission, shift_permission } = req.body;
    // Prepare the updates object
    const updates = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (interface_name !== undefined && { interface_name })), (tablemap_permission !== undefined && { tablemap_permission })), (tab_permission !== undefined && { tab_permission })), (kitchen_permission !== undefined && { kitchen_permission })), (shift_permission !== undefined && { shift_permission }));
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantInterface = yield RestaurantInterface_1.RestaurantInterface.findById(interface_id);
        if (restaurantInterface === null) {
            throw new expressError_1.NotFoundError('Restaurant Interface not found');
        }
        ;
        // Update the restaurant instance with new values
        Object.keys(updates).forEach(key => {
            restaurantInterface[key] = updates[key];
        });
        // Save the updated restaurant back to the database
        console.log(restaurantInterface);
        yield restaurantInterface.save();
        res.status(200).json({ restaurantInterface });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interface_id } = req.params;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantInterface = yield RestaurantInterface_1.RestaurantInterface.findById(interface_id);
        if (restaurantInterface === null) {
            throw new expressError_1.NotFoundError('Restaurant Interface not found');
        }
        ;
        yield restaurantInterface.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
