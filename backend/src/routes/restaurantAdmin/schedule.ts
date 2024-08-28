import express, { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../../__utilities__/requestInterfaces';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from '../../__utilities__/expressError';
import { authenticateAdmin } from '../../__utilities__/authenticateToken'
import { validateSchema } from '../../__utilities__/validateSchema';
import scheduleSchema from './schemas/scheduleSchema';
import { JSONSchemaType } from 'ajv';

const router = express.Router();

router.use(express.json());


// Define the type for the updates
interface RestaurantScheduleUpdates {
    [key: string]: string | number | null | undefined;
    monday_opening?: string | null;
    tuesday_opening?: string | null;
    wednesday_opening?: string | null;
    thursday_opening?: string | null;
    friday_opening?: string | null;
    saturday_opening?: string | null;
    sunday_opening?: string | null;
    monday_closing?: string | null;
    tuesday_closing?: string | null;
    wednesday_closing?: string | null;
    thursday_closing?: string | null;
    friday_closing?: string | null;
    saturday_closing?: string | null;
    sunday_closing?: string | null;
    time_zone?: string | null;
    time_until_first_reservation_minutes?: number | null;
    time_until_last_reservation_minutes?: number | null;
    reservation_duration_minutes?: number | null;
}

// Route to update restaurant schedule
router.route('/schedule')
    .get(authenticateAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { restaurant } = req;
        if (restaurant === undefined) { throw new UnauthorizedError() };

        const schedule = {
            monday_opening: restaurant.monday_opening ? restaurant.monday_opening.slice(0, 5) : null,
            tuesday_opening: restaurant.tuesday_opening ? restaurant.tuesday_opening.slice(0, 5) : null,
            wednesday_opening: restaurant.wednesday_opening ? restaurant.wednesday_opening.slice(0, 5) : null,
            thursday_opening: restaurant.thursday_opening ? restaurant.thursday_opening.slice(0, 5) : null,
            friday_opening: restaurant.friday_opening ? restaurant.friday_opening.slice(0, 5) : null,
            saturday_opening: restaurant.saturday_opening ? restaurant.saturday_opening.slice(0, 5) : null,
            sunday_opening: restaurant.sunday_opening ? restaurant.sunday_opening.slice(0, 5) : null,
            monday_closing: restaurant.monday_closing ? restaurant.monday_closing.slice(0, 5) : null,
            tuesday_closing: restaurant.tuesday_closing ? restaurant.tuesday_closing.slice(0, 5) : null,
            wednesday_closing: restaurant.wednesday_closing ? restaurant.wednesday_closing.slice(0, 5) : null,
            thursday_closing: restaurant.thursday_closing ? restaurant.thursday_closing.slice(0, 5) : null,
            friday_closing: restaurant.friday_closing ? restaurant.friday_closing.slice(0, 5) : null,
            saturday_closing: restaurant.saturday_closing ? restaurant.saturday_closing.slice(0, 5) : null,
            sunday_closing: restaurant.sunday_closing ? restaurant.sunday_closing.slice(0, 5) : null,
            time_zone: restaurant.time_zone,
            time_until_first_reservation_minutes: restaurant.time_until_first_reservation_minutes,
            time_until_last_reservation_minutes: restaurant.time_until_last_reservation_minutes,
            reservation_duration_minutes: restaurant.reservation_duration_minutes,
        }


        try {
            res.status(200).json({ schedule });
        } catch (err) {
            next(err);
        };
    })
    .post(authenticateAdmin, validateSchema(scheduleSchema as JSONSchemaType<any>), async (req: AdminRequest, res: Response, next: NextFunction) => {
        const { restaurant } = req;
        if (restaurant === undefined) { throw new UnauthorizedError() };
        // Destructure all possible parameters
        const {
            monday_opening, tuesday_opening, wednesday_opening, thursday_opening, friday_opening, saturday_opening, sunday_opening,
            monday_closing, tuesday_closing, wednesday_closing, thursday_closing, friday_closing, saturday_closing, sunday_closing,
            time_zone, time_until_first_reservation_minutes, time_until_last_reservation_minutes, reservation_duration_minutes
        }: {
            monday_opening: string | null, tuesday_opening: string | null, wednesday_opening: string | null, thursday_opening: string | null, friday_opening: string | null, saturday_opening: string | null, sunday_opening: string | null,
            monday_closing: string | null, tuesday_closing: string | null, wednesday_closing: string | null, thursday_closing: string | null, friday_closing: string | null, saturday_closing: string | null, sunday_closing: string | null,
            time_zone: string | null, time_until_first_reservation_minutes: number | null, time_until_last_reservation_minutes: number | null, reservation_duration_minutes: number | null,
        } = req.body;

        // Prepare the updates object
        const updates: RestaurantScheduleUpdates = {
            ...(monday_opening !== undefined && { monday_opening }),
            ...(tuesday_opening !== undefined && { tuesday_opening }),
            ...(wednesday_opening !== undefined && { wednesday_opening }),
            ...(thursday_opening !== undefined && { thursday_opening }),
            ...(friday_opening !== undefined && { friday_opening }),
            ...(saturday_opening !== undefined && { saturday_opening }),
            ...(sunday_opening !== undefined && { sunday_opening }),
            ...(monday_closing !== undefined && { monday_closing }),
            ...(tuesday_closing !== undefined && { tuesday_closing }),
            ...(wednesday_closing !== undefined && { wednesday_closing }),
            ...(thursday_closing !== undefined && { thursday_closing }),
            ...(friday_closing !== undefined && { friday_closing }),
            ...(saturday_closing !== undefined && { saturday_closing }),
            ...(sunday_closing !== undefined && { sunday_closing }),
            ...(time_zone !== undefined && { time_zone }),
            ...(time_until_first_reservation_minutes !== undefined && { time_until_first_reservation_minutes }),
            ...(time_until_last_reservation_minutes !== undefined && { time_until_last_reservation_minutes }),
            ...(reservation_duration_minutes !== undefined && { reservation_duration_minutes })
        };

        console.log(updates)

        try {
            // Update the restaurant instance with new values
            Object.keys(updates).forEach((key: string) => {

                // // Regular expression to match the format HH:MM:SS
                // const timeFormat = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

                // // Check if the updates[key] matches the expected format
                // if (!timeFormat.test(`${updates[key]}`)) {
                //     throw new BadRequestError('Invalid time format. Expected format HH:MM:SS.');
                // }
                restaurant[key] = updates[key];
            });

            // Save the updated restaurant back to the database
            await restaurant.save();

            res.status(200).json({ message: 'Restaurant schedule updated successfully', restaurant });
        } catch (err) {
            next(err);
        };
    });


export default router;