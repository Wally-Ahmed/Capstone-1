import { string } from 'pg-format';
import db from '../__utilities__/db'; // Adjust the import path according to your project structure
import { MenuProperties, MenuSectionProperties, MenuItemRootProperties, MenuItemVariationProperties } from '../__utilities__/modelInterfaces'; // Import interfaces from ObjectInterfaces
import { DatabaseObject } from './DatabaseObject'; // Import DatabaseObject from the same directory
import { MenuSection } from './MenuSection'; // Import MenuSection from the same directory
import { MenuItemRoot } from './MenuItemRoot'; // Import MenuItemRoot from the same directory
import { MenuItemVariation } from './MenuItemVariation'; // Import MenuItemVariation from the same directory


interface fullItemRoot extends MenuItemRootProperties {
    id: string,
    MenuItemVariations: MenuItemVariation[],
}

interface fullMenuSection extends MenuSectionProperties {
    id: string,
    MenuItemRoots: fullItemRoot[],
}

interface fullMenu {
    id: string,
    menu_title: string,
    MenuSections: fullMenuSection[],
}


export class Menu extends DatabaseObject {

    static tableName = 'menu';

    constructor(
        public menu_title: string,
        public restaurant_id: string,
        public id: string | undefined = undefined,
    ) {
        const properties: MenuProperties = {
            id,
            menu_title,
            restaurant_id
        };
        super(properties);
    };

    async getMenuSections(): Promise<MenuSection[]> {
        try {
            // Query the MenuSection table for menuSection belonging to this Menu
            const res = await db.query('SELECT * FROM Menu_section WHERE menu_id = $1 ORDER BY position ASC', [this.id]);

            // Map over the resulting rows and turn each one into a new MenuSection instance
            const menuSections: MenuSection[] = res.rows.map((row: MenuSectionProperties) => new MenuSection(row.menu_id, row.position, row.menu_section_title, row.id));
            menuSections.forEach(async (item: MenuSection, index: number) => { if (item.position !== index) { item.position = index; await item.save() }; });
            return menuSections;
        } catch (err) {
            throw err;
        };
    };

    async reindexMenuSections() {
        const menuSections = await this.getMenuSections();
        return menuSections;
    };

    async getFullMenu(): Promise<fullMenu> {
        try {
            // Check if the menu ID is defined
            if (this.id === undefined) { throw new Error(); };

            // Retrieve all MenuSection instances related to this menu
            const allMenuSections = await this.getMenuSections();

            // Retrieve all MenuItemRoot instances for the MenuSections
            const allMenuItemRoots = await MenuItemRoot.getItemsBySectionID(
                allMenuSections.map((menuSection: MenuSection): string => {
                    if (menuSection.id === undefined) { throw new Error(); }
                    return menuSection.id;
                })
            );


            // Retrieve all MenuItemVariation instances for the MenuItemRoots
            const allMenuItemVariations = await MenuItemVariation.getVariationsByItemRootID(
                allMenuItemRoots.map((menuItemRoot: MenuItemRoot): string => {
                    if (menuItemRoot.id === undefined) { throw new Error(); }
                    return menuItemRoot.id;
                })
            );

            // Build the menu sections structure by mapping over each MenuSection
            const menuSections: fullMenuSection[] = allMenuSections.map((menuSection: MenuSection) => {
                // Filter MenuItemRoots for the current MenuSection
                const menuItemRootsForSection = allMenuItemRoots.filter((itemRoot: MenuItemRoot) => itemRoot.menu_section_id === menuSection.id);

                // Build an array of MenuItemRoots with their variations
                const menuItemRoots: fullItemRoot[] = menuItemRootsForSection.map((itemRoot: MenuItemRoot) => {
                    // Filter MenuItemVariations for the current MenuItemRoot
                    const menuItemVariationsForRoot = allMenuItemVariations.filter((variation: MenuItemVariation) => variation.menu_item_root_id === itemRoot.id);

                    // Map each MenuItemVariation to a detailed structure
                    const menuItemVariations: MenuItemVariation[] = menuItemVariationsForRoot.map((menuItemVariation: MenuItemVariation) => {
                        if (menuItemVariation.id === undefined) { throw new Error(); }
                        return {
                            id: menuItemVariation.id,
                            menu_item_root_id: menuItemVariation.menu_item_root_id,
                            menu_item_variation_description: menuItemVariation.menu_item_variation_description,
                            price_difference: menuItemVariation.price_difference,
                        };
                    });

                    // Return a structured object for each MenuItemRoot


                    if (itemRoot.id === undefined) { throw new Error(); };
                    const menuItemRoot: fullItemRoot = {
                        id: itemRoot.id,
                        menu_section_id: itemRoot.menu_section_id,
                        position: itemRoot.position,
                        menu_item_root_name: itemRoot.menu_item_root_name,
                        base_price: itemRoot.base_price,
                        menu_item_root_description: itemRoot.menu_item_root_description,
                        prep_time_required: itemRoot.prep_time_required,
                        MenuItemVariations: menuItemVariations
                    };

                    return menuItemRoot;
                });

                // Return a structured object for each MenuSection

                if (menuSection.id === undefined) { throw new Error(); };
                const section: fullMenuSection = {
                    id: menuSection.id,
                    menu_id: menuSection.menu_id,
                    position: menuSection.position,
                    menu_section_title: menuSection.menu_section_title,
                    MenuItemRoots: menuItemRoots
                };

                return section;
            });

            // Construct and return the complete menu with its sections
            const menu: fullMenu = {
                id: this.id,
                menu_title: this.menu_title,
                MenuSections: menuSections
            };

            return menu;
        } catch (err) {
            // Handle any errors that might occur during the process
            throw err;
        }
    };

};

module.exports = {
    Menu
};