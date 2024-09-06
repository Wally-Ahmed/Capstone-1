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
exports.Restaurant = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expressError_1 = require("../__utilities__/expressError");
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const Menu_1 = require("./Menu"); // Import Menu from the same directory
const crypto_1 = __importDefault(require("crypto"));
const Layout_1 = require("./Layout");
const config_1 = require("../config");
const RestaurantInterface_1 = require("./RestaurantInterface");
const Tab_1 = require("./Tab");
const Reservation_1 = require("./Reservation");
const RestaurantTable_1 = require("./RestaurantTable");
class Restaurant extends DatabaseObject_1.DatabaseObject {
    constructor(restaurant_name, restaurant_address, email, phone_number, password_hash, id = undefined, active_layout_id = null, auth_token_hash = null, time_zone = null, time_until_first_reservation_minutes = 0, time_until_last_reservation_minutes = 0, reservation_duration_minutes = 60, monday_opening = null, tuesday_opening = null, wednesday_opening = null, thursday_opening = null, friday_opening = null, saturday_opening = null, sunday_opening = null, monday_closing = null, tuesday_closing = null, wednesday_closing = null, thursday_closing = null, friday_closing = null, saturday_closing = null, sunday_closing = null) {
        const properties = {
            id,
            restaurant_name,
            restaurant_address,
            email,
            phone_number,
            active_layout_id,
            password_hash,
            auth_token_hash,
            time_zone,
            time_until_first_reservation_minutes,
            time_until_last_reservation_minutes,
            reservation_duration_minutes,
            monday_opening,
            tuesday_opening,
            wednesday_opening,
            thursday_opening,
            friday_opening,
            saturday_opening,
            sunday_opening,
            monday_closing,
            tuesday_closing,
            wednesday_closing,
            thursday_closing,
            friday_closing,
            saturday_closing,
            sunday_closing,
        };
        super(properties);
        this.restaurant_name = restaurant_name;
        this.restaurant_address = restaurant_address;
        this.email = email;
        this.phone_number = phone_number;
        this.password_hash = password_hash;
        this.id = id;
        this.active_layout_id = active_layout_id;
        this.auth_token_hash = auth_token_hash;
        this.time_zone = time_zone;
        this.time_until_first_reservation_minutes = time_until_first_reservation_minutes;
        this.time_until_last_reservation_minutes = time_until_last_reservation_minutes;
        this.reservation_duration_minutes = reservation_duration_minutes;
        this.monday_opening = monday_opening;
        this.tuesday_opening = tuesday_opening;
        this.wednesday_opening = wednesday_opening;
        this.thursday_opening = thursday_opening;
        this.friday_opening = friday_opening;
        this.saturday_opening = saturday_opening;
        this.sunday_opening = sunday_opening;
        this.monday_closing = monday_closing;
        this.tuesday_closing = tuesday_closing;
        this.wednesday_closing = wednesday_closing;
        this.thursday_closing = thursday_closing;
        this.friday_closing = friday_closing;
        this.saturday_closing = saturday_closing;
        this.sunday_closing = sunday_closing;
    }
    ;
    // static getTablenName(): string {
    //     return this.tableName;
    // };
    static authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 
                // Decode the token to check its structure without verifying
                // const decodedToken = jwt.decode(token);
                // 
                // Verify the token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
                // 
                // Check if decoded is an object and has an 'id' property
                if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
                    throw new expressError_1.UnauthorizedError('Invalid token');
                }
                const user = yield Restaurant.findById(decoded.id);
                if (!user) {
                    throw new expressError_1.UnauthorizedError('User not found');
                }
                if (user.auth_token_hash === null) {
                    throw new expressError_1.UnauthorizedError('Token hash not found');
                }
                const matchStore = yield bcrypt_1.default.compare(decoded.code, user.auth_token_hash);
                if (!matchStore) {
                    throw new expressError_1.UnauthorizedError('Token mismatch');
                }
                return user;
            }
            catch (err) {
                // 
                if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new expressError_1.UnauthorizedError('Invalid token');
                }
                throw err;
            }
        });
    }
    ;
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Restaurant WHERE email = $1', [email]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const row = res.rows[0];
                const restaurant = new Restaurant(row.restaurant_name, row.restaurant_address, row.email, row.phone_number, row.password_hash, row.id, row.active_layout_id, row.auth_token_hash, row.time_zone, row.time_until_first_reservation_minutes, row.time_until_last_reservation_minutes, row.reservation_duration_minutes, row.monday_opening, row.tuesday_opening, row.wednesday_opening, row.thursday_opening, row.friday_opening, row.saturday_opening, row.sunday_opening, row.monday_closing, row.tuesday_closing, row.wednesday_closing, row.thursday_closing, row.friday_closing, row.saturday_closing, row.sunday_closing);
                return restaurant;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    static findByPhoneNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Restaurant WHERE phone_number = $1', [number]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const row = res.rows[0];
                const restaurant = new Restaurant(row.restaurant_name, row.restaurant_address, row.email, row.phone_number, row.password_hash, row.id, row.active_layout_id, row.auth_token_hash, row.time_zone, row.time_until_first_reservation_minutes, row.time_until_last_reservation_minutes, row.reservation_duration_minutes, row.monday_opening, row.tuesday_opening, row.wednesday_opening, row.thursday_opening, row.friday_opening, row.saturday_opening, row.sunday_opening, row.monday_closing, row.tuesday_closing, row.wednesday_closing, row.thursday_closing, row.friday_closing, row.saturday_closing, row.sunday_closing);
                return restaurant;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    authenticate(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = yield bcrypt_1.default.compare(password, this.password_hash);
                if (!isValid) {
                    const err = new expressError_1.UnauthorizedError('Invalid password');
                    throw err;
                }
                ;
                const token = yield this._setToken();
                const decoded = jsonwebtoken_1.default.decode(token);
                if (!decoded) {
                    throw new expressError_1.ExpressError('Failed to generate token', 500);
                }
                const token_hash = yield bcrypt_1.default.hash(decoded.code, 3);
                this.auth_token_hash = token_hash;
                yield this.save();
                return token;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    getRestaurantInterfaces() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT id, interface_name, link_code, tablemap_permission, tab_permission, kitchen_permission, shift_permission FROM Restaurant_Interface WHERE restaurant_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const RestaurantInterfaces = res.rows.map((row) => new RestaurantInterface_1.RestaurantInterface(this.id, row.interface_name, row.tablemap_permission, row.tab_permission, row.kitchen_permission, row.shift_permission, row.time_created, row.link_code, row.token_code, row.id));
                return RestaurantInterfaces;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    getRestaurantEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT re.id, re.employee_rank, re.employment_status, re.employee_id, re.restaurant_id, e.employee_name, e.employee_email FROM Restaurant_Employee re JOIN Employee e ON re.employee_id = e.id WHERE re.restaurant_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const EmployeeInfo = res.rows.map((row) => { return Object.assign({}, row); });
                return EmployeeInfo;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    getTablesInActiveLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT rt.* FROM restaurant_table rt JOIN section s ON rt.section_id = s.id JOIN layout l ON s.layout_id = l.id WHERE l.id = $1;`, [this.active_layout_id]);
                const tables = res.rows.map((row) => { return new RestaurantTable_1.RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id); });
                return tables;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
    getMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the Menu table for menus belonging to this restaurant
                const res = yield db_1.default.query('SELECT * FROM Menu WHERE restaurant_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new Menu instance
                const menus = res.rows.map((row) => {
                    // Extract the necessary properties from the row
                    const { id, menu_title, restaurant_id } = row;
                    return new Menu_1.Menu(menu_title, restaurant_id, id);
                });
                return menus;
            }
            catch (err) {
                throw err;
            }
        });
    }
    ;
    getLayouts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Layout WHERE restaurant_id = $1', [this.id]);
                const layouts = res.rows.map((row) => {
                    // Extract the necessary properties from the row
                    const { id, layout_name, restaurant_id } = row;
                    return new Layout_1.Layout(layout_name, restaurant_id, id);
                });
                return layouts;
            }
            catch (err) {
                throw err;
            }
        });
    }
    ;
    getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Reservation WHERE restaurant_id = $1', [this.id]);
                const reservations = res.rows.map((row) => {
                    return new Reservation_1.Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id);
                });
                return reservations;
            }
            catch (err) {
                throw err;
            }
        });
    }
    ;
    getTabs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the Tab table for tabs belonging to this restaurant
                const res = yield db_1.default.query("SELECT * FROM Tab WHERE restaurant_id = $1 AND tab_status = 'open'", [this.id]);
                // Map over the resulting rows and turn each one into a new Tab instance
                const tabs = res.rows.map((row) => {
                    return new Tab_1.Tab(row.customer_name, row.server_restaurant_employee_id, row.restaurant_table_id, row.restaurant_id, row.tab_status, row.discount, row.calculated_tax, row.total_tip, row.id);
                });
                return tabs;
            }
            catch (err) {
                throw err;
            }
        });
    }
    ;
    _setToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                id: this.id,
                iat: Math.floor(Date.now() / 1000),
                code: crypto_1.default.randomBytes(16).toString('hex'),
            }, config_1.secretKey, { expiresIn: '3h' });
            return token;
        });
    }
}
exports.Restaurant = Restaurant;
Restaurant.tableName = 'restaurant';
;
module.exports = {
    Restaurant // The class definition will be added by you
};
