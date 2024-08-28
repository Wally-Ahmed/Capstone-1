import { JSONSchemaType } from 'ajv';

interface Connect {
    link_code: string;
}

// Define the JSON schema for connection requests
const connectSchema: JSONSchemaType<Connect> = {
    type: "object",
    properties: {
        link_code: { type: "string" },
    },
    // No properties are explicitly required in the schema to maintain flexibility
    required: [],
    additionalProperties: false,
};

export default connectSchema;