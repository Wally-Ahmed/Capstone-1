"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tabSchema = {
    type: "object",
    properties: {
        customer_name: { type: "string" },
        employee_code: { type: "string" },
        restaurant_table_id: { type: "string", nullable: true },
    },
    required: [],
    additionalProperties: false,
};
exports.default = tabSchema;
