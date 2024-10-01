import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, NotFoundError, ExpressError } from '../__utilities__/expressError';
import { RestaurantProperties, MenuProperties, LayoutProperties, RestaurantInterfaceProperties, TabProperties, RestaurantEmployeeProperties, EmployeeProperties, ReservationProperties, RestaurantTableProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { Menu } from './Menu'; // Import Menu from the same directory
import crypto from 'crypto';
import { Layout } from './Layout';

import { secretKey } from '../config';
import { RestaurantInterface } from './RestaurantInterface';
import { Tab } from './Tab';
import { RestaurantEmployee } from './RestaurantEmployee';
import { Reservation } from './Reservation';
import { RestaurantTable } from './RestaurantTable';

interface EmployeeInfo extends EmployeeProperties {
    employee_name: string;
    employee_email: string;
}

export class Restaurant extends DatabaseObject {

    static tableName = 'restaurant';


    constructor(
        public restaurant_name: string,
        public restaurant_address: string,
        public email: string,
        public phone_number: string,
        public password_hash: string,
        public id: string | undefined = undefined,
        public active_layout_id: string | null = null,
        public auth_token_hash: string | null = null,
        public time_zone: string | null = null,
        public time_until_first_reservation_minutes: number = 0,
        public time_until_last_reservation_minutes: number = 0,
        public reservation_duration_minutes: number = 60,
        public monday_opening: string | null = null,
        public tuesday_opening: string | null = null,
        public wednesday_opening: string | null = null,
        public thursday_opening: string | null = null,
        public friday_opening: string | null = null,
        public saturday_opening: string | null = null,
        public sunday_opening: string | null = null,
        public monday_closing: string | null = null,
        public tuesday_closing: string | null = null,
        public wednesday_closing: string | null = null,
        public thursday_closing: string | null = null,
        public friday_closing: string | null = null,
        public saturday_closing: string | null = null,
        public sunday_closing: string | null = null,
    ) {
        const properties: RestaurantProperties = {
            id,
            restaurant_name,
            restaurant_address,
            email,
            phone_number,
            active_layout_id,
            password_hash,
            auth_token_hash,
            time_zone,
            time_until_first_reservation_minutes,
            time_until_last_reservation_minutes,
            reservation_duration_minutes,
            monday_opening,
            tuesday_opening,
            wednesday_opening,
            thursday_opening,
            friday_opening,
            saturday_opening,
            sunday_opening,
            monday_closing,
            tuesday_closing,
            wednesday_closing,
            thursday_closing,
            friday_closing,
            saturday_closing,
            sunday_closing,
        };

        super(properties);
    };
    // static getTablenName(): string {
    //     return this.tableName;
    // };

    static async authorize(token: string): Promise<Restaurant> {
        try {
            // 

            // Decode the token to check its structure without verifying
            // const decodedToken = jwt.decode(token);
            // 

            // Verify the token
            const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
            // 

            // Check if decoded is an object and has an 'id' property
            if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
                throw new UnauthorizedError('Invalid token');
            }

            const user = await Restaurant.findById(decoded.id) as Restaurant;


            if (!user) {
                throw new UnauthorizedError('User not found');
            }

            if (user.auth_token_hash === null) {

                throw new UnauthorizedError('Token hash not found');
            }

            const matchStore = await bcrypt.compare(decoded.code, user.auth_token_hash);
            if (!matchStore) {
                throw new UnauthorizedError('Token mismatch');
            }

            return user;
        } catch (err) {
            // 
            if (err instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }
            throw err;
        }
    };

    static async findByEmail(email: string): Promise<Restaurant | null> {
        try {
            const res = await db.query('SELECT * FROM Restaurant WHERE email = $1', [email]);

            if (res.rows.length == 0) {
                return null;
            };

            const row: RestaurantProperties = res.rows[0]

            const restaurant = new Restaurant(
                row.restaurant_name,
                row.restaurant_address,
                row.email,
                row.phone_number,
                row.password_hash,
                row.id,
                row.active_layout_id,
                row.auth_token_hash,
                row.time_zone,
                row.time_until_first_reservation_minutes,
                row.time_until_last_reservation_minutes,
                row.reservation_duration_minutes,
                row.monday_opening,
                row.tuesday_opening,
                row.wednesday_opening,
                row.thursday_opening,
                row.friday_opening,
                row.saturday_opening,
                row.sunday_opening,
                row.monday_closing,
                row.tuesday_closing,
                row.wednesday_closing,
                row.thursday_closing,
                row.friday_closing,
                row.saturday_closing,
                row.sunday_closing
            );

            return restaurant
        } catch (err) {
            throw err
        };
    };

    static async findByPhoneNumber(number: string): Promise<Restaurant | null> {
        try {
            const res = await db.query('SELECT * FROM Restaurant WHERE phone_number = $1', [number]);

            if (res.rows.length == 0) {
                return null;
            };

            const row: RestaurantProperties = res.rows[0]

            const restaurant = new Restaurant(
                row.restaurant_name,
                row.restaurant_address,
                row.email,
                row.phone_number,
                row.password_hash,
                row.id,
                row.active_layout_id,
                row.auth_token_hash,
                row.time_zone,
                row.time_until_first_reservation_minutes,
                row.time_until_last_reservation_minutes,
                row.reservation_duration_minutes,
                row.monday_opening,
                row.tuesday_opening,
                row.wednesday_opening,
                row.thursday_opening,
                row.friday_opening,
                row.saturday_opening,
                row.sunday_opening,
                row.monday_closing,
                row.tuesday_closing,
                row.wednesday_closing,
                row.thursday_closing,
                row.friday_closing,
                row.saturday_closing,
                row.sunday_closing
            );

            return restaurant
        } catch (err) {
            throw err
        };
    };

    async authenticate(password: string) {
        try {
            const isValid = await bcrypt.compare(password, this.password_hash);

            if (!isValid) {
                const err = new UnauthorizedError('Invalid password');
                throw err;
            };

            const token = await this._setToken();

            const decoded: any = jwt.decode(token);

            if (!decoded) { throw new ExpressError('Failed to generate token', 500) }

            const token_hash = await bcrypt.hash(decoded.code as string, 3);
            this.auth_token_hash = token_hash;
            await this.save();


            return token;

        } catch (err) {
            throw err;
        };
    };

    async getRestaurantInterfaces(): Promise<RestaurantInterface[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT * FROM Restaurant_Interface WHERE restaurant_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const RestaurantInterfaces: RestaurantInterface[] = res.rows.map((row: RestaurantInterfaceProperties) => new RestaurantInterface(row.restaurant_id, row.interface_name, row.tablemap_permission, row.tab_permission, row.kitchen_permission, row.shift_permission, row.time_created, row.sumup_merchant_code, row.sumup_solo_id, row.sumup_oauth2_access_token, row.sumup_oauth2_refresh_token, row.sumup_oauth2_code, row.link_code, row.token_code, row.id));
            return RestaurantInterfaces;
        } catch (err) {
            throw err;
        };
    };

    async getRestaurantEmployees(): Promise<EmployeeInfo[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT re.id, re.employee_rank, re.employment_status, re.employee_id, re.restaurant_id, e.employee_name, e.employee_email FROM Restaurant_Employee re JOIN Employee e ON re.employee_id = e.id WHERE re.restaurant_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const EmployeeInfo: EmployeeInfo[] = res.rows.map((row: RestaurantEmployeeProperties) => { return { ...row } });
            return EmployeeInfo;
        } catch (err) {
            throw err;
        };
    };

    async getTablesInActiveLayout(): Promise<RestaurantTable[]> {
        try {
            const res = await db.query(`SELECT rt.* FROM restaurant_table rt JOIN section s ON rt.section_id = s.id JOIN layout l ON s.layout_id = l.id WHERE l.id = $1;`, [this.active_layout_id]);

            const tables: RestaurantTable[] = res.rows.map((row: RestaurantTableProperties) => { return new RestaurantTable(row.table_name, row.table_status, row.reservable, row.seats, row.x, row.y, row.section_id, row.id,) })
            return tables;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    async getMenus(): Promise<Menu[]> {
        try {
            // Query the Menu table for menus belonging to this restaurant
            const res = await db.query('SELECT * FROM Menu WHERE restaurant_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new Menu instance
            const menus = res.rows.map((row: MenuProperties) => {
                // Extract the necessary properties from the row
                const { id, menu_title, restaurant_id } = row;
                return new Menu(menu_title, restaurant_id, id);
            });
            return menus;
        } catch (err) {
            throw err;
        }
    };

    async getLayouts(): Promise<Layout[]> {
        try {
            const res = await db.query('SELECT * FROM Layout WHERE restaurant_id = $1', [this.id]);


            const layouts: Layout[] = res.rows.map((row: LayoutProperties) => {
                // Extract the necessary properties from the row
                const { id, layout_name, restaurant_id } = row;
                return new Layout(layout_name, restaurant_id, id);
            });
            return layouts;
        } catch (err) {
            throw err;
        }
    };

    async getReservations(): Promise<Reservation[]> {
        try {
            const res = await db.query('SELECT * FROM Reservation WHERE restaurant_id = $1', [this.id]);

            const reservations: Reservation[] = res.rows.map((row: ReservationProperties) => {
                return new Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id,);
            });
            return reservations;
        } catch (err) {
            throw err;
        }
    };

    async getTabs(): Promise<Tab[]> {
        try {
            // Query the Tab table for tabs belonging to this restaurant
            const res = await db.query("SELECT * FROM Tab WHERE restaurant_id = $1 AND tab_status = 'open'", [this.id]);

            // Map over the resulting rows and turn each one into a new Tab instance
            const tabs: Tab[] = res.rows.map((row: TabProperties) => {
                return new Tab(row.customer_name, row.server_restaurant_employee_id, row.restaurant_table_id, row.restaurant_id, row.tab_status, row.discount, row.transaction_id, row.time_completed, row.calculated_tax, row.total_tip, row.id,);
            });
            return tabs;
        } catch (err) {
            throw err;
        }
    };

    async _setToken() {
        const token = jwt.sign({
            id: this.id,
            iat: Math.floor(Date.now() / 1000),
            code: crypto.randomBytes(16).toString('hex'),
        }, secretKey, { expiresIn: '3h' });

        return token;
    }

};

module.exports = {
    Restaurant // The class definition will be added by you
};
