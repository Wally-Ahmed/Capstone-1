import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { RestaurantTableProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export class RestaurantTable extends DatabaseObject {

    static tableName = 'restaurant_table';

    constructor(
        public table_name: string,
        public table_status: string,
        public reservable: boolean,
        public seats: number,
        public x: number,
        public y: number,
        public section_id: string,
        public id: string | undefined = undefined,
    ) {
        const properties: RestaurantTableProperties = {
            id,
            table_name,
            table_status,
            reservable,
            seats,
            x,
            y,
            section_id,
        };
        super(properties);
    };

    static async findByLocation(section_id: string, x: number, y: number): Promise<RestaurantTable | null> {
        try {
            const res = await db.query(`SELECT * FROM Restaurant_table WHERE section_id = $1 AND x = $2 AND y = $3`, [section_id, x, y]);
            if (res.rows.length) {
                const row: RestaurantTableProperties = res.rows[0];
                return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id,);
            } else {
                return null; // Or however you wish to handle not finding the entry
            }
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    static async getTablesBySectionIDs(IdArray: string[]): Promise<RestaurantTable[]> {
        try {
            const res = await db.query(`SELECT * FROM Restaurant_table WHERE section_id = ANY($1)`, [IdArray]);

            const tables: RestaurantTable[] = res.rows.map((row: RestaurantTableProperties) => { return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id,) })
            return tables;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

}

module.exports = {
    RestaurantTable
};