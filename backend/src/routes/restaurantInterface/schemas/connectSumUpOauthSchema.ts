import { JSONSchemaType } from 'ajv';

interface SumUpOauth {
    access_token: string;
    refresh_token: string;
    code: string;
}

const connectSumUpOauthSchema: JSONSchemaType<SumUpOauth> = {
    type: "object",
    properties: {
        access_token: { type: "string" },
        refresh_token: { type: "string" },
        code: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default connectSumUpOauthSchema;