"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employeeSchema = {
    type: "object",
    properties: {
        code: { type: "string" },
        employee_rank: { type: "string" },
    },
    required: [], // No properties are required.
    additionalProperties: false,
};
exports.default = employeeSchema;
