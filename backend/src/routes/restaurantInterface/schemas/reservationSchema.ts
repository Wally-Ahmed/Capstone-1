import { JSONSchemaType } from 'ajv';

interface ReservationDetails {
    party_size: number;
    reservation_time: string; // Date should be represented as a string in JSON Schema
    guest_name: string;
    guest_ip?: string | null;
    guest_phone: string;
    guest_email: string;
    restaurant_id: string;
    confirmation_status?: string | null;
    restaurant_table_id?: string | null;
}

const reservationSchema: JSONSchemaType<ReservationDetails> = {
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

export default reservationSchema;