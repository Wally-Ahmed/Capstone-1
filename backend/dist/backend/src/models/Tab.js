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
exports.Tab = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const expressError_1 = require("../__utilities__/expressError");
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const Restaurant_1 = require("./Restaurant");
const Ticket_1 = require("./Ticket");
const TicketItem_1 = require("./TicketItem");
class Tab extends DatabaseObject_1.DatabaseObject {
    constructor(customer_name, server_restaurant_employee_id, restaurant_table_id, restaurant_id, tab_status = 'open', discount = 0, calculated_tax = null, total_tip = null, id = undefined) {
        const properties = {
            id,
            customer_name,
            discount,
            calculated_tax,
            total_tip,
            tab_status,
            server_restaurant_employee_id,
            restaurant_table_id,
            restaurant_id,
        };
        super(properties);
        this.customer_name = customer_name;
        this.server_restaurant_employee_id = server_restaurant_employee_id;
        this.restaurant_table_id = restaurant_table_id;
        this.restaurant_id = restaurant_id;
        this.tab_status = tab_status;
        this.discount = discount;
        this.calculated_tax = calculated_tax;
        this.total_tip = total_tip;
        this.id = id;
    }
    static getFullTabs(restaurant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield Restaurant_1.Restaurant.findById(restaurant_id);
                if (restaurant === null) {
                    throw new expressError_1.NotFoundError('Restaurant not found');
                }
                ;
                const employees = yield restaurant.getRestaurantEmployees();
                const tables = yield restaurant.getTablesInActiveLayout();
                const allTabs = yield restaurant.getTabs();
                const allTickets = yield Ticket_1.Ticket.getTicketsByTabIDs(allTabs.map((tab) => {
                    return tab.id;
                }));
                const allTicketItems = yield TicketItem_1.TicketItem.getTicketItemsByTicketIDs(allTickets.map((ticket) => {
                    if (ticket.id === undefined) {
                        throw new Error();
                    }
                    return ticket.id;
                }));
                // Build the tabs structure by mapping over each Tab
                const tabs = allTabs.map((tab) => {
                    var _a, _b;
                    // Filter tickets for the current tab
                    const ticketsFortab = allTickets.filter((ticket) => ticket.tab_id === tab.id);
                    // Build an array of tickets with their ticketItems
                    const tickets = ticketsFortab.map((ticket) => {
                        const ticketItemsForTickets = allTicketItems.filter((ticketItem) => ticketItem.ticket_id === ticket.id);
                        const restaurantTicket = {
                            iat: ticket.iat,
                            comments: ticket.comments,
                            tab_id: ticket.tab_id,
                            restaurant_id: ticket.restaurant_id,
                            status: ticket.status,
                            time_completed: ticket.time_completed,
                            id: ticket.id,
                            ticketItems: ticketItemsForTickets
                        };
                        return restaurantTicket;
                    });
                    // Return a structured object for each tab
                    console.log(employees[0]);
                    const restaurantTab = {
                        customer_name: tab.customer_name,
                        discount: tab.discount,
                        calculated_tax: tab.calculated_tax,
                        total_tip: tab.total_tip,
                        tab_status: tab.tab_status,
                        server_restaurant_employee_id: tab.server_restaurant_employee_id,
                        restaurant_table_id: tab.restaurant_table_id,
                        restaurant_id: tab.restaurant_id,
                        id: tab.id,
                        table_name: ((_a = tables.find(table => table.id === tab.restaurant_table_id)) === null || _a === void 0 ? void 0 : _a.table_name) || null,
                        server_name: (_b = employees.find(employee => employee.id === tab.server_restaurant_employee_id)) === null || _b === void 0 ? void 0 : _b.employee_name,
                        tickets: tickets,
                    };
                    return restaurantTab;
                });
                return tabs;
            }
            catch (err) {
                throw err;
            }
        });
    }
    ;
    getTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the Ticket table for tickets belonging to this Tab
                const res = yield db_1.default.query('SELECT * FROM Ticket WHERE tab_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new Ticket instance
                const tabs = res.rows.map((row) => new Ticket_1.Ticket(row.tab_id, row.restaurant_id, row.comments, row.iat, row.status, row.time_completed, row.id));
                return tabs;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Tab = Tab;
Tab.tableName = 'tab';
module.exports = {
    Tab
};
