import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { MenuItemVariationProperties, MenuItemRootProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { MenuItemRoot } from './MenuItemRoot'; // Import MenuItemRoot from the same directory
import { v4 as uuidv4 } from 'uuid'
import format from 'pg-format';
import { JoinTableConstructor } from '../__utilities__/modelInterfaces'; // Import interfaces from __utilities__





export class MenuItemVariation extends DatabaseObject {

    static tableName = 'menu_item_variation';

    constructor(
        public menu_item_root_id: string,
        public menu_item_variation_description: string,
        public price_difference: number,
        public id: string | undefined = undefined,
    ) {
        const properties: MenuItemVariationProperties = {
            id,
            menu_item_root_id,
            menu_item_variation_description,
            price_difference,
        };
        super(properties);
    };

    static async getVariationsByItemRootID(IdArray: string[]) {
        try {
            const res = await db.query(`SELECT * FROM Menu_item_variation WHERE menu_item_root_id = ANY($1)`, [IdArray]);
            if (res.rows.length) {
                const menuItemVariations = res.rows.map((row: MenuItemVariationProperties) => {
                    return new this(row.menu_item_root_id, row.menu_item_variation_description, row.price_difference, row.id,)
                })
                return menuItemVariations;
            } else {
                return null; // Or however you wish to handle not finding the entry
            }
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    static async findByPK(menu_item_root_id: string, menu_item_variation_description: string) {
        try {
            const res = await db.query(`SELECT * FROM Menu_item_variation WHERE menu_item_root_id = $1 AND menu_item_variation_description = $2`, [menu_item_root_id, menu_item_variation_description]);
            if (res.rows.length) {
                const row = res.rows[0];
                return new MenuItemVariation(row.id, row.menu_item_root_id, row.menu_item_variation_description, row.price_difference);
            } else {
                return null; // Or however you wish to handle not finding the entry
            }
        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    async save() {
        if (!this.id) {
            await super.save();
            //
            const constructor = this.constructor as unknown as JoinTableConstructor;

            const reference = await constructor.findByPK(this.menu_item_root_id, this.menu_item_variation_description) as MenuItemVariation;

            const newUuid = uuidv4();
            console.log(newUuid)
            this.id = newUuid;

            const keys = Object.keys(this).filter(key => this[key] !== reference[key]);
            if (keys.length === 0) { return; }

            let updatestr = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const parameters = keys.map(key => this[key]);

            return await db.query(
                format('UPDATE menu_item_variation SET %s WHERE menu_item_root_id = $%s AND menu_item_variation_description = $%s', updatestr, parameters.length + 1, parameters.length + 2),
                [...parameters, this.menu_item_root_id, this.menu_item_variation_description]
            )
        }


        const reference = await MenuItemVariation.findById(this.id);
        if (!reference) { throw new Error('Unexpected Error'); }
        if (reference.menu_item_variation_description === 'No change') {
            throw new Error('Method Not Allowed');
        }

        return await super.save();  // Ensure the parent save method is called for updates as well
    };

    async delete() {
        if (this.id) {
            const reference = await MenuItemVariation.findById(this.id);
            if (!reference) { throw new Error('Unexpected Error') };
            if (reference.menu_item_variation_description == 'Base') {
                throw new Error('Method Not Allowed');
            };
        };
        super.delete();
    };

};

module.exports = {
    MenuItemVariation
};