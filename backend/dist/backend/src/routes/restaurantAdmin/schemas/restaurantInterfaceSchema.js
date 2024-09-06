"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restautantInterfaceSchema = {
    type: "object",
    properties: {
        interface_name: { type: "string" },
        tablemap_permission: { type: "boolean" },
        tab_permission: { type: "boolean" },
        kitchen_permission: { type: "boolean" },
        shift_permission: { type: "boolean" },
    },
    required: [], // No properties are required, adhering to your conditions.
    additionalProperties: false,
};
exports.default = restautantInterfaceSchema;
