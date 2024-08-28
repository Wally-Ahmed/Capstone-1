import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { RestaurantTableProperties, SectionProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { RestaurantTable } from './RestaurantTable'; // Import RestaurantTable from the same directory
import format from 'pg-format';

export class Section extends DatabaseObject {

    static tableName = 'section';

    constructor(
        public section_name: string,
        public width: number,
        public height: number,
        public position: number,
        public layout_id: string,
        public id: string | undefined = undefined,
    ) {
        const properties: SectionProperties = {
            id,
            section_name,
            width,
            height,
            position,
            layout_id
        };
        super(properties);
    }

    async getTablesOutDimensions(width: number = 1, height: number = 1): Promise<RestaurantTable[]> {
        try {
            const query = 'SELECT * FROM Restaurant_table WHERE section_id = $1 AND (x >= $2 OR y >= $3)'
            const res = await db.query(query, [this.id, width, height]);
            const restaurantTables = res.rows.map((row: RestaurantTableProperties) => {
                return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id,)
            })
            return restaurantTables;
        } catch (err) {
            throw err;
        }
    }

    async getTables(): Promise<RestaurantTable[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT * FROM restaurant_table WHERE section_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const restaurantTables: RestaurantTable[] = res.rows.map((row: RestaurantTableProperties) => new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id));
            return restaurantTables;
        } catch (err) {
            throw err;
        };
    };

}

module.exports = {
    Section
};
