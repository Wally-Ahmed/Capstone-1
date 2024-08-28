import { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import { JsonValidationError } from './expressError'; // adjust the import path as necessary

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

// Middleware for validation that uses an object with unique keys for errors
export function validateSchema(schema: JSONSchemaType<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validate = ajv.compile(schema);
        const valid = validate(req.body);
        if (!valid) {
            const errors: { [key: string]: string } = {};
            validate.errors?.forEach(error => {
                // Correctly assuming unique instance paths for each error
                // Adjusting for when instancePath is empty (for root level errors)
                const key = error.instancePath.substring(1) || "root"; // Removing leading slash and handling root errors gracefully
                errors[key] = error.message || "Invalid value";
            });
            next(new JsonValidationError("Validation Failed", errors));
        } else {
            next();
        }
    };
}

module.exports = { validateSchema };