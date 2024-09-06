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
exports.Section = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const RestaurantTable_1 = require("./RestaurantTable"); // Import RestaurantTable from the same directory
class Section extends DatabaseObject_1.DatabaseObject {
    constructor(section_name, width, height, position, layout_id, id = undefined) {
        const properties = {
            id,
            section_name,
            width,
            height,
            position,
            layout_id
        };
        super(properties);
        this.section_name = section_name;
        this.width = width;
        this.height = height;
        this.position = position;
        this.layout_id = layout_id;
        this.id = id;
    }
    getTablesOutDimensions(width = 1, height = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM Restaurant_table WHERE section_id = $1 AND (x >= $2 OR y >= $3)';
                const res = yield db_1.default.query(query, [this.id, width, height]);
                const restaurantTables = res.rows.map((row) => {
                    return new RestaurantTable_1.RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id);
                });
                return restaurantTables;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT * FROM restaurant_table WHERE section_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const restaurantTables = res.rows.map((row) => new RestaurantTable_1.RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id));
                return restaurantTables;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Section = Section;
Section.tableName = 'section';
module.exports = {
    Section
};
