"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shiftSchema = {
    type: "object",
    properties: {
        employee_code: { type: "string" },
        exit_code: { type: "string", nullable: true },
    },
    required: [], // Keeping the schema flexible by not requiring any fields
    additionalProperties: false,
};
exports.default = shiftSchema;
