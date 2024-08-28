import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateAdmin } from '../../__utilities__/authenticateToken'

import { Restaurant } from '../../models/Restaurant';
import { Layout } from '../../models/Layout';
import { Section } from '../../models/Section';
import { RestaurantTable } from '../../models/RestaurantTable';
import { validateSchema } from '../../__utilities__/validateSchema'
import layoutSchema from './schemas/layoutSchema';
import sectionSchema from './schemas/sectionSchema';
import tableSchema from './schemas/tableSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());


router.route('/layout')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const layouts = await restaurant.getLayouts();

            res.status(200).json({ layouts });
        } catch (err) {
            next(err);
        };
    })
    .post(authenticateAdmin, validateSchema(layoutSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_name }: { layout_name: string } = req.body;
        try {
            const { restaurant } = req;
            if (restaurant === undefined) { throw new UnauthorizedError() };

            if (restaurant.id === undefined) { throw new ExpressError('Unexpected Error', 500) };
            const layout = new Layout(layout_name || '', restaurant.id);
            await layout.save();

            res.status(201).json({ layout });
        } catch (err) {
            next(err);
        };
    });

router.route('/layout/:layout_id')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id } = req.params;
        try {
            const layout = await Layout.findById(layout_id) as Layout | null;
            if (!layout) {
                throw new NotFoundError('Layout not found');
            };

            const fullLayout = await layout.getFullLayout();

            res.status(200).json({ layout: fullLayout });
        } catch (err) {
            console.log(err)
            next(err);
        };
    })
    .patch(authenticateAdmin, validateSchema(layoutSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id } = req.params;
        const { layout_name }: { layout_name: string } = req.body;
        try {
            const layout = await Layout.findById(layout_id) as Layout | null;
            if (!layout) {
                throw new NotFoundError('Layout not found');
            };
            if (layout_name) {
                layout.layout_name = layout_name;
                await layout.save();
            };

            res.status(200).json({ layout });
        } catch (err) {
            next(err);
        };
    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id } = req.params;
        try {
            const layout = await Layout.findById(layout_id) as Layout | null;
            if (!layout) {
                throw new NotFoundError('Layout not found');
            };
            await layout.delete();

            res.sendStatus(204)
        } catch (err) {
            next(err);
        };
    });

router.route('/layout/:layout_id/set-active')
    .post(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id } = req.params;
        try {
            const layout = await Layout.findById(layout_id) as Layout | null;
            if (!layout) {
                throw new NotFoundError('Layout not found');
            };

            const restaurant = req.restaurant as Restaurant;
            restaurant.active_layout_id = layout.id as string
            await restaurant.save()
            // console.log('hit', restaurant.active_layout_id)
            // const fullLayout = await layout.getFullLayout();

            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            next(err);
        };
    })

// Define the type for the updates
interface RestaurantLayoutSectionUpdates {
    [key: string]: string | number | null | undefined;
    section_name?: string;
    width?: number;
    height?: number;
}

router.route('/layout/:layout_id/section')
    .post(authenticateAdmin, validateSchema(sectionSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id } = req.params;
        const { section_name, width, height }: { section_name: string, width: number, height: number, } = req.body;

        try {

            const layout = await Layout.findById(layout_id) as Layout | null;
            if (!layout) {
                throw new NotFoundError('Layout not found');
            };

            if (!section_name || !width || !height) { throw new BadRequestError('Required parameters are missing') };

            const sections = await layout.getSections();

            if (layout.id === undefined) { throw new ExpressError('Unexpected Error', 500) };
            const section = new Section(section_name || '', width || 1, height || 1, sections.length, layout.id);
            await section.save();

            res.status(201).json({ section });
        } catch (err) {
            next(err);
        };
    });


router.route('/layout/:layout_id/section/:section_id')
    .patch(authenticateAdmin, validateSchema(sectionSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id, section_id } = req.params;
        const { section_name, width, height }: { section_name: string | undefined, width: number | undefined, height: number | undefined } = req.body;

        // Prepare the updates object
        const updates: RestaurantLayoutSectionUpdates = {
            ...(section_name !== undefined && { section_name }),
            ...(width !== undefined && { width }),
            ...(height !== undefined && { height })
        };

        try {

            const section = await Section.findById(section_id) as Section | null;
            if (!section) {
                throw new NotFoundError('Section not found');
            };
            if (section.layout_id !== layout_id) {
                throw new BadRequestError('Route is not properly formatted');
            };

            // Makes sure occupied tiles cannot be removed
            const tablesInDimensions = await section.getTablesOutDimensions(width, height)
            if (tablesInDimensions.length > 0) { throw new ForbiddenError('Cannot remove tiles that have tables on them') };

            // Update the restaurant instance with new values
            Object.keys(updates).forEach((key: string) => {
                section[key] = updates[key];
            });

            // Save the updated restaurant back to the database
            await section.save();

            res.status(201).json({ layoutSection: section });
        } catch (err) {
            next(err);
        };
    }).delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { restaurant } = req;
        const { layout_id, section_id } = req.params;

        try {
            // const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;
            // if (!restaurantTable) { throw new NotFoundError('Table not found') };
            if (restaurant === undefined) { throw new UnauthorizedError() };

            const section = await Section.findById(section_id) as Section | null;
            if (section === null) { throw new BadRequestError('Route is not properly formatted') };
            if (section.layout_id !== layout_id) { throw new BadRequestError('Route is not properly formatted') };
            if (!section) { throw new BadRequestError('Route is not properly formatted') };

            // check to see if table status is available before deleting table
            // if (restaurantTable.table_status !== 'available') {
            //     throw new ForbiddenError('Table cannot be deleted when in use');
            // };

            const tables = (await section.getTables()).map(table => table.table_status)

            if (tables.includes('on-hold') || tables.includes('occupied')) {
                throw new ForbiddenError('Section cannot be deleted when in use');
            }

            await section.delete();

            res.sendStatus(204);
        } catch (err) {
            next(err);
        };
    });;


