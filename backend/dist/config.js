"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.dbStr = exports.secretKey = void 0;
exports.secretKey = process.env.SECRET_KEY || 'secretKey';
exports.dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';
exports.port = 3000;
