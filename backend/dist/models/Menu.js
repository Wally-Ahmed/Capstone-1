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
exports.Menu = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const MenuSection_1 = require("./MenuSection"); // Import MenuSection from the same directory
const MenuItemRoot_1 = require("./MenuItemRoot"); // Import MenuItemRoot from the same directory
const MenuItemVariation_1 = require("./MenuItemVariation"); // Import MenuItemVariation from the same directory
class Menu extends DatabaseObject_1.DatabaseObject {
    constructor(menu_title, restaurant_id, id = undefined) {
        const properties = {
            id,
            menu_title,
            restaurant_id
        };
        super(properties);
        this.menu_title = menu_title;
        this.restaurant_id = restaurant_id;
        this.id = id;
    }
    ;
    getMenuSections() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT * FROM Menu_section WHERE menu_id = $1 ORDER BY position ASC', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const menuSections = res.rows.map((row) => new MenuSection_1.MenuSection(row.menu_id, row.position, row.menu_section_title, row.id));
                menuSections.forEach((item, index) => __awaiter(this, void 0, void 0, function* () { if (item.position !== index) {
                    item.position = index;
                    yield item.save();
                } ; }));
                return menuSections;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    reindexMenuSections() {
        return __awaiter(this, void 0, void 0, function* () {
            const menuSections = yield this.getMenuSections();
            return menuSections;
        });
    }
    ;
    getFullMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the menu ID is defined
                if (this.id === undefined) {
                    throw new Error();
                }
                ;
                // Retrieve all MenuSection instances related to this menu
                const allMenuSections = yield this.getMenuSections();
                // Retrieve all MenuItemRoot instances for the MenuSections
                const allMenuItemRoots = yield MenuItemRoot_1.MenuItemRoot.getItemsBySectionID(allMenuSections.map((menuSection) => {
                    if (menuSection.id === undefined) {
                        throw new Error();
                    }
                    return menuSection.id;
                }));
                // Retrieve all MenuItemVariation instances for the MenuItemRoots
                const allMenuItemVariations = yield MenuItemVariation_1.MenuItemVariation.getVariationsByItemRootID(allMenuItemRoots.map((menuItemRoot) => {
                    if (menuItemRoot.id === undefined) {
                        throw new Error();
                    }
                    return menuItemRoot.id;
                }));
                // Build the menu sections structure by mapping over each MenuSection
                const menuSections = allMenuSections.map((menuSection) => {
                    // Filter MenuItemRoots for the current MenuSection
                    const menuItemRootsForSection = allMenuItemRoots.filter((itemRoot) => itemRoot.menu_section_id === menuSection.id);
                    // Build an array of MenuItemRoots with their variations
                    const menuItemRoots = menuItemRootsForSection.map((itemRoot) => {
                        // Filter MenuItemVariations for the current MenuItemRoot
                        const menuItemVariationsForRoot = allMenuItemVariations.filter((variation) => variation.menu_item_root_id === itemRoot.id);
                        // Map each MenuItemVariation to a detailed structure
                        const menuItemVariations = menuItemVariationsForRoot.map((menuItemVariation) => {
                            if (menuItemVariation.id === undefined) {
                                throw new Error();
                            }
                            return {
                                id: menuItemVariation.id,
                                menu_item_root_id: menuItemVariation.menu_item_root_id,
                                menu_item_variation_description: menuItemVariation.menu_item_variation_description,
                                price_difference: menuItemVariation.price_difference,
                            };
                        });
                        // Return a structured object for each MenuItemRoot
                        if (itemRoot.id === undefined) {
                            throw new Error();
                        }
                        ;
                        const menuItemRoot = {
                            id: itemRoot.id,
                            menu_section_id: itemRoot.menu_section_id,
                            position: itemRoot.position,
                            menu_item_root_name: itemRoot.menu_item_root_name,
                            base_price: itemRoot.base_price,
                            menu_item_root_description: itemRoot.menu_item_root_description,
                            prep_time_required: itemRoot.prep_time_required,
                            MenuItemVariations: menuItemVariations
                        };
                        return menuItemRoot;
                    });
                    // Return a structured object for each MenuSection
                    if (menuSection.id === undefined) {
                        throw new Error();
                    }
                    ;
                    const section = {
                        id: menuSection.id,
                        menu_id: menuSection.menu_id,
                        position: menuSection.position,
                        menu_section_title: menuSection.menu_section_title,
                        MenuItemRoots: menuItemRoots
                    };
                    return section;
                });
                // Construct and return the complete menu with its sections
                const menu = {
                    id: this.id,
                    menu_title: this.menu_title,
                    MenuSections: menuSections
                };
                return menu;
            }
            catch (err) {
                // Handle any errors that might occur during the process
                throw err;
            }
        });
    }
    ;
}
exports.Menu = Menu;
Menu.tableName = 'menu';
;
module.exports = {
    Menu
};
