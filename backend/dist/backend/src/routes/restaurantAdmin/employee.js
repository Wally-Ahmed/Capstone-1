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
const Employee_1 = require("../../models/Employee");
const RestaurantEmployee_1 = require("../../models/RestaurantEmployee");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const employeeSchema_1 = __importDefault(require("./schemas/employeeSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/employee')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const employees = yield restaurant.getRestaurantEmployees();
        res.status(200).json({ employees });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/employee/link')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(employeeSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant } = req;
    const { code } = req.body;
    console.log('hit');
    try {
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const employee = yield Employee_1.Employee.findByEmployeeCode(code);
        if (employee === null) {
            throw new expressError_1.NotFoundError('Code is invalid');
        }
        ;
        let employee_code;
        while (true) {
            employee_code = crypto_1.default.randomBytes(4).toString('hex');
            const valid = yield RestaurantEmployee_1.RestaurantEmployee.validateNewEmployeeCode(employee_code, restaurant.id);
            if (valid) {
                break;
            }
            ;
        }
        ;
        const employment = new RestaurantEmployee_1.RestaurantEmployee(employee.id, restaurant.id, "employee", employee_code);
        console.log('hit', restaurant);
        yield employment.save();
        employee.employee_code = null;
        return res.status(201).json({ employment_info: employment });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/employee/link/:employment_id')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(employeeSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employment_id } = req.params;
    const { employee_rank } = req.body;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const employment = yield RestaurantEmployee_1.RestaurantEmployee.findById(employment_id);
        if (employment === null) {
            throw new expressError_1.NotFoundError('Restaurant Employment details were not found');
        }
        ;
        if (employee_rank) {
            employment.employee_rank = employee_rank;
        }
        ;
        yield employment.save();
        return res.status(200).json({ employment_info: employment });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employment_id } = req.params;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        if (employment_id === undefined) {
            throw new expressError_1.BadRequestError('Required values missing');
        }
        ;
        const employment = yield RestaurantEmployee_1.RestaurantEmployee.findById(employment_id);
        if (employment === null) {
            throw new expressError_1.NotFoundError('Restaurant Employment details were not found');
        }
        ;
        yield employment.delete();
        return res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
