import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateAdmin } from '../../__utilities__/authenticateToken'
import { Menu } from '../../models/Menu';
import { MenuSection } from '../../models/MenuSection';
import { MenuItemRoot } from '../../models/MenuItemRoot';
import { MenuItemVariation } from '../../models/MenuItemVariation';
import { validateSchema } from '../../__utilities__/validateSchema';
import menuSchema from './schemas/menuSchema';
import { Restaurant } from '../../models/Restaurant';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());


router.route('/menu')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const menus = await restaurant.getMenus();

            res.status(200).json({ menus });
        } catch (err) {
            next(err);
        };
    })
    .post(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_title }: { menu_title: string } = req.body;


        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const menu = new Menu(menu_title || '', restaurant.id as string);
            await menu.save();

            res.status(201).json({ menu });
        } catch (err) {
            next(err);
        };
    });

router.route('/menu/:menu_id')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id } = req.params;
        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (!menu) {
                throw new NotFoundError('Menu not found');
            };

            const fullMenu = await menu.getFullMenu();

            // console.log(fullMenu.MenuSections[0])


            res.status(200).json({ menu: fullMenu });
        } catch (err) {
            next(err);
        };
    })
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id } = req.params;
        const { menu_title }: { menu_title: string } = req.body;

        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (!menu) {
                throw new NotFoundError('Menu not found');
            };
            if (menu_title) {
                menu.menu_title = menu_title;
                await menu.save();
            };

            res.status(200).json({ menu });
        } catch (err) {
            next(err);
        };
    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id } = req.params;
        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (!menu) {
                throw new NotFoundError('Menu not found');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };
            await menu.delete();

            res.sendStatus(204)
        } catch (err) {
            next(err);
        };
    });

router.route('/menu/:menu_id/section')
    .post(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id } = req.params;
        const { menu_section_title }: { menu_section_title: string } = req.body;



        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (!menu) {
                throw new NotFoundError('Menu not found');
            };

            const menuSections = await menu.getMenuSections();

            const menuSection = new MenuSection(menu.id as string, menuSections.length, menu_section_title);
            console.log('hitterr', menu_section_title);
            await menuSection.save();

            res.status(201).json({ menuSection });
        } catch (err) {
            next(err);
        };
    });

router.route('/menu/:menu_id/section/:section_id')
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id: menu_section_id } = req.params;
        const { menu_section_title }: { menu_section_title: string } = req.body;
        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') };
            const menuSection = await MenuSection.findById(menu_section_id) as MenuSection | null;
            if (menuSection === null) { throw new NotFoundError('Menu section not found') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };
            if (menu_section_title) {
                menuSection.menu_section_title = menu_section_title;
                await menuSection.save();
            };

            res.status(200).json({ menuSection });
        } catch (err) {
            next(err);
        };

    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id } = req.params;

        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new NotFoundError('Menu section not found') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };
            await menuSection.delete();

            res.sendStatus(204);
        } catch (err) {
            next(err);
        };

    });


router.route('/menu/:menu_id/section/:section_id/reposition')
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id, section_id } = req.params;
        // Destructure all possible parameters
        const { position }: { position: number } = req.body;


        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new NotFoundError('Menu section not found') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            if (position) {
                const menuSections = await menu.getMenuSections();
                menuSections.forEach(async (section: MenuSection) => { if (section.position >= position) { section.position += 1; await section.save() } });
                menuSection.position = position;
                await menuSection.save();
                await menu.reindexMenuSections();
            };

            res.status(200).json({ menuSection });
        } catch (err) {
            next(err);
        };

    })

router.route('/menu/:menu_id/section/:section_id/item')
    .post(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id, section_id } = req.params;
        const { menu_item_root_name, base_price, menu_item_root_description, prep_time_required }: { menu_item_root_name: string, base_price: number, menu_item_root_description: string, prep_time_required: boolean, } = req.body;


        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new BadRequestError('Route is not properly formatted') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };

            if (!menu_item_root_name || !base_price || !menu_item_root_description || typeof prep_time_required !== 'boolean') { throw new BadRequestError('Required parameters are missing') };


            const menuItemRoots = await menuSection.getMenuItemRoots();

            const menuItemRoot = new MenuItemRoot(section_id, menuItemRoots.length, menu_item_root_name, parseFloat(`${base_price}`), menu_item_root_description, prep_time_required)
            await menuItemRoot.save();

            const menuItemVariation = new MenuItemVariation(menuItemRoot.id as string, 'Base', 0, undefined)
            await menuItemVariation.save()

            console.log('hhhh', menuItemVariation)

            res.status(201).json({ menuItemRoot });

        } catch (err) {
            next(err);
        };
    });


// Define the type for the updates
interface MenuItemUpdates {
    [key: string]: string | number | null | undefined;
    menu_item_root_name?: string | null;
    base_price?: number | null;
    menu_item_root_description?: string | null;
}

router.route('/menu/:menu_id/section/:section_id/item/:item_id')
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id, item_id } = req.params;
        // Destructure all possible parameters
        const { menu_item_root_name, base_price, menu_item_root_description, }: { menu_item_root_name: string, base_price: number, menu_item_root_description: string, } = req.body;

        // Prepare the updates object
        const updates: MenuItemUpdates = {
            ...(menu_item_root_name !== undefined && { menu_item_root_name }),
            ...(base_price !== undefined && { base_price }),
            ...(menu_item_root_description !== undefined && { menu_item_root_description })
        };

        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new BadRequestError('Route is not properly formatted') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItem = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItem) {
                throw new NotFoundError('Menu item not found');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };


            // Update the restaurant instance with new values
            Object.keys(updates).forEach(key => {
                menuItem[key] = updates[key];
            });

            // Save the updated restaurant back to the database

            await menuItem.save();

            res.status(200).json({ menuItem });
        } catch (err) {
            next(err);
        };

    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id, item_id } = req.params;

        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new BadRequestError('Route is not properly formatted') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemRoot = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItemRoot) {
                throw new NotFoundError('Menu item not found');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };


            await menuItemRoot.delete();

            res.sendStatus(204);
        } catch (err) {
            next(err);
        };
    });

