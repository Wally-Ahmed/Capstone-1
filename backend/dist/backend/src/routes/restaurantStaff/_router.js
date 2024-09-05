"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const employment_1 = __importDefault(require("./employment"));
const router = express_1.default.Router();
router.use('/', auth_1.default);
router.use('/', employment_1.default);
exports.default = router;
