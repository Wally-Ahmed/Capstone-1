"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAllowedError = exports.ForbiddenError = exports.BadRequestError = exports.UnauthorizedError = exports.NotFoundError = exports.JsonValidationError = exports.ExpressError = void 0;
/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */
class ExpressError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}
exports.ExpressError = ExpressError;
/** 400 JSON VALIDATION error. */
class JsonValidationError extends ExpressError {
    constructor(message = "Not Found", data) {
        super(message, 400);
        this.data = data;
    }
}
exports.JsonValidationError = JsonValidationError;
/** 404 NOT FOUND error. */
class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
/** 401 UNAUTHORIZED error. */
class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/** 400 BAD REQUEST error. */
class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
/** 403 FORBIDDEN error. */
class ForbiddenError extends ExpressError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
/** 405 NOTALLOWED error. */
class NotAllowedError extends ExpressError {
    constructor(message = "Method Not Allowed") {
        super(message, 405);
    }
}
exports.NotAllowedError = NotAllowedError;
