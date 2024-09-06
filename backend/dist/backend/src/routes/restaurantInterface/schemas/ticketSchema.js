"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticketSchema = {
    type: "object",
    properties: {
        comments: { type: "string" },
        status: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};
exports.default = ticketSchema;
