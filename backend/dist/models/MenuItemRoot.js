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
exports.MenuItemRoot = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const MenuItemVariation_1 = require("./MenuItemVariation"); // Import MenuItemVariation from the same directory
class MenuItemRoot extends DatabaseObject_1.DatabaseObject {
    constructor(menu_section_id, position, menu_item_root_name, base_price, menu_item_root_description, prep_time_required, id = undefined) {
        const properties = {
            id,
            menu_section_id,
            position,
            menu_item_root_name,
            base_price,
            menu_item_root_description,
            prep_time_required
        };
        super(properties);
        this.menu_section_id = menu_section_id;
        this.position = position;
        this.menu_item_root_name = menu_item_root_name;
        this.base_price = base_price;
        this.menu_item_root_description = menu_item_root_description;
        this.prep_time_required = prep_time_required;
        this.id = id;
    }
    ;
    static getItemsBySectionID(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Menu_item_root WHERE menu_section_id = ANY($1)`, [IdArray]);
                const menuItemRoots = res.rows.map((row) => { return new MenuItemRoot(row.menu_section_id, row.position, row.menu_item_root_name, row.base_price, row.menu_item_root_description, row.prep_time_required, row.id); });
                return menuItemRoots;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
    getMenuItemVariations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuItemVariation table for MenuItemVariation belonging to this MenuItemRoot
                const res = yield db_1.default.query('SELECT * FROM menu_item_variation WHERE menu_item_root_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuItemVariation instance
                const menuItemVariations = res.rows.map((row) => new MenuItemVariation_1.MenuItemVariation(row.menu_item_root_id, row.menu_item_variation_description, row.price_difference, row.id));
                menuItemVariations.sort((a, b) => {
                    if (a.description === 'No change' && b.description !== 'No change')
                        return -1;
                    if (a.description !== 'No change' && b.description === 'No change')
                        return 1;
                    return 0;
                });
                return menuItemVariations;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.MenuItemRoot = MenuItemRoot;
MenuItemRoot.tableName = 'menu_item_root';
;
module.exports = {
    MenuItemRoot
};
