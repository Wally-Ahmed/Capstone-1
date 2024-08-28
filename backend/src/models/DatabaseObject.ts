import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import format from 'pg-format';
import { DatabaseObjectProperties, DatabaseObjectConstructor } from '../__utilities__/modelInterfaces'; // Import interfaces from __utilities__

// Define a list of valid table names for validation purposes

export class DatabaseObject {
    static tableName: string; // Define the static property
    id?: string; // UUID as a string
    [key: string]: any;  // Index signature


    constructor(properties: DatabaseObjectProperties) {
        Object.assign(this, properties);
    }

    printClassName() {
        console.log("The name of this class is:", this.constructor.name);
    }

    static getTableName(): string {
        return this.tableName;
    }

    static async findById(id: string): Promise<DatabaseObject | null> {
        const tableName = this.getTableName();

        // Decouple valid table names

        try {
            const res = await db.query(format('SELECT * FROM %I WHERE id = $1', tableName), [id]);
            if (res.rows.length) {
                const data = res.rows[0];
                const keyArr = Object.keys(data)
                const obj = new this({});
                keyArr.forEach((key) => { obj[key] = data[key] });
                return obj;
            } else {
                return null; // Or however you wish to handle not finding the entry
            }
        } catch (err) {
            throw err;
        }
    }

    static async getAll(): Promise<DatabaseObject[]> {
        const tableName = format('%I', (this.constructor as typeof DatabaseObject).tableName);

        try {
            const res = await db.query(format('SELECT * FROM %I', tableName));
            return res.rows.map((row: any) => new this(row));
        } catch (err) {
            throw err;
        }
    }


    async save(): Promise<void> {
        const cls = getCls(this);
        const tableName = cls.tableName;


        if (this.id === undefined) {
            // Insert new record
            const keys: string[] = Object.keys(this).filter(value => value !== 'id');
            const values: any[] = keys.map((key: string): any => this[key]);
            let columns = keys.join(', ');
            let valuesPlaceholders = keys.map((_, index) => `$${index + 1}`).join(', ');


            try {
                const result = await db.query(
                    format('INSERT INTO %I (%s) VALUES (%s) RETURNING id', tableName, columns, valuesPlaceholders),
                    values
                );
                this.id = result.rows[0].id;
            } catch (err) {
                throw err;
            }
        } else {
            // Update existing record
            const constructor = this.constructor as unknown as DatabaseObjectConstructor;

            try {
                const reference = await constructor.findById(this.id);
                if (!reference) { throw new Error('Instance no longer Exists'); }
                const keys = Object.keys(this).filter(key => this[key] !== reference[key]);
                if (keys.length === 0) { return; }

                let updatestr = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

                const parameters = keys.map(key => this[key]);
                const res = await db.query(
                    format('UPDATE %I SET %s WHERE id = $%s RETURNING *', tableName, updatestr, parameters.length + 1),
                    [...parameters, this.id]
                );

                const updatedObj = res.rows[0];
                if (updatedObj) {
                    keys.forEach(key => { this[key] = updatedObj[key]; });
                }

            } catch (err) {
                throw err;
            }
        }
    }

    async delete(): Promise<void> {
        const tableName = format('%I', (this.constructor as typeof DatabaseObject).tableName);



        if (!this.id) {
            throw new Error('Instance must have an id to be deleted');
        }

        try {
            await db.query(format('DELETE FROM %I WHERE id = $1', tableName), [this.id]);

            Object.keys(this).forEach(key => {
                delete this[key];
            });
        } catch (err) {
            throw err;
        }
    }
};

function getCls(instance: DatabaseObject): any {
    return instance.constructor;
}

module.exports = { DatabaseObject };