router.route('/menu/:menu_id/section/:section_id/item/:item_id/reposition')
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id, menu_section_id, item_id } = req.params;
        // Destructure all possible parameters
        const { position, menu_section_id: new_menu_section_id }: { position: number, menu_section_id: string } = req.body;

        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(menu_section_id) as MenuSection | null;
            if (menuSection === null) { throw new BadRequestError('Route is not properly formatted') }
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItem = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItem) {
                throw new NotFoundError('Menu item not found');
            };

            if (!menu_section_id || !new_menu_section_id) { throw new BadRequestError('Required parameters are missing') };


            if (new_menu_section_id == menu_section_id) {
                const menuItems = await menuSection.getMenuItemRoots();
                menuItems.forEach(async (item: MenuItemRoot) => { if (item.position >= position) { item.position += 1; await item.save() } });
                menuItem.position = position;
                await menuItem.save();
                await menuSection.reindexMenuItemRoots();
            } else {
                const newMenuSection = await MenuSection.findById(new_menu_section_id) as MenuSection | null;
                if (newMenuSection === null) { throw new BadRequestError('Route is not properly formatted') }

                const menuItems = await newMenuSection.getMenuItemRoots();
                menuItems.forEach(async (item: MenuItemRoot) => { if (item.position >= position) { item.position += 1; await item.save() } });

                menuItem.menu_section_id = new_menu_section_id;
                menuItem.position = position;

                await menuItem.save();
                await menuSection.reindexMenuItemRoots();
                await newMenuSection.reindexMenuItemRoots();
            };

            res.status(200).json({ menuItem });
        } catch (err) {
            next(err);
        };

    })

////////
router.route('/menu/:menu_id/section/:section_id/item/:item_id/variation')
    .post(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { menu_id, section_id, item_id } = req.params;
        const { menu_item_variation_description, price_difference, }: { menu_item_variation_description: string, price_difference: number } = req.body;


        try {
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            if (menuSection === null) { throw new BadRequestError('Route is not properly formatted') };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemRoot = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItemRoot) {
                throw new BadRequestError('Route is not properly formatted');
            };

            if (!menu_item_variation_description || !price_difference) { throw new BadRequestError('Required parameters are missing') };


            const menuItemVariations = await menuItemRoot.getMenuItemVariations();

            let isDuplicate = false;
            for (const variation of menuItemVariations) {
                if (variation.menu_item_root_description == menu_item_variation_description) { isDuplicate = true; break; };
            };
            if (isDuplicate) {
                throw new ExpressError('Variation already exist', 409);
            };


            const menuItemVariation = new MenuItemVariation(menuItemRoot.id as string, menu_item_variation_description, parseFloat(`${price_difference}`))
            await menuItemVariation.save()

            res.status(201).json({ menuItemVariation });

        } catch (err) {
            next(err);
        };
    });

router.route('/menu/:menu_id/section/:section_id/item/:item_id/variation/:variation_id')
    .patch(authenticateAdmin, validateSchema(menuSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id, item_id, variation_id } = req.params;
        // Destructure all possible parameters
        const { price_difference, menu_item_variation_description }: { price_difference: number, menu_item_variation_description: string } = req.body; 7


        try {
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            const menu = await Menu.findById(menu_id) as Menu | null;

            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }
            if (menuSection === null) {
                throw new BadRequestError('Route is not properly formatted')
            };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemRoot = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItemRoot) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemVariation = await MenuItemVariation.findById(variation_id) as MenuItemVariation | null;
            if (!menuItemVariation) {
                throw new NotFoundError('Menu item variation not found');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };
            if (menuItemVariation.menu_item_variation_description == 'No change') {
                throw new ForbiddenError('Cannot modify base variation');
            };
            if (price_difference) {
                menuItemVariation.price_difference = price_difference;
                await menuItemVariation.save();
            };
            if (menu_item_variation_description) {
                menuItemVariation.menu_item_variation_description = menu_item_variation_description;
                await menuItemVariation.save();
            }

            res.status(200).json({ menuItemVariation });
        } catch (err) {
            next(err);
        };

    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const restaurant = req.restaurant as Restaurant;
        const { menu_id, section_id, item_id, variation_id } = req.params;


        try {
            const menuSection = await MenuSection.findById(section_id) as MenuSection | null;
            const menu = await Menu.findById(menu_id) as Menu | null;
            if (menu === null) { throw new BadRequestError('Route is not properly formatted') }

            console.log(menuSection);
            if (menuSection === null) {
                throw new BadRequestError('Route is not properly formatted')
            };
            if (menu.id !== menuSection.menu_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemRoot = await MenuItemRoot.findById(item_id) as MenuItemRoot | null;
            if (!menuItemRoot) {
                throw new BadRequestError('Route is not properly formatted');
            };
            const menuItemVariation = await MenuItemVariation.findById(variation_id) as MenuItemVariation | null;
            if (!menuItemVariation) {
                throw new NotFoundError('Menu item variation not found');
            };
            const tabs = await restaurant.getTabs();
            if (tabs.length) {
                throw new ForbiddenError('Cannot modify menu when tabs are still open');
            };
            if (menuItemVariation.menu_item_variation_description == 'No change') {
                throw new ForbiddenError('Cannot delete base variation');
            };

            await menuItemVariation.delete();

            res.sendStatus(204);
        } catch (err) {
            next(err);
        };

    });

export default router;