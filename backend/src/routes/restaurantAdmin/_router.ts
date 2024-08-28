import express from 'express';
import authRoutes from './auth';
import layoutRoutes from './layout';
import menuRoutes from './menu';
import scheduleRoutes from './schedule';
import employeeRoutes from './employee';
import interfaceRoutes from './restaurantInterface';


const router = express.Router();

router.use('/', authRoutes);
router.use('/', layoutRoutes);
router.use('/', menuRoutes);
router.use('/', scheduleRoutes);
router.use('/', employeeRoutes);
router.use('/', interfaceRoutes);

export default router;