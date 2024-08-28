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
exports.Shift = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
;
class Shift extends DatabaseObject_1.DatabaseObject {
    constructor(start_date_time, restaurant_id, tip_pool_id, restaurant_employee_id, end_date_time = null, exit_code = null, id = undefined) {
        const properties = {
            id,
            start_date_time,
            end_date_time,
            exit_code,
            restaurant_id,
            tip_pool_id,
            restaurant_employee_id,
        };
        super(properties);
        this.start_date_time = start_date_time;
        this.restaurant_id = restaurant_id;
        this.tip_pool_id = tip_pool_id;
        this.restaurant_employee_id = restaurant_employee_id;
        this.end_date_time = end_date_time;
        this.exit_code = exit_code;
        this.id = id;
    }
    static getActiveShiftsByRestaurantID(restaurant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`
                SELECT 
                    shift.id,
                    shift.start_date_time,
                    restaurant_employee.id AS restaurant_employee_id,
                    employee.employee_name
                FROM 
                    shift
                JOIN 
                    restaurant_employee ON shift.restaurant_employee_id = restaurant_employee.id
                JOIN 
                    employee ON restaurant_employee.employee_id = employee.id
                WHERE 
                    shift.restaurant_id = $1 
                    AND shift.end_date_time IS NULL;
                `, [restaurant_id]);
                const shifts = res.rows.map((row) => {
                    return {
                        id: row.id,
                        start_date_time: row.start_date_time,
                        employee_name: row.employee_name,
                        restaurant_employee_id: row.restaurant_employee_id,
                    };
                });
                return shifts;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Shift = Shift;
Shift.tableName = 'shift';
module.exports = {
    Shift
};
