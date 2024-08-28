import { JSONSchemaType } from 'ajv';

interface RestautantInterface {
    interface_name: string;
    tablemap_permission: boolean;
    tab_permission: boolean;
    kitchen_permission: boolean;
    shift_permission: boolean;
}

const restautantInterfaceSchema: JSONSchemaType<RestautantInterface> = {
    type: "object",
    properties: {
        interface_name: { type: "string" },
        tablemap_permission: { type: "boolean" },
        tab_permission: { type: "boolean" },
        kitchen_permission: { type: "boolean" },
        shift_permission: { type: "boolean" },
    },
    required: [], // No properties are required, adhering to your conditions.
    additionalProperties: false,
};

export default restautantInterfaceSchema;