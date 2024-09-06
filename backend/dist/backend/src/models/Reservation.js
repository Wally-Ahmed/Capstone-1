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
exports.Reservation = void 0;
const db_1 = __importDefault(require("../__utilities__/db")); // Adjust the import path according to your project structure
const DatabaseObject_1 = require("./DatabaseObject"); // Import DatabaseObject from the same directory
class Reservation extends DatabaseObject_1.DatabaseObject {
    constructor(party_size, reservation_time, guest_name, guest_ip, guest_phone, guest_email, restaurant_id, confirmation_status = null, restaurant_table_id = null, id = undefined) {
        const properties = {
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
        this.party_size = party_size;
        this.reservation_time = reservation_time;
        this.guest_name = guest_name;
        this.guest_ip = guest_ip;
        this.guest_phone = guest_phone;
        this.guest_email = guest_email;
        this.restaurant_id = restaurant_id;
        this.confirmation_status = confirmation_status;
        this.restaurant_table_id = restaurant_table_id;
        this.id = id;
    }
    ;
    static getReservationsByTableIDs(IdArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Reservation WHERE restaurant_table_id = ANY($1)`, [IdArray]);
                const reservations = res.rows.map((row) => {
                    return new Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id);
                });
                return reservations;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
    static getReservationsByRestaurantID(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.default.query(`SELECT * FROM Restaurant_table WHERE restaurant_id = $1`, [Id]);
                const reservations = res.rows.map((row) => {
                    return new Reservation(row.party_size, row.reservation_time, row.guest_name, row.guest_ip, row.guest_phone, row.guest_email, row.restaurant_id, row.confirmation_status, row.restaurant_table_id, row.id);
                });
                return reservations;
            }
            catch (err) {
                // Handle or throw error
                throw err;
            }
            ;
        });
    }
    ;
}
exports.Reservation = Reservation;
Reservation.tableName = 'reservation';
module.exports = {
    Reservation
};
