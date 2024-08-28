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
exports.Ticket = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const TicketItem_1 = require("./TicketItem");
;
class Ticket extends DatabaseObject_1.DatabaseObject {
    constructor(tab_id, restaurant_id, comments, iat = new Date, status = null, time_completed = null, id = undefined) {
        const properties = {
            id,
            comments,
            restaurant_id,
            status,
            time_completed,
            tab_id,
            iat,
        };
        super(properties);
        this.tab_id = tab_id;
        this.restaurant_id = restaurant_id;
        this.comments = comments;
        this.iat = iat;
        this.status = status;
        this.time_completed = time_completed;
        this.id = id;
    }
    static getActiveTicketsByRestaurantID(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`
                SELECT t.*, tab.customer_name, rt.table_name
                FROM Ticket t
                JOIN Tab tab ON t.tab_id = tab.id
                LEFT JOIN restaurant_table rt ON tab.restaurant_table_id = rt.id
                WHERE t.restaurant_id = $1 AND t.status = 'in-progress'
                ORDER BY t.iat ASC;
            `, [Id]);
                const tickets = res.rows.map((row) => {
                    const ticket = new Ticket(row.tab_id, row.restaurant_id, row.comments, row.iat, row.status, row.time_completed, row.id);
                    ticket.customer_name = row.customer_name;
                    ticket.table_name = row.table_name;
                    return ticket;
                });
                return tickets;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
    static getTicketsByTabIDs(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Ticket WHERE tab_id = ANY($1)`, [IdArray]);
                const tables = res.rows.map((row) => { return new Ticket(row.tab_id, row.restaurant_id, row.comments, row.iat, row.status, row.time_completed, row.id); });
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
    getTicketItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the TicketItem table for instances belonging to this Ticket
                const res = yield db_1.default.query('SELECT * FROM Ticket_item WHERE ticket_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const menuSections = res.rows.map((row) => new TicketItem_1.TicketItem(row.menu_item_variation_id, row.ticket_id, row.tab_id, row.comments, row.prep_time_required, row.price, row.item_name, row.variation_description, row.id));
                return menuSections;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Ticket = Ticket;
Ticket.tableName = 'ticket';
module.exports = {
    Ticket
};
