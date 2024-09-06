"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sectionSchema = {
    type: "object",
    properties: {
        section_name: { type: "string" },
        width: { type: "number" },
        height: { type: "number" },
    },
    required: [],
    additionalProperties: false,
};
exports.default = sectionSchema;
