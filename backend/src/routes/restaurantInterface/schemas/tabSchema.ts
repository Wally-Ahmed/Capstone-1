import { JSONSchemaType } from 'ajv';

interface Tab {
    customer_name: string;
    employee_code: string;
    restaurant_table_id?: string | null;
}

const tabSchema: JSONSchemaType<Tab> = {
    type: "object",
    properties: {
        customer_name: { type: "string" },
        employee_code: { type: "string" },
        restaurant_table_id: { type: "string", nullable: true },
    },
    required: [],
    additionalProperties: false,
};

export default tabSchema;