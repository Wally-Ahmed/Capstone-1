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
const TipPool_1 = require("../../models/TipPool");
const RestaurantEmployee_1 = require("../../models/RestaurantEmployee");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const shiftSchema_1 = __importDefault(require("./schemas/shiftSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(shiftSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { employee_code } = req.body;
        const restaurant = yield Restaurant_1.Restaurant.findById(restaurantInterface.restaurant_id);
        if (restaurant === null) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurantEmployee = yield RestaurantEmployee_1.RestaurantEmployee.findByEmployeeCode(employee_code);
        if (restaurantEmployee === null) {
            throw new expressError_1.NotFoundError('Invalid Employee code');
        }
        ;
        const currentDate = new Date();
        let tipPool = yield TipPool_1.TipPool.findByDate(currentDate);
        if (tipPool === null) {
            tipPool = new TipPool_1.TipPool(restaurantInterface.restaurant_id, currentDate, 0);
            yield tipPool.save();
        }
        ;
        const restaurantEmployeeIds = (yield Shift_1.Shift.getActiveShiftsByRestaurantID(restaurant.id)).map((shift) => { return shift.restaurant_employee_id; });
        if (restaurantEmployeeIds.includes(restaurantEmployee.id)) {
            throw new expressError_1.ForbiddenError('Employee already has an active shift');
        }
        ;
        const shift = new Shift_1.Shift(currentDate, restaurant.id, tipPool.id, restaurantEmployee.id);
        yield shift.save();
        namespace_1.shiftNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(201);
    }
    catch (err) {
        namespace_1.shiftNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
router.route('/:shift_id/')
    .post(authenticateToken_1.authenticateInterface, (0, validateSchema_1.validateSchema)(shiftSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantInterface = req.restaurantInterface;
    try {
        const { shift_id } = req.params;
        // const { exit_code }: { exit_code: string } = req.body;
        const { employee_code } = req.body;
        const shift = yield Shift_1.Shift.findById(shift_id);
        if (!shift) {
            throw new expressError_1.NotFoundError('Shift not found');
        }
        ;
        const restaurantEmployee = yield RestaurantEmployee_1.RestaurantEmployee.findByEmployeeCode(employee_code);
        if (!restaurantEmployee) {
            throw new expressError_1.BadRequestError("Invalid Employee Code");
        }
        else if (restaurantEmployee.id === shift.restaurant_employee_id) {
            shift.exit_code = 'employee-exit';
        }
        else if (restaurantEmployee.employee_rank === 'admin' || restaurantEmployee.employee_rank === 'manager') {
            shift.exit_code = 'manager-exit';
        }
        else {
            throw new expressError_1.BadRequestError("Must provide the employee code of the selected employee or the employee code of a manager or the admin");
        }
        shift.end_date_time = new Date();
        shift.save();
        namespace_1.shiftNsp.to(restaurantInterface.restaurant_id).emit('update');
        return res.sendStatus(200);
    }
    catch (err) {
        namespace_1.shiftNsp.to(restaurantInterface.restaurant_id).emit('update');
        next(err);
    }
    ;
}));
exports.default = router;
