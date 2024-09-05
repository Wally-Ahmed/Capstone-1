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
exports.TicketItem = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class TicketItem extends DatabaseObject_1.DatabaseObject {
    constructor(menu_item_variation_id, ticket_id, tab_id, comments, prep_time_required, price, item_name, variation_description, id = undefined) {
        const properties = {
            id,
            comments,
            price,
            prep_time_required,
            ticket_id,
            menu_item_variation_id,
            tab_id,
            item_name,
            variation_description
        };
        super(properties);
        this.menu_item_variation_id = menu_item_variation_id;
        this.ticket_id = ticket_id;
        this.tab_id = tab_id;
        this.comments = comments;
        this.prep_time_required = prep_time_required;
        this.price = price;
        this.item_name = item_name;
        this.variation_description = variation_description;
        this.id = id;
    }
    ;
    static getTicketItemsByTicketIDs(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Ticket_item WHERE ticket_id = ANY($1)`, [IdArray]);
                const ticketItems = res.rows.map((row) => {
                    return new TicketItem(row.menu_item_variation_id, row.ticket_id, row.tab_id, row.comments, row.prep_time_required, row.price, row.item_name, row.variation_description, row.id);
                });
                return ticketItems;
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
exports.TicketItem = TicketItem;
TicketItem.tableName = 'ticket_item';
;
module.exports = {
    TicketItem
};
