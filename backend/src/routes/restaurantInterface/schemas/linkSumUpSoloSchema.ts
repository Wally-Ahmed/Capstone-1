import { JSONSchemaType } from 'ajv';

interface SumUpSolo {
    code: string;
    soloId: string;
}

const linkSumUpSoloSchema: JSONSchemaType<SumUpSolo> = {
    type: "object",
    properties: {
        code: { type: "string" },
        soloId: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default linkSumUpSoloSchema;