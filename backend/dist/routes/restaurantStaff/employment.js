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
const crypto_1 = __importDefault(require("crypto"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Employee_1 = require("../../models/Employee");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const employeeSchema_1 = __importDefault(require("./schemas/employeeSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/employeecode')
    .get(authenticateToken_1.authenticateEmployee, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employee } = req;
        if (employee === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        // console.log(employee)
        res.status(200).json({ code: employee.employee_code });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .post(authenticateToken_1.authenticateEmployee, (0, validateSchema_1.validateSchema)(employeeSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employee } = req;
        if (employee === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const code = crypto_1.default.randomBytes(6).toString('hex');
        const oldE = yield Employee_1.Employee.findByEmployeeCode(code);
        if (oldE !== null) {
            oldE.employee_code = null;
            oldE.save();
        }
        ;
        employee.employee_code = code;
        yield employee.save();
        res.status(200).json({ code: employee.employee_code });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/employment')
    .get(authenticateToken_1.authenticateEmployee, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employee } = req;
        if (employee === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const restaurants = yield employee.getRestaurantEmployees();
        res.status(200).json({ restaurants });
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
