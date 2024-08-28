import { JSONSchemaType } from 'ajv';

interface Employee {
    code: string;
    employee_rank: string;
}

const employeeSchema: JSONSchemaType<Employee> = {
    type: "object",
    properties: {
        code: { type: "string" },
        employee_rank: { type: "string" },
    },
    required: [], // No properties are required.
    additionalProperties: false,
};

export default employeeSchema;
