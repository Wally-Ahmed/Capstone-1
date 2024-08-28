import { JSONSchemaType } from 'ajv';

interface Employee {
    employee_name: string;
    employee_email: string;
    employee_phone: string;
    password: string;
    confirmPassword: string;
}

const employeeSchema: JSONSchemaType<Employee> = {
    type: "object",
    properties: {
        employee_name: { type: "string" },
        employee_email: { type: "string" },
        employee_phone: { type: "string" },
        password: { type: "string" },
        confirmPassword: { type: "string" },
    },
    // Not specifying any fields as required for maximum flexibility
    required: [],
    additionalProperties: false,
};

export default employeeSchema;