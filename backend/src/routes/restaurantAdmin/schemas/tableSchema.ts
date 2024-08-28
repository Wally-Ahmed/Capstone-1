import { JSONSchemaType } from 'ajv';

export interface Table {
    table_name: string;
    table_status: string;
    table_type?: string; // Assuming table_type is optional
    reservable: boolean;
    seats: number;
    x: number;
    y: number;
}

const tableSchema: JSONSchemaType<Table> = {
    type: "object",
    properties: {
        table_name: { type: "string" },
        table_status: { type: "string" },
        table_type: { type: "string", nullable: true }, // If table_type is optional
        reservable: { type: "boolean" },
        seats: { type: "number" },
        x: { type: "number" },
        y: { type: "number" },
    },
    required: [],
    additionalProperties: false,
};

export default tableSchema;
