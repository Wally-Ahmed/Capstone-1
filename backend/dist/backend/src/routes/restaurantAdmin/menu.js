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
const express_1 = __importDefault(require("express"));
const expressError_1 = require("../../__utilities__/expressError");
const authenticateToken_1 = require("../../__utilities__/authenticateToken");
const Menu_1 = require("../../models/Menu");
const MenuSection_1 = require("../../models/MenuSection");
const MenuItemRoot_1 = require("../../models/MenuItemRoot");
const MenuItemVariation_1 = require("../../models/MenuItemVariation");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const menuSchema_1 = __importDefault(require("./schemas/menuSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/menu')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const menus = yield restaurant.getMenus();
        res.status(200).json({ menus });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_title } = req.body;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const menu = new Menu_1.Menu(menu_title || '', restaurant.id);
        yield menu.save();
        res.status(201).json({ menu });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id } = req.params;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (!menu) {
            throw new expressError_1.NotFoundError('Menu not found');
        }
        ;
        const fullMenu = yield menu.getFullMenu();
        // console.log(fullMenu.MenuSections[0])
        res.status(200).json({ menu: fullMenu });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id } = req.params;
    const { menu_title } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (!menu) {
            throw new expressError_1.NotFoundError('Menu not found');
        }
        ;
        if (menu_title) {
            menu.menu_title = menu_title;
            yield menu.save();
        }
        ;
        res.status(200).json({ menu });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id } = req.params;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (!menu) {
            throw new expressError_1.NotFoundError('Menu not found');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        yield menu.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id } = req.params;
    const { menu_section_title } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (!menu) {
            throw new expressError_1.NotFoundError('Menu not found');
        }
        ;
        const menuSections = yield menu.getMenuSections();
        const menuSection = new MenuSection_1.MenuSection(menu.id, menuSections.length, menu_section_title);
        console.log('hitterr', menu_section_title);
        yield menuSection.save();
        res.status(201).json({ menuSection });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id: menu_section_id } = req.params;
    const { menu_section_title } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuSection = yield MenuSection_1.MenuSection.findById(menu_section_id);
        if (menuSection === null) {
            throw new expressError_1.NotFoundError('Menu section not found');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        if (menu_section_title) {
            menuSection.menu_section_title = menu_section_title;
            yield menuSection.save();
        }
        ;
        res.status(200).json({ menuSection });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id } = req.params;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.NotFoundError('Menu section not found');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        yield menuSection.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id/reposition')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id, section_id } = req.params;
    // Destructure all possible parameters
    const { position } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.NotFoundError('Menu section not found');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (position) {
            const menuSections = yield menu.getMenuSections();
            menuSections.forEach((section) => __awaiter(void 0, void 0, void 0, function* () { if (section.position >= position) {
                section.position += 1;
                yield section.save();
            } }));
            menuSection.position = position;
            yield menuSection.save();
            yield menu.reindexMenuSections();
        }
        ;
        res.status(200).json({ menuSection });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id/item')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id, section_id } = req.params;
    const { menu_item_root_name, base_price, menu_item_root_description, prep_time_required } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!menu_item_root_name || !base_price || !menu_item_root_description || typeof prep_time_required !== 'boolean') {
            throw new expressError_1.BadRequestError('Required parameters are missing');
        }
        ;
        const menuItemRoots = yield menuSection.getMenuItemRoots();
        const menuItemRoot = new MenuItemRoot_1.MenuItemRoot(section_id, menuItemRoots.length, menu_item_root_name, parseFloat(`${base_price}`), menu_item_root_description, prep_time_required);
        yield menuItemRoot.save();
        const menuItemVariation = new MenuItemVariation_1.MenuItemVariation(menuItemRoot.id, 'Base', 0, undefined);
        yield menuItemVariation.save();
        console.log('hhhh', menuItemVariation);
        res.status(201).json({ menuItemRoot });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id/item/:item_id')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id, item_id } = req.params;
    // Destructure all possible parameters
    const { menu_item_root_name, base_price, menu_item_root_description, } = req.body;
    // Prepare the updates object
    const updates = Object.assign(Object.assign(Object.assign({}, (menu_item_root_name !== undefined && { menu_item_root_name })), (base_price !== undefined && { base_price })), (menu_item_root_description !== undefined && { menu_item_root_description }));
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItem = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItem) {
            throw new expressError_1.NotFoundError('Menu item not found');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        // Update the restaurant instance with new values
        Object.keys(updates).forEach(key => {
            menuItem[key] = updates[key];
        });
        // Save the updated restaurant back to the database
        yield menuItem.save();
        res.status(200).json({ menuItem });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id, item_id } = req.params;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemRoot = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItemRoot) {
            throw new expressError_1.NotFoundError('Menu item not found');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        yield menuItemRoot.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id/item/:item_id/reposition')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id, menu_section_id, item_id } = req.params;
    // Destructure all possible parameters
    const { position, menu_section_id: new_menu_section_id } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(menu_section_id);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItem = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItem) {
            throw new expressError_1.NotFoundError('Menu item not found');
        }
        ;
        if (!menu_section_id || !new_menu_section_id) {
            throw new expressError_1.BadRequestError('Required parameters are missing');
        }
        ;
        if (new_menu_section_id == menu_section_id) {
            const menuItems = yield menuSection.getMenuItemRoots();
            menuItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () { if (item.position >= position) {
                item.position += 1;
                yield item.save();
            } }));
            menuItem.position = position;
            yield menuItem.save();
            yield menuSection.reindexMenuItemRoots();
        }
        else {
            const newMenuSection = yield MenuSection_1.MenuSection.findById(new_menu_section_id);
            if (newMenuSection === null) {
                throw new expressError_1.BadRequestError('Route is not properly formatted');
            }
            const menuItems = yield newMenuSection.getMenuItemRoots();
            menuItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () { if (item.position >= position) {
                item.position += 1;
                yield item.save();
            } }));
            menuItem.menu_section_id = new_menu_section_id;
            menuItem.position = position;
            yield menuItem.save();
            yield menuSection.reindexMenuItemRoots();
            yield newMenuSection.reindexMenuItemRoots();
        }
        ;
        res.status(200).json({ menuItem });
    }
    catch (err) {
        next(err);
    }
    ;
}));
////////
router.route('/menu/:menu_id/section/:section_id/item/:item_id/variation')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { menu_id, section_id, item_id } = req.params;
    const { menu_item_variation_description, price_difference, } = req.body;
    try {
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemRoot = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItemRoot) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!menu_item_variation_description || !price_difference) {
            throw new expressError_1.BadRequestError('Required parameters are missing');
        }
        ;
        const menuItemVariations = yield menuItemRoot.getMenuItemVariations();
        let isDuplicate = false;
        for (const variation of menuItemVariations) {
            if (variation.menu_item_root_description == menu_item_variation_description) {
                isDuplicate = true;
                break;
            }
            ;
        }
        ;
        if (isDuplicate) {
            throw new expressError_1.ExpressError('Variation already exist', 409);
        }
        ;
        const menuItemVariation = new MenuItemVariation_1.MenuItemVariation(menuItemRoot.id, menu_item_variation_description, parseFloat(`${price_difference}`));
        yield menuItemVariation.save();
        res.status(201).json({ menuItemVariation });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/menu/:menu_id/section/:section_id/item/:item_id/variation/:variation_id')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(menuSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id, item_id, variation_id } = req.params;
    // Destructure all possible parameters
    const { price_difference, menu_item_variation_description } = req.body;
    7;
    try {
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemRoot = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItemRoot) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemVariation = yield MenuItemVariation_1.MenuItemVariation.findById(variation_id);
        if (!menuItemVariation) {
            throw new expressError_1.NotFoundError('Menu item variation not found');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        if (menuItemVariation.menu_item_variation_description == 'No change') {
            throw new expressError_1.ForbiddenError('Cannot modify base variation');
        }
        ;
        if (price_difference) {
            menuItemVariation.price_difference = price_difference;
            yield menuItemVariation.save();
        }
        ;
        if (menu_item_variation_description) {
            menuItemVariation.menu_item_variation_description = menu_item_variation_description;
            yield menuItemVariation.save();
        }
        res.status(200).json({ menuItemVariation });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = req.restaurant;
    const { menu_id, section_id, item_id, variation_id } = req.params;
    try {
        const menuSection = yield MenuSection_1.MenuSection.findById(section_id);
        const menu = yield Menu_1.Menu.findById(menu_id);
        if (menu === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        console.log(menuSection);
        if (menuSection === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (menu.id !== menuSection.menu_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemRoot = yield MenuItemRoot_1.MenuItemRoot.findById(item_id);
        if (!menuItemRoot) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const menuItemVariation = yield MenuItemVariation_1.MenuItemVariation.findById(variation_id);
        if (!menuItemVariation) {
            throw new expressError_1.NotFoundError('Menu item variation not found');
        }
        ;
        const tabs = yield restaurant.getTabs();
        if (tabs.length) {
            throw new expressError_1.ForbiddenError('Cannot modify menu when tabs are still open');
        }
        ;
        if (menuItemVariation.menu_item_variation_description == 'No change') {
            throw new expressError_1.ForbiddenError('Cannot delete base variation');
        }
        ;
        yield menuItemVariation.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
