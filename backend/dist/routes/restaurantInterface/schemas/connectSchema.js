"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define the JSON schema for connection requests
const connectSchema = {
    type: "object",
    properties: {
        link_code: { type: "string" },
    },
    // No properties are explicitly required in the schema to maintain flexibility
    required: [],
    additionalProperties: false,
};
exports.default = connectSchema;
