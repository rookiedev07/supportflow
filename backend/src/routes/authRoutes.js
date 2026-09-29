import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { registerValidation, loginValidation } from '../validators/authValidators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerValidation), authController.register);
router.post('/login', authLimiter, validateRequest(loginValidation), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
