"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv = new ajv_1.default({ allErrors: true, $data: true });
(0, ajv_errors_1.default)(ajv);
const restaurantSchema = {
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
exports.default = restaurantSchema;
