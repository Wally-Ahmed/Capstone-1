import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { RestaurantInterfaceProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, } from '../__utilities__/expressError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { secretKey } from '../config';

export class RestaurantInterface extends DatabaseObject {

    static tableName = 'restaurant_interface';

    constructor(
        public restaurant_id: string,
        public interface_name: string,
        public tablemap_permission: boolean,
        public tab_permission: boolean,
        public kitchen_permission: boolean,
        public shift_permission: boolean,
        public time_created: Date = new Date(),
        public last_checkout_instrument_type: string | null = null,
        public sumup_oauth2_access_token: string | null = null,
        public sumup_oauth2_refresh_token: string | null = null,
        public link_code: string | null = null,
        public token_code: string | null = null,
        public id: string | undefined = undefined,
    ) {
        const properties: RestaurantInterfaceProperties = {
            id,
            interface_name,
            restaurant_id,
            tablemap_permission,
            tab_permission,
            kitchen_permission,
            shift_permission,
            time_created,
            last_checkout_instrument_type,
            sumup_oauth2_access_token,
            sumup_oauth2_refresh_token,
            token_code,
            link_code
        };
        super(properties);
    }

    static async findByLinkCode(employeeCode: string): Promise<RestaurantInterface | null> {
        try {
            const res = await db.query('SELECT * FROM restaurant_interface WHERE link_code = $1', [employeeCode]);


            if (res.rows.length == 0) {
                return null;
            };


            const employee = new RestaurantInterface(
                res.rows[0].restaurant_id,
                res.rows[0].interface_name,
                res.rows[0].tablemap_permission,
                res.rows[0].tab_permission,
                res.rows[0].kitchen_permission,
                res.rows[0].shift_permission,
                res.rows[0].time_created,
                res.rows[0].link_code,
                res.rows[0].token_code,
                res.rows[0].id,
            );

            return employee;
        } catch (err) {
            throw err
        };
    };

    static async authorize(token: string): Promise<{ user: RestaurantInterface }> {
        try {
            const decoded: { id: string, iat: Date, code: string } | null = jwt.verify(token, secretKey) as any;

            // Check if decoded is an object and has the 'id' and 'col' properties
            if (!(decoded !== null && decoded.id)) {
                throw new UnauthorizedError('Invalid token');
            }
            const user = await RestaurantInterface.findById(decoded.id) as RestaurantInterface | null;
            if (user === null) {
                throw new UnauthorizedError('Invalid or expired token');
            }
            if (decoded.code !== user.token_code) {
                throw new UnauthorizedError('Invalid token');
            }

            return { user };

        } catch (err) {
            throw err;
        }
    }

    async _setToken(): Promise<string> {
        // Generate an authentication token

        const token_code = crypto.randomBytes(16).toString('hex')

        const token = jwt.sign({
            id: this.id,
            iat: (new Date()).getTime(),
            code: token_code,
        }, secretKey);


        const decoded = jwt.verify(token, secretKey) as any


        // Hash the authentication token and save the hashed token to the database
        // const token_hash = await bcrypt.hash(token, 3);
        this.token_code = token_code;

        await this.save();


        return token;
    };

}

module.exports = {
    RestaurantInterface
};