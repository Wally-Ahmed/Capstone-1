import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { DeliveryTicketItemProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export class DeliveryTicketItem extends DatabaseObject {

    static tableName = 'deliveryTicketItem';

    constructor(
        public comments: string,
        public kitchen_status: string,
        public delivery_ticket_id: string,
        public menu_item_variation_id: string,
        public id: string | undefined = undefined,
    ) {
        const properties: DeliveryTicketItemProperties = {
            id,
            comments,
            kitchen_status,
            delivery_ticket_id,
            menu_item_variation_id
        };
        super(properties);
    }
}

module.exports = {
    DeliveryTicketItem
};