import express from 'express';
import reservationRoutes from './reservation';


const router = express.Router();

router.use('/', reservationRoutes);

export default router;