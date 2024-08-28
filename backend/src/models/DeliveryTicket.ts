import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { DeliveryTicketProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export class DeliveryTicket extends DatabaseObject {

    static tableName = 'deliveryTicket';

    constructor(
        public comments: string,
        public time_submitted: Date,
        public time_completed: Date,
        public id: string | undefined = undefined,
    ) {
        const properties: DeliveryTicketProperties = {
            id,
            comments,
            time_submitted,
            time_completed
        };
        super(properties);
    }
}

module.exports = {
    DeliveryTicket
};