import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { ReservationProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory

export class Reservation extends DatabaseObject {

    static tableName = 'reservation';

    constructor(
        public party_size: number,
        public reservation_time: Date,
        public guest_name: string,
        public guest_ip: string | null,
        public guest_phone: string,
        public guest_email: string,
        public restaurant_id: string,
        public confirmation_status: string | null = null,
        public restaurant_table_id: string | null = null,
        public id: string | undefined = undefined,
    ) {
        const properties: ReservationProperties = {
            id,
            party_size,
            reservation_time,
            confirmation_status,
            guest_name,
            guest_ip,
            guest_phone,
            guest_email,
            restaurant_table_id,
            restaurant_id
        };
        super(properties);
    };

    static async getReservationsByTableIDs(IdArray: string[]): Promise<Reservation[]> {
        try {
            const res = await db.query(`SELECT * FROM Reservation WHERE restaurant_table_id = ANY($1)`, [IdArray]);
            const reservations: Reservation[] = res.rows.map((row: ReservationProperties): Reservation => {
                return new Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id,)
            })
            return reservations;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    static async getReservationsByRestaurantID(Id: string): Promise<Reservation[]> {
        try {
            const res = await db.query(`SELECT * FROM Restaurant_table WHERE restaurant_id = $1`, [Id]);
            const reservations: Reservation[] = res.rows.map((row: ReservationProperties): Reservation => {
                return new Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id,)
            })
            return reservations;
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

}

module.exports = {
    Reservation
};