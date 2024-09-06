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
exports.RestaurantInterface = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const expressError_1 = require("../__utilities__/expressError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
class RestaurantInterface extends DatabaseObject_1.DatabaseObject {
    constructor(restaurant_id, interface_name, tablemap_permission, tab_permission, kitchen_permission, shift_permission, time_created = new Date(), link_code = null, token_code = null, id = undefined) {
        const properties = {
            id,
            interface_name,
            restaurant_id,
            tablemap_permission,
            tab_permission,
            kitchen_permission,
            shift_permission,
            time_created,
            token_code,
            link_code
        };
        super(properties);
        this.restaurant_id = restaurant_id;
        this.interface_name = interface_name;
        this.tablemap_permission = tablemap_permission;
        this.tab_permission = tab_permission;
        this.kitchen_permission = kitchen_permission;
        this.shift_permission = shift_permission;
        this.time_created = time_created;
        this.link_code = link_code;
        this.token_code = token_code;
        this.id = id;
    }
    static findByLinkCode(employeeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM restaurant_interface WHERE link_code = $1', [employeeCode]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const employee = new RestaurantInterface(res.rows[0].restaurant_id, res.rows[0].interface_name, res.rows[0].tablemap_permission, res.rows[0].tab_permission, res.rows[0].kitchen_permission, res.rows[0].shift_permission, res.rows[0].time_created, res.rows[0].link_code, res.rows[0].token_code, res.rows[0].id);
                return employee;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    static authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
                // Check if decoded is an object and has the 'id' and 'col' properties
                if (!(decoded !== null && decoded.id)) {
                    throw new expressError_1.UnauthorizedError('Invalid token');
                }
                const user = yield RestaurantInterface.findById(decoded.id);
                if (user === null) {
                    throw new expressError_1.UnauthorizedError('Invalid or expired token');
                }
                if (decoded.code !== user.token_code) {
                    throw new expressError_1.UnauthorizedError('Invalid token');
                }
                return { user };
            }
            catch (err) {
                throw err;
            }
        });
    }
    _setToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate an authentication token
            const token_code = crypto_1.default.randomBytes(16).toString('hex');
            const token = jsonwebtoken_1.default.sign({
                id: this.id,
                iat: (new Date()).getTime(),
                code: token_code,
            }, config_1.secretKey);
            const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
            // Hash the authentication token and save the hashed token to the database
            // const token_hash = await bcrypt.hash(token, 3);
            this.token_code = token_code;
            yield this.save();
            return token;
        });
    }
    ;
}
exports.RestaurantInterface = RestaurantInterface;
RestaurantInterface.tableName = 'restaurant_interface';
module.exports = {
    RestaurantInterface
};
