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
exports.RestaurantEmployee = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const uuid_1 = require("uuid");
const pg_format_1 = __importDefault(require("pg-format"));
class RestaurantEmployee extends DatabaseObject_1.DatabaseObject {
    constructor(employee_id, restaurant_id, employee_rank, employee_code, employment_status = "active", id = undefined) {
        const properties = {
            id,
            employee_id,
            restaurant_id,
            employee_rank,
            employee_code,
            employment_status
        };
        super(properties);
        this.employee_id = employee_id;
        this.restaurant_id = restaurant_id;
        this.employee_rank = employee_rank;
        this.employee_code = employee_code;
        this.employment_status = employment_status;
        this.id = id;
    }
    static findByPK(employee_id, restaurant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Restaurant_Employee WHERE employee_id = $1 AND restaurant_id = $2', [employee_id, restaurant_id]);
                if (res.rows.length == 0) {
                    return null;
                }
                else {
                    const restaurantEmployee = new RestaurantEmployee(res.rows[0].employee_id, res.rows[0].restaurant_id, res.rows[0].employee_rank, res.rows[0].employee_code, res.rows[0].employment_status, res.rows[0].id);
                    return restaurantEmployee;
                }
                ;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                yield _super.save.call(this);
                //
                const constructor = this.constructor;
                const reference = yield constructor.findByPK(this.employee_id, this.restaurant_id);
                const newUuid = (0, uuid_1.v4)();
                this.id = newUuid;
                const keys = Object.keys(this).filter(key => this[key] !== reference[key]);
                if (keys.length === 0) {
                    return;
                }
                let updatestr = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
                const parameters = keys.map(key => this[key]);
                console.log(newUuid, updatestr, this.employee_id, this.restaurant_id);
                return yield db_1.default.query((0, pg_format_1.default)('UPDATE restaurant_employee SET %s WHERE employee_id = $%s AND restaurant_id = $%s', updatestr, parameters.length + 1, parameters.length + 2), [...parameters, this.employee_id, this.restaurant_id]);
            }
            const reference = yield RestaurantEmployee.findById(this.id);
            if (!reference) {
                throw new Error('Unexpected Error');
            }
            return yield _super.save.call(this); // Ensure the parent save method is called for updates as well
        });
    }
    ;
    static findByEmployeeCode(employee_code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Restaurant_Employee WHERE employee_code = $1', [employee_code]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const row = res.rows[0];
                const restaurantEmployee = new RestaurantEmployee(row.employee_id, row.restaurant_id, row.employee_rank, row.employee_code, row.employment_status, row.id);
                return restaurantEmployee;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    static validateNewEmployeeCode(employee_code, restaurant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Restaurant_Employee WHERE employee_code = $1 AND restaurant_id = $2', [employee_code, restaurant_id]);
                if (res.rows.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
                ;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.RestaurantEmployee = RestaurantEmployee;
RestaurantEmployee.tableName = 'restaurant_employee';
module.exports = {
    RestaurantEmployee
};
