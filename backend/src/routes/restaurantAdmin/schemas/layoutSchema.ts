import { JSONSchemaType } from 'ajv';

interface Layout {
    layout_name: string;
}

const layoutSchema: JSONSchemaType<Layout> = {
    type: "object",
    properties: {
        layout_name: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

export default layoutSchema;
