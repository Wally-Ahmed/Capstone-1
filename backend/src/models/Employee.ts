import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { EmployeeProperties, RestaurantEmployeeProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { UnauthorizedError, NotFoundError } from '../__utilities__/expressError';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { secretKey } from '../config';
// import { jwtDecode, JwtPayload } from 'jwt-decode';

interface EmployeeInfo extends EmployeeProperties {
    restaurant_name: string;
    restaurant_address: string;
    employee_code: string;
}


export class Employee extends DatabaseObject {

    static tableName = 'employee';

    constructor(
        public employee_name: string,
        public employee_email: string,
        public employee_phone: string,
        public password_hash: string,
        public employee_code: string | null = null,
        public auth_token1: string | null = null,
        public auth_token2: string | null = null,
        public auth_token3: string | null = null,
        public auth_token4: string | null = null,
        public id: string | undefined = undefined,
    ) {
        const properties: EmployeeProperties = {
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
    }

    static async findByEmail(email: string): Promise<Employee | null> {
        try {
            const res = await db.query('SELECT * FROM Employee WHERE employee_email = $1', [email]);

            if (res.rows.length == 0) {
                return null;
            };

            const employee = new Employee(
                res.rows[0].employee_name,
                res.rows[0].employee_email,
                res.rows[0].employee_phone,
                res.rows[0].password_hash,
                res.rows[0].employee_code,
                res.rows[0].auth_token1,
                res.rows[0].auth_token2,
                res.rows[0].auth_token3,
                res.rows[0].auth_token4,
                res.rows[0].id
            );

            return employee;
        } catch (err) {
            throw err
        };
    };

    static async findByEmployeeCode(employeeCode: string): Promise<Employee | null> {
        try {
            const res = await db.query('SELECT * FROM Employee WHERE employee_code = $1', [employeeCode]);

            if (res.rows.length == 0) {
                return null;
            };

            const employee = new Employee(
                res.rows[0].employee_name,
                res.rows[0].employee_email,
                res.rows[0].employee_phone,
                res.rows[0].password_hash,
                res.rows[0].employee_code,
                res.rows[0].auth_token1,
                res.rows[0].auth_token2,
                res.rows[0].auth_token3,
                res.rows[0].auth_token4,
                res.rows[0].id
            );

            return employee;
        } catch (err) {
            throw err
        };
    };

    static async authorize(token: string): Promise<{ user: Employee, col: string }> {
        try {
            const decoded = jwt.verify(token, secretKey) as JwtPayload;

            // Check if decoded is an object and has the 'id' and 'col' properties
            if (!(typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'col' in decoded)) {
                throw new UnauthorizedError('Invalid or expired token');
            }
            const user = await Employee.findById(decoded.id) as Employee;
            const col = decoded.col as string;
            if (!user) {
                throw new UnauthorizedError();
            }

            if (token !== user[decoded.col]) {
                throw new UnauthorizedError('Invalid or expired token');
            }

            return { user, col };

        } catch (err) {
            throw err;
        }
    }

    async authenticate(password: string) {
        try {
            const isValid = await bcrypt.compare(password, this.password_hash);

            if (!isValid) {
                const err = new UnauthorizedError('Invalid password');
                throw err;
            };

            const token = this._setToken();

            return token;

        } catch (err) {
            throw err;
        };
    };

    async _setToken() {
        // Identify which token to replace
        const replacementIndex = 'auth_token' + findOldestOrInvalid(this.auth_token1, this.auth_token2, this.auth_token3, this.auth_token4)


        // Generate an authentication token
        const token = jwt.sign({
            id: this.id,
            iat: Math.floor(Date.now() / 1000),
            code: crypto.randomBytes(16).toString('hex'),
            col: replacementIndex
        }, secretKey, { expiresIn: '6h', });


        // Save the authentication token to the database
        this[replacementIndex] = token;
        await this.save();

        return token;
    };

    async getRestaurantEmployees(): Promise<EmployeeInfo[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT re.employee_rank, re.employment_status, re.employee_id, re.restaurant_id, r.restaurant_name, r.restaurant_address, re.employee_code FROM Restaurant_Employee re JOIN restaurant r ON re.restaurant_id = r.id WHERE re.employee_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const EmployeeInfo: EmployeeInfo[] = res.rows.map((row: RestaurantEmployeeProperties) => { return { ...row } });
            return EmployeeInfo;
        } catch (err) {
            throw err;
        };
    };

};



function isValidJwt(token: string | null): boolean {
    if (!token) return false;

    try {
        jwt.verify(token, secretKey);
        return true;
    } catch {
        return false;
    }
}

function findOldestOrInvalid(token1: string | null, token2: string | null, token3: string | null, token4: string | null): number {
    const tokens = [token1, token2, token3, token4];
    let oldestIndex = -1;
    let oldestIat: number | null = null;

    for (let i = 0; i < tokens.length; i++) {
        if (!isValidJwt(tokens[i])) return i + 1;

        try {
            const decoded = jwt.verify(tokens[i] as string, secretKey) as JwtPayload;
            if (decoded.iat !== undefined) {
                if (oldestIat === null || decoded.iat < oldestIat) {
                    oldestIat = decoded.iat;
                    oldestIndex = i;
                }
            }
        } catch (e) {
            return i + 1; // Return the index if the token is invalid
        }
    }

    return oldestIndex + 1;
}

module.exports = {
    Employee
};
