"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticketItemSchema = {
    type: "object",
    properties: {
        menu_item_variation_id: { type: "string" },
        comments: { type: "string" },
        employee_code: { type: "string" },
        price_adjustment: { type: "number" },
    },
    // Not specifying any fields as required for maximum flexibility
    required: [],
    additionalProperties: false,
};
exports.default = ticketItemSchema;
