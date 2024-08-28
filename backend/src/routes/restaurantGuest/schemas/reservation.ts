import { JSONSchemaType } from 'ajv';

interface Reservation {
    party_size: number;
    reservation_time: string; // JSON Schema does not have a 'Date' type, so 'string' is used, assuming ISO 8601 format.
    guest_name: string;
    guest_phone: string;
    guest_email: string;
    restaurant_id: string;
}

const reservationSchema: JSONSchemaType<Reservation> = {
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

export default reservationSchema;
