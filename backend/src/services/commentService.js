import { Comment } from '../models/Comment.js';
import { Ticket } from '../models/Ticket.js';
import { AppError } from '../utils/appError.js';
import { ROLES, STATUSES } from '../utils/statusTransitions.js';
import { recordActivity } from './activityService.js';
import { ACTIVITY_ACTIONS } from '../models/Activity.js';

export const createComment = async ({ ticketId, author, message }) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (author.role === ROLES.CUSTOMER && ticket.createdBy.toString() !== author._id.toString()) {
    throw new AppError('Access denied: You can only comment on your own tickets', 403);
  }

  const comment = await Comment.create({
    ticket: ticketId,
    author: author._id,
    message
  });

  await recordActivity({
    ticketId,
    action: ACTIVITY_ACTIONS.COMMENT_ADDED,
    performedById: author._id,
    details: `${author.name} added a comment`
  });

  if (author.role === ROLES.CUSTOMER && ticket.status === STATUSES.WAITING_FOR_CUSTOMER) {
    const prevStatus = ticket.status;
    ticket.status = STATUSES.IN_PROGRESS;
    await ticket.save();

    await recordActivity({
      ticketId,
      action: ACTIVITY_ACTIONS.STATUS_CHANGED,
      performedById: author._id,
      previousValue: prevStatus,
      newValue: STATUSES.IN_PROGRESS,
      details: 'Customer responded, ticket moved to In Progress'
    });
  }

  return comment.populate('author', 'name email role avatar');
};

export const getCommentsByTicketId = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (user.role === ROLES.CUSTOMER && ticket.createdBy.toString() !== user._id.toString()) {
    throw new AppError('Access denied: You cannot view comments on other customers tickets', 403);
  }

  return Comment.find({ ticket: ticketId })
    .populate('author', 'name email role avatar')
    .sort({ createdAt: 1 });
};
