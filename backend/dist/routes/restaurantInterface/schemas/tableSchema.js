"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableSchema = {
    type: "object",
    properties: {
        table_status: { type: "string" },
    },
    // Following the pattern of not requiring fields to keep the validation flexible
    required: [],
    additionalProperties: false,
};
exports.default = tableSchema;
