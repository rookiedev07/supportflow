import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import {
  userIdValidation,
  updateUserValidation,
  userQueryValidation
} from '../validators/userValidators.js';
import { ROLES } from '../utils/statusTransitions.js';

const router = Router();

router.use(authenticate);

router.get('/assignees', userController.getAssignees);

router.get('/', authorize(ROLES.ADMIN), validateRequest(userQueryValidation), userController.getUsers);
router.get('/:id', authorize(ROLES.ADMIN), validateRequest(userIdValidation), userController.getUserById);
router.patch('/:id', authorize(ROLES.ADMIN), validateRequest(updateUserValidation), userController.updateUser);
router.delete('/:id', authorize(ROLES.ADMIN), validateRequest(userIdValidation), userController.deleteUser);

export default router;
