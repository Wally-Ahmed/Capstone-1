import { JSONSchemaType } from 'ajv';

interface Ticket {
    comments: string;
    status: string;
}

const ticketSchema: JSONSchemaType<Ticket> = {
    type: "object",
    properties: {
        comments: { type: "string" },
        status: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default ticketSchema;
