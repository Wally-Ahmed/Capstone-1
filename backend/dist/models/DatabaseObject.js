"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseObject = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const pg_format_1 = __importDefault(require("pg-format"));
// Define a list of valid table names for validation purposes
class DatabaseObject {
    constructor(properties) {
        Object.assign(this, properties);
    }
    printClassName() {
        console.log("The name of this class is:", this.constructor.name);
    }
    static getTableName() {
        return this.tableName;
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableName = this.getTableName();
            // Decouple valid table names
            try {
                const res = yield db_1.default.query((0, pg_format_1.default)('SELECT * FROM %I WHERE id = $1', tableName), [id]);
                if (res.rows.length) {
                    const data = res.rows[0];
                    const keyArr = Object.keys(data);
                    const obj = new this({});
                    keyArr.forEach((key) => { obj[key] = data[key]; });
                    return obj;
                }
                else {
                    return null; // Or however you wish to handle not finding the entry
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableName = (0, pg_format_1.default)('%I', this.constructor.tableName);
            try {
                const res = yield db_1.default.query((0, pg_format_1.default)('SELECT * FROM %I', tableName));
                return res.rows.map((row) => new this(row));
            }
            catch (err) {
                throw err;
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const cls = getCls(this);
            const tableName = cls.tableName;
            if (this.id === undefined) {
                // Insert new record
                const keys = Object.keys(this).filter(value => value !== 'id');
                const values = keys.map((key) => this[key]);
                let columns = keys.join(', ');
                let valuesPlaceholders = keys.map((_, index) => `$${index + 1}`).join(', ');
                try {
                    const result = yield db_1.default.query((0, pg_format_1.default)('INSERT INTO %I (%s) VALUES (%s) RETURNING id', tableName, columns, valuesPlaceholders), values);
                    this.id = result.rows[0].id;
                }
                catch (err) {
                    throw err;
                }
            }
            else {
                // Update existing record
                const constructor = this.constructor;
                try {
                    const reference = yield constructor.findById(this.id);
                    if (!reference) {
                        throw new Error('Instance no longer Exists');
                    }
                    const keys = Object.keys(this).filter(key => this[key] !== reference[key]);
                    if (keys.length === 0) {
                        return;
                    }
                    let updatestr = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
                    const parameters = keys.map(key => this[key]);
                    const res = yield db_1.default.query((0, pg_format_1.default)('UPDATE %I SET %s WHERE id = $%s RETURNING *', tableName, updatestr, parameters.length + 1), [...parameters, this.id]);
                    const updatedObj = res.rows[0];
                    if (updatedObj) {
                        keys.forEach(key => { this[key] = updatedObj[key]; });
                    }
                }
                catch (err) {
                    throw err;
                }
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableName = (0, pg_format_1.default)('%I', this.constructor.tableName);
            if (!this.id) {
                throw new Error('Instance must have an id to be deleted');
            }
            try {
                yield db_1.default.query((0, pg_format_1.default)('DELETE FROM %I WHERE id = $1', tableName), [this.id]);
                Object.keys(this).forEach(key => {
                    delete this[key];
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.DatabaseObject = DatabaseObject;
;
function getCls(instance) {
    return instance.constructor;
}
module.exports = { DatabaseObject };
