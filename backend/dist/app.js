"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const _router_1 = __importDefault(require("./routes/restaurantAdmin/_router"));
const _router_2 = __importDefault(require("./routes/restaurantStaff/_router"));
const _router_3 = __importDefault(require("./routes/restaurantInterface/_router"));
const _router_4 = __importDefault(require("./routes/restaurantGuest/_router"));
exports.app = (0, express_1.default)();
const corsOptions = {
    origin: '*', // Front-end URL
    optionsSuccessStatus: 200
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use('/Admin', _router_1.default);
exports.app.use('/Staff', _router_2.default);
exports.app.use('/Interface', _router_3.default);
exports.app.use('/Guest', _router_4.default);
exports.app.use((err, req, res, next) => {
    const statusCode = err.status ? err.status : 500;
    // Construct the error response object manually
    const errorResponse = {
        status: statusCode,
        message: err.message,
        // Include other properties if needed
    };
    if (err.data) {
        errorResponse.data = err.data; // Optionally include additional data if present
    }
    console.log('', errorResponse);
    return res.status(statusCode).json({ error: errorResponse });
});
// module.exports = { app };
