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
exports.MenuItemVariation = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const uuid_1 = require("uuid");
const pg_format_1 = __importDefault(require("pg-format"));
class MenuItemVariation extends DatabaseObject_1.DatabaseObject {
    constructor(menu_item_root_id, menu_item_variation_description, price_difference, id = undefined) {
        const properties = {
            id,
            menu_item_root_id,
            menu_item_variation_description,
            price_difference,
        };
        super(properties);
        this.menu_item_root_id = menu_item_root_id;
        this.menu_item_variation_description = menu_item_variation_description;
        this.price_difference = price_difference;
        this.id = id;
    }
    ;
    static getVariationsByItemRootID(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Menu_item_variation WHERE menu_item_root_id = ANY($1)`, [IdArray]);
                if (res.rows.length) {
                    const menuItemVariations = res.rows.map((row) => {
                        return new this(row.menu_item_root_id, row.menu_item_variation_description, row.price_difference, row.id);
                    });
                    return menuItemVariations;
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
    static findByPK(menu_item_root_id, menu_item_variation_description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Menu_item_variation WHERE menu_item_root_id = $1 AND menu_item_variation_description = $2`, [menu_item_root_id, menu_item_variation_description]);
                if (res.rows.length) {
                    const row = res.rows[0];
                    return new MenuItemVariation(row.id, row.menu_item_root_id, row.menu_item_variation_description, row.price_difference);
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
    save() {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                yield _super.save.call(this);
                //
                const constructor = this.constructor;
                const reference = yield constructor.findByPK(this.menu_item_root_id, this.menu_item_variation_description);
                const newUuid = (0, uuid_1.v4)();
                console.log(newUuid);
                this.id = newUuid;
                const keys = Object.keys(this).filter(key => this[key] !== reference[key]);
                if (keys.length === 0) {
                    return;
                }
                let updatestr = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
                const parameters = keys.map(key => this[key]);
                return yield db_1.default.query((0, pg_format_1.default)('UPDATE menu_item_variation SET %s WHERE menu_item_root_id = $%s AND menu_item_variation_description = $%s', updatestr, parameters.length + 1, parameters.length + 2), [...parameters, this.menu_item_root_id, this.menu_item_variation_description]);
            }
            const reference = yield MenuItemVariation.findById(this.id);
            if (!reference) {
                throw new Error('Unexpected Error');
            }
            if (reference.menu_item_variation_description === 'No change') {
                throw new Error('Method Not Allowed');
            }
            return yield _super.save.call(this); // Ensure the parent save method is called for updates as well
        });
    }
    ;
    delete() {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                const reference = yield MenuItemVariation.findById(this.id);
                if (!reference) {
                    throw new Error('Unexpected Error');
                }
                ;
                if (reference.menu_item_variation_description == 'Base') {
                    throw new Error('Method Not Allowed');
                }
                ;
            }
            ;
            _super.delete.call(this);
        });
    }
    ;
}
exports.MenuItemVariation = MenuItemVariation;
MenuItemVariation.tableName = 'menu_item_variation';
;
module.exports = {
    MenuItemVariation
};
