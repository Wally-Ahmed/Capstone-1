import { dbStr } from "../config";

const pg = require("pg");

const db = new pg.Client(dbStr);

db.connect();

export default db;
