"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employeeSchema = {
    type: "object",
    properties: {
        employee_name: { type: "string" },
        employee_email: { type: "string" },
        employee_phone: { type: "string" },
        password: { type: "string" },
        confirmPassword: { type: "string" },
    },
    // Not specifying any fields as required for maximum flexibility
    required: [],
    additionalProperties: false,
};
exports.default = employeeSchema;
