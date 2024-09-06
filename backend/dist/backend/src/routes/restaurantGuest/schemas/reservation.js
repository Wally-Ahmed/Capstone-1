"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reservationSchema = {
    type: "object",
    properties: {
        party_size: { type: "number" },
        reservation_time: { type: "string", format: "date-time" }, // Assuming the reservation_time is an ISO 8601 date string.
        guest_name: { type: "string" },
        guest_phone: { type: "string" },
        guest_email: { type: "string", format: "email" },
        restaurant_id: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};
exports.default = reservationSchema;
