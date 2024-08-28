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
const Layout_1 = require("../../models/Layout");
const Section_1 = require("../../models/Section");
const RestaurantTable_1 = require("../../models/RestaurantTable");
const validateSchema_1 = require("../../__utilities__/validateSchema");
const layoutSchema_1 = __importDefault(require("./schemas/layoutSchema"));
const sectionSchema_1 = __importDefault(require("./schemas/sectionSchema"));
const tableSchema_1 = __importDefault(require("./schemas/tableSchema"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/layout')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const layouts = yield restaurant.getLayouts();
        res.status(200).json({ layouts });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(layoutSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_name } = req.body;
    try {
        const { restaurant } = req;
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        if (restaurant.id === undefined) {
            throw new expressError_1.ExpressError('Unexpected Error', 500);
        }
        ;
        const layout = new Layout_1.Layout(layout_name || '', restaurant.id);
        yield layout.save();
        res.status(201).json({ layout });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id')
    .get(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id } = req.params;
    try {
        const layout = yield Layout_1.Layout.findById(layout_id);
        if (!layout) {
            throw new expressError_1.NotFoundError('Layout not found');
        }
        ;
        const fullLayout = yield layout.getFullLayout();
        res.status(200).json({ layout: fullLayout });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
    ;
}))
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(layoutSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id } = req.params;
    const { layout_name } = req.body;
    try {
        const layout = yield Layout_1.Layout.findById(layout_id);
        if (!layout) {
            throw new expressError_1.NotFoundError('Layout not found');
        }
        ;
        if (layout_name) {
            layout.layout_name = layout_name;
            yield layout.save();
        }
        ;
        res.status(200).json({ layout });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id } = req.params;
    try {
        const layout = yield Layout_1.Layout.findById(layout_id);
        if (!layout) {
            throw new expressError_1.NotFoundError('Layout not found');
        }
        ;
        yield layout.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id/set-active')
    .post(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id } = req.params;
    try {
        const layout = yield Layout_1.Layout.findById(layout_id);
        if (!layout) {
            throw new expressError_1.NotFoundError('Layout not found');
        }
        ;
        const restaurant = req.restaurant;
        restaurant.active_layout_id = layout.id;
        yield restaurant.save();
        // console.log('hit', restaurant.active_layout_id)
        // const fullLayout = await layout.getFullLayout();
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id/section')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(sectionSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id } = req.params;
    const { section_name, width, height } = req.body;
    try {
        const layout = yield Layout_1.Layout.findById(layout_id);
        if (!layout) {
            throw new expressError_1.NotFoundError('Layout not found');
        }
        ;
        if (!section_name || !width || !height) {
            throw new expressError_1.BadRequestError('Required parameters are missing');
        }
        ;
        const sections = yield layout.getSections();
        if (layout.id === undefined) {
            throw new expressError_1.ExpressError('Unexpected Error', 500);
        }
        ;
        const section = new Section_1.Section(section_name || '', width || 1, height || 1, sections.length, layout.id);
        yield section.save();
        res.status(201).json({ section });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id/section/:section_id')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(sectionSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id, section_id } = req.params;
    const { section_name, width, height } = req.body;
    // Prepare the updates object
    const updates = Object.assign(Object.assign(Object.assign({}, (section_name !== undefined && { section_name })), (width !== undefined && { width })), (height !== undefined && { height }));
    try {
        const section = yield Section_1.Section.findById(section_id);
        if (!section) {
            throw new expressError_1.NotFoundError('Section not found');
        }
        ;
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        // Makes sure occupied tiles cannot be removed
        const tablesInDimensions = yield section.getTablesOutDimensions(width, height);
        if (tablesInDimensions.length > 0) {
            throw new expressError_1.ForbiddenError('Cannot remove tiles that have tables on them');
        }
        ;
        // Update the restaurant instance with new values
        Object.keys(updates).forEach((key) => {
            section[key] = updates[key];
        });
        // Save the updated restaurant back to the database
        yield section.save();
        res.status(201).json({ layoutSection: section });
    }
    catch (err) {
        next(err);
    }
    ;
})).delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant } = req;
    const { layout_id, section_id } = req.params;
    try {
        // const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;
        // if (!restaurantTable) { throw new NotFoundError('Table not found') };
        if (restaurant === undefined) {
            throw new expressError_1.UnauthorizedError();
        }
        ;
        const section = yield Section_1.Section.findById(section_id);
        if (section === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!section) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        // check to see if table status is available before deleting table
        // if (restaurantTable.table_status !== 'available') {
        //     throw new ForbiddenError('Table cannot be deleted when in use');
        // };
        const tables = (yield section.getTables()).map(table => table.table_status);
        if (tables.includes('on-hold') || tables.includes('occupied')) {
            throw new expressError_1.ForbiddenError('Section cannot be deleted when in use');
        }
        yield section.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
;
router.route('/layout/:layout_id/section/:section_id/table')
    .post(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(tableSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id, section_id } = req.params;
    const { table_name, table_status, reservable, seats, x, y } = req.body;
    try {
        const section = yield Section_1.Section.findById(section_id);
        if (section === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!section) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!table_name || !table_status || !reservable || !seats || typeof x !== 'number' || typeof y !== 'number') {
            throw new expressError_1.BadRequestError('Required parameters are missing');
        }
        ;
        const ref = yield RestaurantTable_1.RestaurantTable.findByLocation(section_id, x, y);
        if (ref !== null) {
            throw new expressError_1.ForbiddenError('A table already exists in the location');
        }
        ;
        const restaurantTable = new RestaurantTable_1.RestaurantTable(table_name, table_status, reservable, seats, x, y, section_id);
        yield restaurantTable.save();
        if (restaurantTable.id === undefined) {
            throw new expressError_1.ExpressError('Unexpected Error', 500);
        }
        ;
        res.status(201).json({ table: restaurantTable });
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id/section/:section_id/table/:table_id')
    .patch(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id, section_id, table_id } = req.params;
    const { table_name, reservable, seats } = req.body;
    // Prepare the updates object
    const updates = Object.assign(Object.assign(Object.assign({}, (table_name !== undefined && { table_name })), (reservable !== undefined && { reservable })), (seats !== undefined && { seats }));
    try {
        const restaurantTable = yield RestaurantTable_1.RestaurantTable.findById(table_id);
        if (!restaurantTable) {
            throw new expressError_1.NotFoundError('Table not found');
        }
        ;
        const section = yield Section_1.Section.findById(section_id);
        if (section === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!section) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        // check to see if table status is available before altering table
        if (restaurantTable.table_status !== 'available') {
            throw new expressError_1.ForbiddenError('Table cannot be modified while occupied');
        }
        ;
        // Update the restaurant instance with new values
        Object.keys(updates).forEach(key => {
            restaurantTable[key] = updates[key];
        });
        // Save the updated restaurant back to the database
        yield restaurantTable.save();
        res.status(200).json({ table: restaurantTable });
    }
    catch (err) {
        next(err);
    }
    ;
}))
    .delete(authenticateToken_1.authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id, section_id, table_id } = req.params;
    try {
        const restaurantTable = yield RestaurantTable_1.RestaurantTable.findById(table_id);
        if (!restaurantTable) {
            throw new expressError_1.NotFoundError('Table not found');
        }
        ;
        const section = yield Section_1.Section.findById(section_id);
        if (section === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!section) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        // check to see if table status is available before deleting table
        if (restaurantTable.table_status !== 'available') {
            throw new expressError_1.ForbiddenError('Table cannot be deleted when in use');
        }
        ;
        yield restaurantTable.delete();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
    ;
}));
router.route('/layout/:layout_id/section/:section_id/table/:table_id/reposition')
    .patch(authenticateToken_1.authenticateAdmin, (0, validateSchema_1.validateSchema)(tableSchema_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { layout_id, section_id, table_id } = req.params;
    const { x, y } = req.body;
    try {
        const restaurantTable = yield RestaurantTable_1.RestaurantTable.findById(table_id);
        if (!restaurantTable) {
            throw new expressError_1.NotFoundError('Table not found');
        }
        ;
        const section = yield Section_1.Section.findById(section_id);
        if (section === null) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        if (section.layout_id !== layout_id) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        if (!section) {
            throw new expressError_1.BadRequestError('Route is not properly formatted');
        }
        ;
        const ref = yield RestaurantTable_1.RestaurantTable.findByLocation(section_id, x, y);
        if (ref !== null) {
            throw new expressError_1.ForbiddenError('A table already exists in the location');
        }
        ;
        restaurantTable.x = x;
        restaurantTable.y = y;
        yield restaurantTable.save();
        res.status(200).json({ table: restaurantTable });
    }
    catch (err) {
        next(err);
    }
    ;
}));
exports.default = router;
