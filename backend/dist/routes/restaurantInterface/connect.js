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
const RestaurantInterface_1 = require("../../models/RestaurantInterface");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const connectSchema_1 = __importDefault(require("./schemas/connectSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
// Validate link route
router.post('/validate-link', authenticateToken_1.authenticateInterface, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('hit')
        const restaurantInterface = req.restaurantInterface;
        const user = { tablemap_permission: restaurantInterface.tablemap_permission, tab_permission: restaurantInterface.tab_permission, kitchen_permission: restaurantInterface.kitchen_permission, shift_permission: restaurantInterface.shift_permission };
        return res.status(200).json({ user, validated: true });
    }
    catch (err) {
        const error = err;
        const statusCode = error.status ? error.status : 500;
        return res.status(statusCode).json({ validated: false });
    }
    ;
}));
router.route('/link')
    // .get(authenticateInterface, async (req: InterfaceRequest, res: Response, next: NextFunction) => {
    //     try {
    //         const restaurantInterface = req.restaurantInterface as RestaurantInterface;
    //         restaurantInterface.shift_permission;
    //         res.status(200).json({ tablemap_permission: restaurantInterface.tablemap_permission, tab_permission: restaurantInterface.tab_permission, kitchen_permission: restaurantInterface.kitchen_permission, shift_permission: restaurantInterface.shift_permission });
    //     } catch (err) {
    //         next(err);
    //     };
    // })
    .post((0, validateSchema_1.validateSchema)(connectSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link_code } = req.body;
        const restaurantInterface = yield RestaurantInterface_1.RestaurantInterface.findByLinkCode(link_code);
        if (restaurantInterface === null) {
            throw new expressError_1.NotFoundError('Code is invalid');
        }
        ;
        const token = yield restaurantInterface._setToken();
        // console.log('hitterrr1', `${token}`)
        res.status(200).json({ token });
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
