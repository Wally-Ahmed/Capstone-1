import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { RestaurantInterfaceProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, } from '../__utilities__/expressError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { oauth2SumUpClientId, oauth2SumUpClientSecret, secretKey } from '../config';
import { access } from 'fs';
import { Tab } from './Tab';
import { Restaurant } from './Restaurant';

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
        public sumup_merchant_code: Date | null = null,
        public sumup_solo_id: string | null = null,
        public sumup_oauth2_access_token: string | null = null,
        public sumup_oauth2_refresh_token: string | null = null,
        public sumup_oauth2_code: string | null = null,
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
            sumup_merchant_code,
            sumup_solo_id,
            sumup_oauth2_access_token,
            sumup_oauth2_refresh_token,
            sumup_oauth2_code,
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

            const row: RestaurantInterfaceProperties = res.rows[0]


            const employee = new RestaurantInterface(
                row.restaurant_id,
                row.interface_name,
                row.tablemap_permission,
                row.tab_permission,
                row.kitchen_permission,
                row.shift_permission,
                row.time_created,
                row.sumup_merchant_code,
                row.sumup_solo_id,
                row.sumup_oauth2_access_token,
                row.sumup_oauth2_refresh_token,
                row.sumup_oauth2_code,
                row.link_code,
                row.token_code,
                row.id,
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


    async attemptSumUpOauthAction(func: (accessToken: string) => Promise<Response>): Promise<Record<string, any> | null> {
        try {
            if (!this.sumup_oauth2_access_token && !this.sumup_oauth2_refresh_token) {
                return null;
            };
            if (this.sumup_oauth2_access_token) {
                const res = await func(this.sumup_oauth2_access_token);
                if (res.ok) {
                    return await res.json();
                };
            };

            const refreshSuccessful = await this.attemptSumUpTokenRefresh()
            if (refreshSuccessful) {
                const res = await func(this.sumup_oauth2_access_token as string);
                if (res.ok) {
                    return await res.json();
                };
            }

            return null;
        } catch (error) {
            return null;
        };
    };

    async attemptSumUpTokenRefresh(): Promise<boolean> {

        if (!this.sumup_oauth2_refresh_token) { return false }

        const res = await fetch(`https://api.sumup.com/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                client_id: oauth2SumUpClientId,
                client_secret: oauth2SumUpClientSecret,
                code: this.sumup_oauth2_code,
                refresh_token: this.sumup_oauth2_refresh_token
            })
        });

        if (!res.ok) { return false };

        const data: { access_token: string, refresh_token: string, expires_in: number, scope: string, token_type: string } = await res.json();

        this.sumup_oauth2_access_token = data.access_token;
        this.sumup_oauth2_refresh_token = data.refresh_token;

        await this.save();

        return true;
    }

    async attemptGetSumUpProfile() {
        return await this.attemptSumUpOauthAction(async (access_token) => {
            return await fetch(`https://api.sumup.com/v0.1/me/merchant-profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
        });
    }

    async attemptLinkSumUpSolo(apiCode: string): Promise<Record<string, any> | null> {


        return await this.attemptSumUpOauthAction(async (access_token) => {
            return await fetch(`https://api.sumup.com/v0.1/merchants/${this.sumup_merchant_code}/readers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ pairing_code: apiCode })
            });
        });
    }

    async attemptRemoveSumUpSolo(soloId: string): Promise<Record<string, any> | null> {
        return await this.attemptSumUpOauthAction(async (access_token) => {
            return await fetch(`https://api.sumup.com/v0.1/merchants/${this.sumup_merchant_code}/readers/${soloId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
        });
    }

    async attemptGetAllSumUpSolos(): Promise<Record<string, any> | null> {
        return await this.attemptSumUpOauthAction(async (access_token) => {
            return await fetch(`https://api.sumup.com/v0.1/merchants/${this.sumup_merchant_code}/readers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
        });
    }

    async attemptInitiateSumUpSoloTransaction(tab: Tab): Promise<Record<string, any> | null> {
        const restaurant = await Restaurant.findById(tab.restaurant_id) as Restaurant
        console.log(((await tab.getSubTotalPrice()) * 100))
        return await this.attemptSumUpOauthAction(async (access_token) => {
            console.log(`${window.location.origin}/interface/tabs/checkout/sumup/sumup-solo/process-checkout`)
            return await fetch(`https://api.sumup.com/v0.1/merchants/${this.sumup_merchant_code}/readers/${this.sumup_solo_id}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    total_amount: {
                        "currency": "USD",
                        "minor_unit": 2,
                        "value": Math.floor((await tab.getSubTotalPrice()) * 100)
                    },
                    tip_rates: [0.18, 0.20, 0.25],
                    description: `${restaurant.restaurant_name}: ${restaurant.restaurant_address}. ${new Date().toLocaleString()}.`,
                    return_url: `${window.location.origin}interface/tabs/checkout/sumup/sumup-solo/process-checkout`
                })
            });
        });
    }


}