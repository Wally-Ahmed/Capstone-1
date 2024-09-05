"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryTicketItem = void 0;
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class DeliveryTicketItem extends DatabaseObject_1.DatabaseObject {
    constructor(comments, kitchen_status, delivery_ticket_id, menu_item_variation_id, id = undefined) {
        const properties = {
            id,
            comments,
            kitchen_status,
            delivery_ticket_id,
            menu_item_variation_id
        };
        super(properties);
        this.comments = comments;
        this.kitchen_status = kitchen_status;
        this.delivery_ticket_id = delivery_ticket_id;
        this.menu_item_variation_id = menu_item_variation_id;
        this.id = id;
    }
}
exports.DeliveryTicketItem = DeliveryTicketItem;
DeliveryTicketItem.tableName = 'deliveryTicketItem';
module.exports = {
    DeliveryTicketItem
};
