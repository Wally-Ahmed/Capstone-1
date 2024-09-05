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
exports.authenticateInterface = exports.authenticateEmployee = exports.authenticateAdmin = void 0;
const express_1 = __importDefault(require("express"));
const expressError_1 = require("./expressError");
const Restaurant_1 = require("../models/Restaurant");
const Employee_1 = require("../models/Employee");
const RestaurantInterface_1 = require("../models/RestaurantInterface");
const router = express_1.default.Router();
router.use(express_1.default.json());
// Middleware to authenticate tokens
function authenticateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            if (!token) {
                throw new expressError_1.UnauthorizedError('No token provided');
            }
            ;
            const restaurant = yield Restaurant_1.Restaurant.authorize(token);
            if (!restaurant) {
                throw new expressError_1.UnauthorizedError('Invalid Token');
            }
            ;
            req.restaurant = restaurant;
            next();
        }
        catch (error) {
            const message = error.message || "Unauthorized: Invalid or expired token";
            res.status(401).json({ message });
        }
    });
}
exports.authenticateAdmin = authenticateAdmin;
;
function authenticateEmployee(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            if (!token) {
                throw new expressError_1.UnauthorizedError('No token provided');
            }
            ;
            const { user: employee, col } = yield Employee_1.Employee.authorize(token);
            if (!employee) {
                throw new expressError_1.UnauthorizedError('Invalid Token');
            }
            ;
            req.employee = employee;
            req.colNum = col;
            next();
        }
        catch (error) {
            const message = error.message || "Unauthorized: Invalid or expired token";
            res.status(401).json({ message });
        }
    });
}
exports.authenticateEmployee = authenticateEmployee;
;
function authenticateInterface(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            if (!token) {
                throw new expressError_1.UnauthorizedError('No token provided');
            }
            ;
            const { user: restaurantInterface } = yield RestaurantInterface_1.RestaurantInterface.authorize(token);
            // console.log('hit hit', restaurantInterface)
            if (!restaurantInterface) {
                throw new expressError_1.UnauthorizedError('Invalid Token');
            }
            ;
            req.restaurantInterface = restaurantInterface;
            next();
        }
        catch (error) {
            const message = error.message || "Unauthorized: Invalid or expired token";
            res.status(401).json({ message });
        }
    });
}
exports.authenticateInterface = authenticateInterface;
;
module.exports = { authenticateAdmin, authenticateEmployee, authenticateInterface };
