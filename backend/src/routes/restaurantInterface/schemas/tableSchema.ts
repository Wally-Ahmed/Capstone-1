import { JSONSchemaType } from 'ajv';

interface Table {
    table_status: string;
}

const tableSchema: JSONSchemaType<Table> = {
    type: "object",
    properties: {
        table_status: { type: "string" },
    },
    // Following the pattern of not requiring fields to keep the validation flexible
    required: [],
    additionalProperties: false,
};

export default tableSchema;