import { Router } from 'express';
import authRoutes from './authRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import userRoutes from './userRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
