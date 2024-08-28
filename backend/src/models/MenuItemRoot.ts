import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { MenuItemRootProperties, MenuItemVariationProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { MenuItemVariation } from './MenuItemVariation'; // Import MenuItemVariation from the same directory

export class MenuItemRoot extends DatabaseObject {

    static tableName = 'menu_item_root';

    constructor(
        public menu_section_id: string,
        public position: number,
        public menu_item_root_name: string,
        public base_price: number,
        public menu_item_root_description: string,
        public prep_time_required: boolean,
        public id: string | undefined = undefined,
    ) {
        const properties: MenuItemRootProperties = {
            id,
            menu_section_id,
            position,
            menu_item_root_name,
            base_price,
            menu_item_root_description,
            prep_time_required
        };
        super(properties);
    };

    static async getItemsBySectionID(IdArray: string[]) {
        try {
            const res = await db.query(`SELECT * FROM Menu_item_root WHERE menu_section_id = ANY($1)`, [IdArray]);
            const menuItemRoots = res.rows.map((row: MenuItemRootProperties) => { return new MenuItemRoot(row.menu_section_id, row.position, row.menu_item_root_name, row.base_price, row.menu_item_root_description, row.prep_time_required, row.id) })
            return menuItemRoots;

        } catch (err) {
            // Handle or throw error
            throw err;
        };
    };

    async getMenuItemVariations() {
        try {
            // Query the MenuItemVariation table for MenuItemVariation belonging to this MenuItemRoot
            const res = await db.query('SELECT * FROM menu_item_variation WHERE menu_item_root_id = $1', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuItemVariation instance
            const menuItemVariations = res.rows.map((row: MenuItemVariationProperties) => new MenuItemVariation(row.menu_item_root_id, row.menu_item_variation_description, row.price_difference, row.id));
            menuItemVariations.sort((a: MenuItemVariation, b: MenuItemVariation) => {
                if (a.description === 'No change' && b.description !== 'No change') return -1;
                if (a.description !== 'No change' && b.description === 'No change') return 1;
                return 0;
            });
            return menuItemVariations;
        } catch (err) {
            throw err;
        };
    };

};

module.exports = {
    MenuItemRoot
};