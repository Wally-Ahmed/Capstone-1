import { JSONSchemaType } from 'ajv';

interface TicketItem {
    menu_item_variation_id: string;
    comments: string;
    employee_code: string;
    price_adjustment: number;
}

const ticketItemSchema: JSONSchemaType<TicketItem> = {
    type: "object",
    properties: {
        menu_item_variation_id: { type: "string" },
        comments: { type: "string" },
        employee_code: { type: "string" },
        price_adjustment: { type: "number" },
    },
    // Not specifying any fields as required for maximum flexibility
    required: [],
    additionalProperties: false,
};

export default ticketItemSchema;