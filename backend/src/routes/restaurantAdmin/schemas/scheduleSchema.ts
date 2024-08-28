import { JSONSchemaType } from 'ajv';

interface schedule {
    monday_opening?: string | null;
    tuesday_opening?: string | null;
    wednesday_opening?: string | null;
    thursday_opening?: string | null;
    friday_opening?: string | null;
    saturday_opening?: string | null;
    sunday_opening?: string | null;
    monday_closing?: string | null;
    tuesday_closing?: string | null;
    wednesday_closing?: string | null;
    thursday_closing?: string | null;
    friday_closing?: string | null;
    saturday_closing?: string | null;
    sunday_closing?: string | null;
    time_zone?: string | null;
    time_until_first_reservation_minutes: number;
    time_until_last_reservation_minutes: number;
    reservation_duration_minutes: number;
}

const scheduleSchema: JSONSchemaType<schedule> = {
    type: "object",
    properties: {
        monday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        tuesday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        wednesday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        thursday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        friday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        saturday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        sunday_opening: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        monday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        tuesday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        wednesday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        thursday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        friday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        saturday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        sunday_closing: { type: "string", nullable: true, pattern: "^[0-2][0-9]:[0-5][0-9]$", errorMessage: "Invalid time format. Expected format HH:MM" },
        time_zone: { type: "string", nullable: true },
        time_until_first_reservation_minutes: { type: "number" },
        time_until_last_reservation_minutes: { type: "number" },
        reservation_duration_minutes: { type: "number" },
    },
    required: [],
    additionalProperties: false,
};


export default scheduleSchema;