"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const expressError_1 = require("./expressError"); // adjust the import path as necessary
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
(0, ajv_errors_1.default)(ajv);
// Middleware for validation that uses an object with unique keys for errors
function validateSchema(schema) {
    return (req, res, next) => {
        var _a;
        const validate = ajv.compile(schema);
        const valid = validate(req.body);
        if (!valid) {
            const errors = {};
            (_a = validate.errors) === null || _a === void 0 ? void 0 : _a.forEach(error => {
                // Correctly assuming unique instance paths for each error
                // Adjusting for when instancePath is empty (for root level errors)
                const key = error.instancePath.substring(1) || "root"; // Removing leading slash and handling root errors gracefully
                errors[key] = error.message || "Invalid value";
            });
            next(new expressError_1.JsonValidationError("Validation Failed", errors));
        }
        else {
            next();
        }
    };
}
exports.validateSchema = validateSchema;
module.exports = { validateSchema };
