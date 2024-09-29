import { JSONSchemaType } from 'ajv';

interface checkout {
    tipAmount: number;
    tabId: string;
}

const checkoutSchema: JSONSchemaType<checkout> = {
    type: "object",
    properties: {
        tipAmount: { type: "number" },
        tabId: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default checkoutSchema;