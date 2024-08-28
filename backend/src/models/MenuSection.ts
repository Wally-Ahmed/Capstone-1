import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { MenuSectionProperties, MenuItemRootProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { MenuItemRoot } from './MenuItemRoot'; // Import MenuItemRoot from the same directory

export class MenuSection extends DatabaseObject {

    static tableName = 'menu_section';

    constructor(
        public menu_id: string,
        public position: number,
        public menu_section_title: string,
        public id: string | undefined = undefined,
    ) {
        const properties: MenuSectionProperties = {
            id,
            menu_id,
            position,
            menu_section_title
        };
        super(properties);
    };



    // static async getSectionsByMenuID(IdArray: string[]) {
    //     try {
    //         const res = await db.query(`SELECT * FROM Menu_section WHERE menu_id = ANY($1)`, [IdArray]);
    //         if (res.rows.length) {
    //             const menuSections = res.rows.map((row: MenuSectionProperties) => { return new MenuSection(row.menu_id, row.position, row.menu_section_title, row.id) })
    //             return menuSections;
    //         } else {
    //             return null; // Or however you wish to handle not finding the entry
    //         }
    //     } catch (err) {
    //         // Handle or throw error
    //         throw err;
    //     };
    // };

    async getMenuItemRoots() {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT * FROM Menu_item_root WHERE menu_section_id = $1 ORDER BY position ASC', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const menuItemRoots = res.rows.map((row: MenuItemRootProperties) => new MenuItemRoot(row.menu_section_id, row.position, row.menu_item_root_name, row.base_price, row.menu_item_root_description, row.prep_time_required, row.id));
            menuItemRoots.forEach(async (item: MenuItemRoot, index: number) => { if (item.position !== index) { item.position = index; await item.save() }; });
            return menuItemRoots;
        } catch (err) {
            throw err;
        };
    };

    async reindexMenuItemRoots() {
        const menuItemRoots = await this.getMenuItemRoots();
        return menuItemRoots;
    };

};

module.exports = {
    MenuSection
};