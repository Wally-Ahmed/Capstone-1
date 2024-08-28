import { dbStr } from "../config";

const pg = require("pg");

const db = new pg.Client(dbStr + '_test');

db.connect();

export default db;