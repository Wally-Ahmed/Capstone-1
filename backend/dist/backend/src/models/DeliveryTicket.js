"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryTicket = void 0;
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class DeliveryTicket extends DatabaseObject_1.DatabaseObject {
    constructor(comments, time_submitted, time_completed, id = undefined) {
        const properties = {
            id,
            comments,
            time_submitted,
            time_completed
        };
        super(properties);
        this.comments = comments;
        this.time_submitted = time_submitted;
        this.time_completed = time_completed;
        this.id = id;
    }
}
exports.DeliveryTicket = DeliveryTicket;
DeliveryTicket.tableName = 'deliveryTicket';
module.exports = {
    DeliveryTicket
};
