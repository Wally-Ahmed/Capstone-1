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
const crypto_1 = __importDefault(require("crypto"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Restaurant_1 = require("../../models/Restaurant");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const restaurantSchema_1 = __importDefault(require("./schemas/restaurantSchema"));
const Employee_1 = require("../../models/Employee");
const RestaurantEmployee_1 = require("../../models/RestaurantEmployee");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/signup', (0, validateSchema_1.validateSchema)(restaurantSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant_name, restaurant_address, email, phone, password, confirmPassword, } = req.body;
    try {
        if (!restaurant_name || !restaurant_address || !email || !phone || !password || !confirmPassword) {
            throw new expressError_1.BadRequestError("Required parameters are missing.");
        }
        ;
        if (password !== confirmPassword) {
            throw new expressError_1.BadRequestError("Password and confirmation password do not match.");
        }
        ;
        if ((yield Restaurant_1.Restaurant.findByEmail(email)) !== null) {
            throw new expressError_1.BadRequestError("An account using the email already exists");
        }
        ;
        if ((yield Restaurant_1.Restaurant.findByPhoneNumber(phone)) !== null) {
            throw new expressError_1.BadRequestError("An account using the phone number already exists");
        }
        ;
        if ((yield Employee_1.Employee.findByEmail(email)) !== null) {
            throw new expressError_1.ForbiddenError('An employee account already exists for this email, please deactivae that account first or try another email.');
        }
        ;
        const password_hash = yield bcrypt_1.default.hash(password, 10); // Hash the password
        let employee_code;
        const user = new Restaurant_1.Restaurant(restaurant_name, restaurant_address, email, phone, password_hash);
        yield user.save();
        while (true) {
            employee_code = crypto_1.default.randomBytes(4).toString('hex');
            const valid = yield RestaurantEmployee_1.RestaurantEmployee.validateNewEmployeeCode(employee_code, user.id);
            if (valid) {
                break;
            }
            ;
        }
        ;
        const employee = new Employee_1.Employee(`${restaurant_name} Admin`, email, phone, password_hash);
        yield employee.save();
        const employment = new RestaurantEmployee_1.RestaurantEmployee(employee.id, user.id, 'admin', employee_code);
        yield employment.save();
        const token = yield user.authenticate(password);
        return res.status(201).json({ token });
    }
    catch (err) {
        return next(err);
    }
    ;
}));
// User login route
router.post('/login', (0, validateSchema_1.validateSchema)(restaurantSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        if (!email || !password) { }
        ;
        const restaurant = yield Restaurant_1.Restaurant.findByEmail(email);
        if (!restaurant) {
            throw new expressError_1.NotFoundError();
        }
        ;
        const token = yield restaurant.authenticate(password);
        if (!token) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        return res.status(200).json({ token });
    }
    catch (err) {
        if (err instanceof expressError_1.ExpressError) {
            if (err.status >= 400 && err.status < 500) {
                next(new expressError_1.UnauthorizedError('Invalid username or password.'));
            }
            else {
                next(err);
            }
        }
        else {
            // Handle non-ExpressError cases
            next(new expressError_1.ExpressError('An unexpected error occurred.', 500));
        }
    }
    ;
}));
// User logout route
router.post('/logout', authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = req.restaurant;
        ;
        if (!restaurant) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        restaurant.auth_token_hash = null;
        yield restaurant.save();
        return res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
    ;
}));
// Validate login route
router.post('/validate-login', authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = req.restaurant;
        ;
        if (!restaurant) {
            throw new expressError_1.BadRequestError('Token is invalid.');
        }
        ;
        const user = {
            restaurant_name: restaurant.restaurant_name,
            restaurant_address: restaurant.restaurant_address,
            email: restaurant.email,
            phone_number: restaurant.phone_number,
            active_layout_id: restaurant.active_layout_id
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
