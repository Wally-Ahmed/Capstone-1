import Ajv, { JSONSchemaType } from 'ajv';
import ajvErrors from 'ajv-errors';

interface Restaurant {
    restaurant_name: string;
    restaurant_address: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const restaurantSchema: JSONSchemaType<Restaurant> = {
    type: "object",
    properties: {
        restaurant_name: { type: "string" },
        restaurant_address: { type: "string" },
        email: { type: "string", format: "email" },
        phone: {
            type: "string",
            pattern: "^(\\+1)?\\s?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$",
            errorMessage: "Invalid phone number format. Expected format: +1 (XXX) XXX-XXXX.",
        },
        password: { type: "string" },
        confirmPassword: { type: "string" },
    },
    required: [],
    additionalProperties: false,
    errorMessage: {
        properties: {
            email: "Invalid email format.",
            // You can add custom error messages for other properties as needed
        }
    }
};

export default restaurantSchema;