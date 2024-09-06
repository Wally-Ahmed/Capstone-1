"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableSchema = {
    type: "object",
    properties: {
        table_name: { type: "string" },
        table_status: { type: "string" },
        table_type: { type: "string", nullable: true }, // If table_type is optional
        reservable: { type: "boolean" },
        seats: { type: "number" },
        x: { type: "number" },
        y: { type: "number" },
    },
    required: [],
    additionalProperties: false,
};
exports.default = tableSchema;
