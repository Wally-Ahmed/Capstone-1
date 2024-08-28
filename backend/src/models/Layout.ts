import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { LayoutProperties, SectionProperties, MenuItemRootProperties, MenuItemVariationProperties, RestaurantTableProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { Reservation } from './Reservation';
import { Section } from './Section';
import { RestaurantTable } from './RestaurantTable';
import { ForbiddenError } from '../__utilities__/expressError';
import { Restaurant } from './Restaurant';
import { Tab } from './Tab';



interface fullRestaurantTable extends RestaurantTableProperties {
    id: string,
    reservations: Reservation[],
    tabs: Tab[]
}

interface fullSection extends SectionProperties {
    id: string,
    restaurantTables: fullRestaurantTable[],
}

interface fullLayout {
    id: string,
    layout_name: string,
    sections: fullSection[],
}



export class Layout extends DatabaseObject {

    static tableName = 'layout';

    constructor(
        public layout_name: string,
        public restaurant_id: string,
        public id: string | undefined = undefined,
    ) {
        const properties: LayoutProperties = {
            id,
            layout_name,
            restaurant_id
        };
        super(properties);
    }

    async getSections(): Promise<Section[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT * FROM Section WHERE layout_id = $1 ORDER BY position ASC', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const menuSections: Section[] = res.rows.map((row: SectionProperties) => new Section(row.section_name, row.width, row.height, row.position, row.layout_id, row.id,));
            menuSections.forEach(async (item: Section, index: number) => { if (item.position !== index) { item.position = index; await item.save() }; });
            return menuSections;
        } catch (err) {
            throw err;
        };
    };

    async getFullLayout(): Promise<fullLayout> {
        try {
            // Check if the layout ID is defined
            if (this.id === undefined) { throw new ForbiddenError(); };


            // Retrieve Restaurant instance for this layout
            const restaurant = await Restaurant.findById(this.restaurant_id) as Restaurant

            // Retrieve all Section instances related to this layout
            const allSections = await this.getSections();

            // Retrieve all RestaurantTable instances for the Sections
            const allTables = await RestaurantTable.getTablesBySectionIDs(
                allSections.map((Section: Section): string => {
                    return Section.id as string;
                })
            );
            // console.log('hitt')

            // Retrieve all Reservation instances for the RestaurantTable
            const allReservations = await Reservation.getReservationsByTableIDs(
                allTables.map((restaurantTable: RestaurantTable): string => {
                    if (restaurantTable.id === undefined) { throw new Error(); }
                    return restaurantTable.id;
                })
            );

            // Retrieve all Tab instances for the RestaurantTable
            const allTabs = await restaurant.getTabs()

            // Build the layout sections structure by mapping over each Section
            const Sections: fullSection[] = allSections.map((restaurantSection: Section) => {
                // Filter restaurantTables for the current Section
                const restaurantTablesForSection = allTables.filter((table: RestaurantTable) => table.section_id === restaurantSection.id);

                // console.log('hhhh', allTables)

                // Build an array of RestaurantTable with their variations
                const restaurantTables: fullRestaurantTable[] = restaurantTablesForSection.map((table: RestaurantTable) => {
                    // Filter Reservations for the current RestaurantTable
                    const reservationsForTables = allReservations.filter((reservation: Reservation) => reservation.restaurant_table_id === table.id);

                    // Filter Tabs for the current RestaurantTable
                    const tabsForTables = allTabs.filter((tab: Tab) => tab.restaurant_table_id === table.id);

                    const restaurantTable: fullRestaurantTable = {
                        table_name: table.table_name,
                        table_status: table.table_status,
                        reservable: table.reservable,
                        seats: table.seats,
                        x: table.x,
                        y: table.y,
                        section_id: table.section_id,
                        id: table.id as string,
                        reservations: reservationsForTables,
                        tabs: tabsForTables
                    };
                    return restaurantTable;
                });

                // Return a structured object for each restaurantSection

                if (restaurantSection.id === undefined) { throw new Error(); };
                const section: fullSection = {
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
            const layout: fullLayout = {
                id: this.id,
                layout_name: this.layout_name,
                sections: Sections
            };

            return layout;
        } catch (err) {
            // Handle any errors that might occur during the process
            throw err;
        }
    };

}

module.exports = {
    Layout
};