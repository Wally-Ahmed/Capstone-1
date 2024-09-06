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
exports.Layout = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const Reservation_1 = require("./Reservation");
const Section_1 = require("./Section");
const RestaurantTable_1 = require("./RestaurantTable");
const expressError_1 = require("../__utilities__/expressError");
const Restaurant_1 = require("./Restaurant");
class Layout extends DatabaseObject_1.DatabaseObject {
    constructor(layout_name, restaurant_id, id = undefined) {
        const properties = {
            id,
            layout_name,
            restaurant_id
        };
        super(properties);
        this.layout_name = layout_name;
        this.restaurant_id = restaurant_id;
        this.id = id;
    }
    getSections() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT * FROM Section WHERE layout_id = $1 ORDER BY position ASC', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const menuSections = res.rows.map((row) => new Section_1.Section(row.section_name, row.width, row.height, row.position, row.layout_id, row.id));
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
    getFullLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the layout ID is defined
                if (this.id === undefined) {
                    throw new expressError_1.ForbiddenError();
                }
                ;
                // Retrieve Restaurant instance for this layout
                const restaurant = yield Restaurant_1.Restaurant.findById(this.restaurant_id);
                // Retrieve all Section instances related to this layout
                const allSections = yield this.getSections();
                // Retrieve all RestaurantTable instances for the Sections
                const allTables = yield RestaurantTable_1.RestaurantTable.getTablesBySectionIDs(allSections.map((Section) => {
                    return Section.id;
                }));
                // console.log('hitt')
                // Retrieve all Reservation instances for the RestaurantTable
                const allReservations = yield Reservation_1.Reservation.getReservationsByTableIDs(allTables.map((restaurantTable) => {
                    if (restaurantTable.id === undefined) {
                        throw new Error();
                    }
                    return restaurantTable.id;
                }));
                // Retrieve all Tab instances for the RestaurantTable
                const allTabs = yield restaurant.getTabs();
                // Build the layout sections structure by mapping over each Section
                const Sections = allSections.map((restaurantSection) => {
                    // Filter restaurantTables for the current Section
                    const restaurantTablesForSection = allTables.filter((table) => table.section_id === restaurantSection.id);
                    // console.log('hhhh', allTables)
                    // Build an array of RestaurantTable with their variations
                    const restaurantTables = restaurantTablesForSection.map((table) => {
                        // Filter Reservations for the current RestaurantTable
                        const reservationsForTables = allReservations.filter((reservation) => reservation.restaurant_table_id === table.id);
                        // Filter Tabs for the current RestaurantTable
                        const tabsForTables = allTabs.filter((tab) => tab.restaurant_table_id === table.id);
                        const restaurantTable = {
                            table_name: table.table_name,
                            table_status: table.table_status,
                            reservable: table.reservable,
                            seats: table.seats,
                            x: table.x,
                            y: table.y,
                            section_id: table.section_id,
                            id: table.id,
                            reservations: reservationsForTables,
                            tabs: tabsForTables
                        };
                        return restaurantTable;
                    });
                    // Return a structured object for each restaurantSection
                    if (restaurantSection.id === undefined) {
                        throw new Error();
                    }
                    ;
                    const section = {
                        id: restaurantSection.id,
                        layout_id: restaurantSection.section_id,
                        section_name: restaurantSection.section_name,
                        width: restaurantSection.width,
                        height: restaurantSection.height,
                        position: restaurantSection.position,
                        restaurantTables: restaurantTables
                    };
                    return section;
                });
                // Construct and return the complete layout with its sections
                const layout = {
                    id: this.id,
                    layout_name: this.layout_name,
                    sections: Sections
                };
                return layout;
            }
            catch (err) {
                // Handle any errors that might occur during the process
                throw err;
            }
        });
    }
    ;
}
exports.Layout = Layout;
Layout.tableName = 'layout';
module.exports = {
    Layout
};
