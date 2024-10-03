import { JSONSchemaType } from 'ajv';

interface SumUpOauth {
    code: string;
}

const connectSumUpOauthSchema: JSONSchemaType<SumUpOauth> = {
    type: "object",
    properties: {
        code: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default connectSumUpOauthSchema;