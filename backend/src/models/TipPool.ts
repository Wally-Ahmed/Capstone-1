import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { TipPoolProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../__utilities__/expressError';

export class TipPool extends DatabaseObject {

    static tableName = 'tip_pool';

    constructor(
        public restaurant_id: string,
        public date: Date,
        public amount: number,
        public id: string | undefined = undefined,
    ) {
        const properties: TipPoolProperties = {
            restaurant_id,
            date,
            id,
            amount
        };
        super(properties);
    }

    static async findByDate(date: Date): Promise<TipPool | null> {
        try {
            const res = await db.query(`SELECT * FROM tip_pool WHERE date = $1`, [date]);
            if (res.rows.length > 0) {
                const row: TipPoolProperties = res.rows[0];
                return new TipPool(row.restaurant_id, row.date, row.amount, row.id);
            } else {
                return null;
            };
        } catch (err) {
            throw err;
        };
    };
};

module.exports = { TipPool };