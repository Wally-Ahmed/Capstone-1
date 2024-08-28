import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { ShiftModificationProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export class ShiftModification {

    static tableName = 'shift_modification';

    constructor(
        public shift_id: string,
        public modification_time: Date,
        public modification_by_restaurant_employee_id: string
    ) {
        const properties: ShiftModificationProperties = {
            shift_id,
            modification_time,
            modification_by_restaurant_employee_id
        };
        Object.assign(this, properties);
    }
}

module.exports = {
    ShiftModification
};