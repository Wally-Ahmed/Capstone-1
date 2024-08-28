import { JSONSchemaType } from 'ajv';

interface Shift {
    employee_code: string;
    exit_code?: string;
}

const shiftSchema: JSONSchemaType<Shift> = {
    type: "object",
    properties: {
        employee_code: { type: "string" },
        exit_code: { type: "string", nullable: true },
    },
    required: [], // Keeping the schema flexible by not requiring any fields
    additionalProperties: false,
};

export default shiftSchema;