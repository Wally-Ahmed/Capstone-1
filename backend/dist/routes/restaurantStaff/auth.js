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
const bcrypt_1 = __importDefault(require("bcrypt"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Employee_1 = require("../../models/Employee");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const employeeSchema_1 = __importDefault(require("./schemas/employeeSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
// User signup route
router.post('/signup', (0, validateSchema_1.validateSchema)(employeeSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { employee_name, employee_email, employee_phone, password, confirmPassword } = req.body;
    try {
        if (!employee_name || !employee_email || !employee_phone || !password || !confirmPassword) {
            throw new expressError_1.BadRequestError("Required data is missing or improperly formatted.");
        }
        ;
        if (password !== confirmPassword) {
            throw new Error("Password and confirmation password do not match.");
        }
        ;
        const password_hash = yield bcrypt_1.default.hash(password, 10); // Hash the password
        let user = new Employee_1.Employee(employee_name, employee_email, employee_phone, password_hash);
        yield user.save();
        const token = yield user.authenticate(password);
        res.status(201).json({ token });
    }
    catch (err) {
        console.dir(err);
        return next(err);
    }
    ;
}));
// User login route
router.post('/login', (0, validateSchema_1.validateSchema)(employeeSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employee_email, password } = req.body;
        const employee = yield Employee_1.Employee.findByEmail(employee_email);
        if (!employee) {
            throw new expressError_1.NotFoundError('employee not forund');
        }
        ;
        const token = yield employee.authenticate(password);
        if (!token) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        res.status(200).json({ token });
    }
    catch (error) {
        console.dir(error);
        if (error instanceof expressError_1.ExpressError) {
            if (error.status >= 400 && error.status < 500) {
                next(new expressError_1.UnauthorizedError('Invalid email or password.'));
            }
            else {
                next(error);
            }
        }
        else {
            // Handle non-ExpressError cases
            next(new Error('An unexpected error occurred.'));
        }
    }
    ;
}));
// User logout route
router.post('/logout', authenticateToken_1.authenticateEmployee, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = req.employee;
        const colNum = req.colNum;
        if (!employee) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        switch (colNum) {
            case 'auth_token1':
                employee.auth_token1 = null;
                break;
            case 'auth_token2':
                employee.auth_token2 = null;
                break;
            case 'auth_token3':
                employee.auth_token3 = null;
                break;
            case 'auth_token4':
                employee.auth_token4 = null;
                break;
            default:
                throw new expressError_1.UnauthorizedError('Invalid token.');
        }
        ;
        yield employee.save();
        return res.sendStatus(200);
    }
    catch (err) {
        console.dir(err);
        next(err);
    }
    ;
}));
// Validate login route
router.post('/validate-login', authenticateToken_1.authenticateEmployee, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = req.employee;
        ;
        if (!employee) {
            throw new expressError_1.BadRequestError('Token is invalid.');
        }
        ;
        const user = {
            employee_name: employee.employee_name,
            email: employee.employee_email,
            phone_number: employee.employee_phone,
            code: employee.employee_code,
        };
        return res.status(200).json({ user, validated: true });
    }
    catch (err) {
        const error = err;
        const statusCode = error.status ? error.status : 500;
        return res.status(statusCode).json({ validated: false });
    }
    ;
}));
exports.default = router;
