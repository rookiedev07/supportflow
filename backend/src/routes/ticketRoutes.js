import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';
import * as commentController from '../controllers/commentController.js';
import * as activityController from '../controllers/activityController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import {
  createTicketValidation,
  updateTicketValidation,
  updateStatusValidation,
  assignTicketValidation,
  ticketIdValidation,
  ticketQueryValidation
} from '../validators/ticketValidators.js';
import { createCommentValidation } from '../validators/commentValidators.js';
import { ROLES } from '../utils/statusTransitions.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createTicketValidation), ticketController.createTicket);

router.get('/', validateRequest(ticketQueryValidation), ticketController.getTickets);

router.get('/:id', validateRequest(ticketIdValidation), ticketController.getTicketById);

router.patch('/:id', validateRequest(updateTicketValidation), ticketController.updateTicket);

router.patch('/:id/status', validateRequest(updateStatusValidation), ticketController.updateStatus);

router.patch(
  '/:id/assign',
  authorize(ROLES.ADMIN),
  validateRequest(assignTicketValidation),
  ticketController.assignTicket
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  validateRequest(ticketIdValidation),
  ticketController.deleteTicket
);

router.post('/:id/comments', validateRequest(createCommentValidation), commentController.createComment);

router.get('/:id/comments', validateRequest(ticketIdValidation), commentController.getComments);

router.get('/:id/activity', validateRequest(ticketIdValidation), activityController.getActivity);

export default router;
