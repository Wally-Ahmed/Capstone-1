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
exports.MenuSection = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const MenuItemRoot_1 = require("./MenuItemRoot"); // Import MenuItemRoot from the same directory
class MenuSection extends DatabaseObject_1.DatabaseObject {
    constructor(menu_id, position, menu_section_title, id = undefined) {
        const properties = {
            id,
            menu_id,
            position,
            menu_section_title
        };
        super(properties);
        this.menu_id = menu_id;
        this.position = position;
        this.menu_section_title = menu_section_title;
        this.id = id;
    }
    ;
    // static async getSectionsByMenuID(IdArray: string[]) {
    //     try {
    //         const res = await db.query(`SELECT * FROM Menu_section WHERE menu_id = ANY($1)`, [IdArray]);
    //         if (res.rows.length) {
    //             const menuSections = res.rows.map((row: MenuSectionProperties) => { return new MenuSection(row.menu_id, row.position, row.menu_section_title, row.id) })
    //             return menuSections;
    //         } else {
    //             return null; // Or however you wish to handle not finding the entry
    //         }
    //     } catch (err) {
    //         // Handle or throw error
    //         throw err;
    //     };
    // };
    getMenuItemRoots() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT * FROM Menu_item_root WHERE menu_section_id = $1 ORDER BY position ASC', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const menuItemRoots = res.rows.map((row) => new MenuItemRoot_1.MenuItemRoot(row.menu_section_id, row.position, row.menu_item_root_name, row.base_price, row.menu_item_root_description, row.prep_time_required, row.id));
                menuItemRoots.forEach((item, index) => __awaiter(this, void 0, void 0, function* () { if (item.position !== index) {
                    item.position = index;
                    yield item.save();
                } ; }));
                return menuItemRoots;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    reindexMenuItemRoots() {
        return __awaiter(this, void 0, void 0, function* () {
            const menuItemRoots = yield this.getMenuItemRoots();
            return menuItemRoots;
        });
    }
    ;
}
exports.MenuSection = MenuSection;
MenuSection.tableName = 'menu_section';
;
module.exports = {
    MenuSection
};
