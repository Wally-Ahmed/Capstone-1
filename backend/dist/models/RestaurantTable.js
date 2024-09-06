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
exports.RestaurantTable = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class RestaurantTable extends DatabaseObject_1.DatabaseObject {
    constructor(table_name, table_status, reservable, seats, x, y, section_id, id = undefined) {
        const properties = {
            id,
            table_name,
            table_status,
            reservable,
            seats,
            x,
            y,
            section_id,
        };
        super(properties);
        this.table_name = table_name;
        this.table_status = table_status;
        this.reservable = reservable;
        this.seats = seats;
        this.x = x;
        this.y = y;
        this.section_id = section_id;
        this.id = id;
    }
    ;
    static findByLocation(section_id, x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Restaurant_table WHERE section_id = $1 AND x = $2 AND y = $3`, [section_id, x, y]);
                if (res.rows.length) {
                    const row = res.rows[0];
                    return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id);
                }
                else {
                    return null; // Or however you wish to handle not finding the entry
                }
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
    static getTablesBySectionIDs(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Restaurant_table WHERE section_id = ANY($1)`, [IdArray]);
                const tables = res.rows.map((row) => { return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id); });
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
}
exports.RestaurantTable = RestaurantTable;
RestaurantTable.tableName = 'restaurant_table';
module.exports = {
    RestaurantTable
};
