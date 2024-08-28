"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reservationSchema = {
    type: "object",
    properties: {
        party_size: { type: "number" },
        reservation_time: { type: "string", format: "date-time" }, // Assuming ISO 8601 format
        guest_name: { type: "string" },
        guest_ip: { type: "string", nullable: true },
        guest_phone: { type: "string" },
        guest_email: { type: "string", format: "email" },
        restaurant_id: { type: "string" },
        confirmation_status: { type: "string", nullable: true },
        restaurant_table_id: { type: "string", nullable: true },
    },
    required: [],
    additionalProperties: false,
};
exports.default = reservationSchema;
