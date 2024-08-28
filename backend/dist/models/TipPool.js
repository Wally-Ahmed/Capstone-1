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
exports.TipPool = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class TipPool extends DatabaseObject_1.DatabaseObject {
    constructor(restaurant_id, date, amount, id = undefined) {
        const properties = {
            restaurant_id,
            date,
            id,
            amount
        };
        super(properties);
        this.restaurant_id = restaurant_id;
        this.date = date;
        this.amount = amount;
        this.id = id;
    }
    static findByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM tip_pool WHERE date = $1`, [date]);
                if (res.rows.length > 0) {
                    const row = res.rows[0];
                    return new TipPool(row.restaurant_id, row.date, row.amount, row.id);
                }
                else {
                    return null;
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
exports.TipPool = TipPool;
TipPool.tableName = 'tip_pool';
;
module.exports = { TipPool };
