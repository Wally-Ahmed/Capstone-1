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
exports.Employee = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
const expressError_1 = require("../__utilities__/expressError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
class Employee extends DatabaseObject_1.DatabaseObject {
    constructor(employee_name, employee_email, employee_phone, password_hash, employee_code = null, auth_token1 = null, auth_token2 = null, auth_token3 = null, auth_token4 = null, id = undefined) {
        const properties = {
            id,
            employee_name,
            employee_email,
            employee_phone,
            password_hash,
            employee_code,
            auth_token1,
            auth_token2,
            auth_token3,
            auth_token4
        };
        super(properties);
        this.employee_name = employee_name;
        this.employee_email = employee_email;
        this.employee_phone = employee_phone;
        this.password_hash = password_hash;
        this.employee_code = employee_code;
        this.auth_token1 = auth_token1;
        this.auth_token2 = auth_token2;
        this.auth_token3 = auth_token3;
        this.auth_token4 = auth_token4;
        this.id = id;
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Employee WHERE employee_email = $1', [email]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const employee = new Employee(res.rows[0].employee_name, res.rows[0].employee_email, res.rows[0].employee_phone, res.rows[0].password_hash, res.rows[0].employee_code, res.rows[0].auth_token1, res.rows[0].auth_token2, res.rows[0].auth_token3, res.rows[0].auth_token4, res.rows[0].id);
                return employee;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    static findByEmployeeCode(employeeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query('SELECT * FROM Employee WHERE employee_code = $1', [employeeCode]);
                if (res.rows.length == 0) {
                    return null;
                }
                ;
                const employee = new Employee(res.rows[0].employee_name, res.rows[0].employee_email, res.rows[0].employee_phone, res.rows[0].password_hash, res.rows[0].employee_code, res.rows[0].auth_token1, res.rows[0].auth_token2, res.rows[0].auth_token3, res.rows[0].auth_token4, res.rows[0].id);
                return employee;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    static authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.secretKey);
                // Check if decoded is an object and has the 'id' and 'col' properties
                if (!(typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'col' in decoded)) {
                    throw new expressError_1.UnauthorizedError('Invalid or expired token');
                }
                const user = yield Employee.findById(decoded.id);
                const col = decoded.col;
                if (!user) {
                    throw new expressError_1.UnauthorizedError();
                }
                if (token !== user[decoded.col]) {
                    throw new expressError_1.UnauthorizedError('Invalid or expired token');
                }
                return { user, col };
            }
            catch (err) {
                throw err;
            }
        });
    }
    authenticate(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = yield bcrypt_1.default.compare(password, this.password_hash);
                if (!isValid) {
                    const err = new expressError_1.UnauthorizedError('Invalid password');
                    throw err;
                }
                ;
                const token = this._setToken();
                return token;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
    _setToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Identify which token to replace
            const replacementIndex = 'auth_token' + findOldestOrInvalid(this.auth_token1, this.auth_token2, this.auth_token3, this.auth_token4);
            // Generate an authentication token
            const token = jsonwebtoken_1.default.sign({
                id: this.id,
                iat: Math.floor(Date.now() / 1000),
                code: crypto_1.default.randomBytes(16).toString('hex'),
                col: replacementIndex
            }, config_1.secretKey, { expiresIn: '6h', });
            // Save the authentication token to the database
            this[replacementIndex] = token;
            yield this.save();
            return token;
        });
    }
    ;
    getRestaurantEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the MenuSection table for menuSection belonging to this Menu
                const res = yield db_1.default.query('SELECT re.employee_rank, re.employment_status, re.employee_id, re.restaurant_id, r.restaurant_name, r.restaurant_address, re.employee_code FROM Restaurant_Employee re JOIN restaurant r ON re.restaurant_id = r.id WHERE re.employee_id = $1', [this.id]);
                // Map over the resulting rows and turn each one into a new MenuSection instance
                const EmployeeInfo = res.rows.map((row) => { return Object.assign({}, row); });
                return EmployeeInfo;
            }
            catch (err) {
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Employee = Employee;
Employee.tableName = 'employee';
;
function isValidJwt(token) {
    if (!token)
        return false;
    try {
        jsonwebtoken_1.default.verify(token, config_1.secretKey);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function findOldestOrInvalid(token1, token2, token3, token4) {
    const tokens = [token1, token2, token3, token4];
    let oldestIndex = -1;
    let oldestIat = null;
    for (let i = 0; i < tokens.length; i++) {
        if (!isValidJwt(tokens[i]))
            return i + 1;
        try {
            const decoded = jsonwebtoken_1.default.verify(tokens[i], config_1.secretKey);
            if (decoded.iat !== undefined) {
                if (oldestIat === null || decoded.iat < oldestIat) {
                    oldestIat = decoded.iat;
                    oldestIndex = i;
                }
            }
        }
        catch (e) {
            return i + 1; // Return the index if the token is invalid
        }
    }
    return oldestIndex + 1;
}
module.exports = {
    Employee
};
