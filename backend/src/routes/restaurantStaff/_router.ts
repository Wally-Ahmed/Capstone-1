import express from 'express';
import authRoutes from './auth';
import employmentRoutes from './employment';


const router = express.Router();

router.use('/', authRoutes);
router.use('/', employmentRoutes);

export default router;