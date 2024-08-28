import { JSONSchemaType } from 'ajv';

interface Section {
    section_name: string;
    width: number;
    height: number;
}

const sectionSchema: JSONSchemaType<Section> = {
    type: "object",
    properties: {
        section_name: { type: "string" },
        width: { type: "number" },
        height: { type: "number" },
    },
    required: [],
    additionalProperties: false,
};

export default sectionSchema;
