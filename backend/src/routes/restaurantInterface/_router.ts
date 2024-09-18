import express from 'express';
import cors from 'cors';

import connectRoutes from './connect';

import tabRoutes from './tab_refresh';
import tablemapRoutes from './tablemap_refresh';
import shiftRoutes from './shift_refresh';
import kitchenViewRoutes from './kitchenView_refresh';

import checkoutRoutes from './checkout';

import tabIORoutes from './tab';
import tablemapIORoutes from './tablemap';
import reservationIORoutes from './reservation';
import shiftIORoutes from './shift';
import kitchenViewIORoutes from './kitchenView';

const router = express.Router();

router.use('/', connectRoutes);
router.use('/tab', tabRoutes);
router.use('/tablemap', tablemapRoutes);
router.use('/shift', shiftRoutes);
router.use('/kitchen', kitchenViewRoutes);


router.use('/tab', checkoutRoutes);
router.use('/tab', tabIORoutes);
router.use('/tablemap', tablemapIORoutes);
router.use('/tablemap', reservationIORoutes);
router.use('/shift', shiftIORoutes);
router.use('/kitchen', kitchenViewIORoutes);

export default router;