import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors'
import restaurantAdminRouter from './routes/restaurantAdmin/_router';
import restaurantStaffRouter from './routes/restaurantStaff/_router';
import restaurantInterfaceRouter from './routes/restaurantInterface/_router';
import restaurantGuestRouter from './routes/restaurantGuest/_router';
import { ExpressError } from './__utilities__/expressError';

export const app = express();

const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'], // Front-end URL
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use('/Admin', restaurantAdminRouter);
app.use('/Staff', restaurantStaffRouter);
app.use('/Interface', restaurantInterfaceRouter);
app.use('/Guest', restaurantGuestRouter);



app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status ? err.status : 500;

    // Construct the error response object manually
    const errorResponse: { status: number, message: string, data?: object } = {
        status: statusCode,
        message: err.message,
        // Include other properties if needed
    };

    if (err.data) {
        errorResponse.data = err.data; // Optionally include additional data if present
    }

    console.log('', errorResponse)

    return res.status(statusCode).json({ error: errorResponse });
});


// module.exports = { app };