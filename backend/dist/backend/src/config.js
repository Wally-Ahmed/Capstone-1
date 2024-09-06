"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.dbStr = exports.secretKey = void 0;
const globalConfig_1 = require("../../globalConfig");
Object.defineProperty(exports, "dbStr", { enumerable: true, get: function () { return globalConfig_1.dbStr; } });
Object.defineProperty(exports, "secretKey", { enumerable: true, get: function () { return globalConfig_1.secretKey; } });
const port = globalConfig_1.backendPort;
exports.port = port;
