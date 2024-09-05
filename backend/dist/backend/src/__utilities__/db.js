"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const pg = require("pg");
const db = new pg.Client(config_1.dbStr);
db.connect();
exports.default = db;
