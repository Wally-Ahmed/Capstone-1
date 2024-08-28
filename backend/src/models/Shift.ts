import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { ShiftProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export interface ActiveShiftProperties {
    id: string;
    start_date_time: Date;
    employee_name: string;
    restaurant_employee_id: string;
};


export class Shift extends DatabaseObject {

    static tableName = 'shift';

    constructor(
        public start_date_time: Date,
        public restaurant_id: string,
        public tip_pool_id: string,
        public restaurant_employee_id: string,
        public end_date_time: Date | null = null,
        public exit_code: string | null = null,
        public id: string | undefined = undefined,
    ) {
        const properties: ShiftProperties = {
            id,
            start_date_time,
            end_date_time,
            exit_code,
            restaurant_id,
            tip_pool_id,
            restaurant_employee_id,
        };
        super(properties);
    }



    static async getActiveShiftsByRestaurantID(restaurant_id: string): Promise<ActiveShiftProperties[]> {
        try {
            const res = await db.query(`
                SELECT 
                    shift.id,
                    shift.start_date_time,
                    restaurant_employee.id AS restaurant_employee_id,
                    employee.employee_name
                FROM 
                    shift
                JOIN 
                    restaurant_employee ON shift.restaurant_employee_id = restaurant_employee.id
                JOIN 
                    employee ON restaurant_employee.employee_id = employee.id
                WHERE 
                    shift.restaurant_id = $1 
                    AND shift.end_date_time IS NULL;
                `,
                [restaurant_id]);
            const shifts: ActiveShiftProperties[] = res.rows.map((row: ActiveShiftProperties): ActiveShiftProperties => {
                return {
                    id: row.id,
                    start_date_time: row.start_date_time,
                    employee_name: row.employee_name,
                    restaurant_employee_id: row.restaurant_employee_id,
                }
            })
            return shifts;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

}

module.exports = {
    Shift
};