router.route('/layout/:layout_id/section/:section_id/table')
    .post(authenticateAdmin, validateSchema(tableSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id, section_id } = req.params;
        const { table_name, table_status, reservable, seats, x, y }: { table_name: string, table_status: string, reservable: boolean, seats: number, x: number, y: number } = req.body;

        try {

            const section = await Section.findById(section_id) as Section | null;
            if (section === null) { throw new BadRequestError('Route is not properly formatted') };
            if (section.layout_id !== layout_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            if (!section) {
                throw new BadRequestError('Route is not properly formatted');
            };

            if (!table_name || !table_status || !reservable || !seats || typeof x !== 'number' || typeof y !== 'number') { throw new BadRequestError('Required parameters are missing') };

            const ref = await RestaurantTable.findByLocation(section_id, x, y);
            if (ref !== null) { throw new ForbiddenError('A table already exists in the location') };


            const restaurantTable = new RestaurantTable(table_name,
                table_status,
                reservable,
                seats,
                x,
                y,
                section_id,
            )
            await restaurantTable.save();
            if (restaurantTable.id === undefined) { throw new ExpressError('Unexpected Error', 500) };


            res.status(201).json({ table: restaurantTable });

        } catch (err) {
            next(err);
        };
    });


// Define the type for the updates
interface RestaurantTableUpdates {
    [key: string]: string | number | boolean | undefined;

    table_name?: string,
    table_status?: string,
    reservable?: boolean,
    seats?: number,
}


router.route('/layout/:layout_id/section/:section_id/table/:table_id')
    .patch(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id, section_id, table_id } = req.params;
        const { table_name, reservable, seats }: { table_name: string, table_status: string, reservable: boolean, seats: number, } = req.body;
        // Prepare the updates object
        const updates: RestaurantTableUpdates = {
            ...(table_name !== undefined && { table_name }),
            ...(reservable !== undefined && { reservable }),
            ...(seats !== undefined && { seats })
        };

        try {
            const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;
            if (!restaurantTable) {
                throw new NotFoundError('Table not found');
            };
            const section = await Section.findById(section_id) as Section | null;
            if (section === null) { throw new BadRequestError('Route is not properly formatted') };
            if (section.layout_id !== layout_id) { throw new BadRequestError('Route is not properly formatted') };
            if (!section) { throw new BadRequestError('Route is not properly formatted') };


            // check to see if table status is available before altering table
            if (restaurantTable.table_status !== 'available') { throw new ForbiddenError('Table cannot be modified while occupied'); };


            // Update the restaurant instance with new values
            Object.keys(updates).forEach(key => {
                restaurantTable[key] = updates[key];
            });

            // Save the updated restaurant back to the database

            await restaurantTable.save();

            res.status(200).json({ table: restaurantTable });
        } catch (err) {
            next(err);
        };

    })
    .delete(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id, section_id, table_id } = req.params;

        try {
            const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;
            if (!restaurantTable) { throw new NotFoundError('Table not found') };

            const section = await Section.findById(section_id) as Section | null;
            if (section === null) { throw new BadRequestError('Route is not properly formatted') };
            if (section.layout_id !== layout_id) { throw new BadRequestError('Route is not properly formatted') };
            if (!section) { throw new BadRequestError('Route is not properly formatted') };

            // check to see if table status is available before deleting table
            if (restaurantTable.table_status !== 'available') {
                throw new ForbiddenError('Table cannot be deleted when in use');
            };


            await restaurantTable.delete();

            res.sendStatus(204);
        } catch (err) {
            next(err);
        };
    });



router.route('/layout/:layout_id/section/:section_id/table/:table_id/reposition')
    .patch(authenticateAdmin, validateSchema(tableSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { layout_id, section_id, table_id } = req.params;
        const { x, y }: { x: number, y: number } = req.body;

        try {
            const restaurantTable = await RestaurantTable.findById(table_id) as RestaurantTable | null;
            if (!restaurantTable) {
                throw new NotFoundError('Table not found');
            };
            const section = await Section.findById(section_id) as Section | null;
            if (section === null) { throw new BadRequestError('Route is not properly formatted') }
            if (section.layout_id !== layout_id) {
                throw new BadRequestError('Route is not properly formatted');
            };
            if (!section) {
                throw new BadRequestError('Route is not properly formatted');
            };

            const ref = await RestaurantTable.findByLocation(section_id, x, y);
            if (ref !== null) { throw new ForbiddenError('A table already exists in the location') };

            restaurantTable.x = x;
            restaurantTable.y = y;
            await restaurantTable.save();

            res.status(200).json({ table: restaurantTable });
        } catch (err) {
            next(err);
        };

    })

export default router;