"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceURL = exports.employeeURL = exports.adminURL = exports.port = exports.dbStr = exports.secretKey = void 0;
exports.secretKey = process.env.SECRET_KEY || 'secretKey';
exports.dbStr = process.env.DB_CONNECTION_STRING || 'postgresql://test:pass@localhost/restaurant_manager';
exports.port = 3000;
exports.adminURL = process.env.adminURL || 'http://localhost:3001/';
exports.employeeURL = process.env.employeeURL || 'http://localhost:3002/';
exports.interfaceURL = process.env.interfaceURL || 'http://localhost:3003/';
