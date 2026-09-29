import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { Activity, ACTIVITY_ACTIONS } from '../models/Activity.js';
import { AppError } from '../utils/appError.js';
import {
  ROLES,
  STATUSES,
  isValidTransition,
  getAllowedTransitions
} from '../utils/statusTransitions.js';
import { recordActivity } from './activityService.js';

export const createTicket = async ({ title, description, category, priority, user }) => {
  const ticket = await Ticket.create({
    title,
    description,
    category,
    priority,
    status: STATUSES.OPEN,
    createdBy: user._id
  });

  await recordActivity({
    ticketId: ticket._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedById: user._id,
    newValue: STATUSES.OPEN,
    details: `Ticket created by ${user.name}`
  });

  return Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role avatar')
    .populate('assignedTo', 'name email role avatar');
};

export const getTickets = async (query, user) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};

  if (user.role === ROLES.CUSTOMER) {
    filter.createdBy = user._id;
  } else if (user.role === ROLES.AGENT) {
    if (query.assignedOnly === 'true') {
      filter.assignedTo = user._id;
    }
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.assignedTo) {
    if (query.assignedTo === 'unassigned') {
      filter.assignedTo = null;
    } else {
      filter.assignedTo = query.assignedTo;
    }
  }

  if (query.createdBy && user.role !== ROLES.CUSTOMER) {
    filter.createdBy = query.createdBy;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { ticketNumber: searchRegex }
    ];
  }

  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;
  const sort = { [sortBy]: order };

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('createdBy', 'name email role avatar')
      .populate('assignedTo', 'name email role avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    tickets,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getTicketById = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('createdBy', 'name email role avatar')
    .populate('assignedTo', 'name email role avatar');

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (user.role === ROLES.CUSTOMER && ticket.createdBy._id.toString() !== user._id.toString()) {
    throw new AppError('Access denied: You cannot view other customers tickets', 403);
  }

  return ticket;
};

export const updateTicket = async (ticketId, updateData, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (user.role === ROLES.CUSTOMER) {
    if (ticket.createdBy.toString() !== user._id.toString()) {
      throw new AppError('Access denied: You can only edit your own tickets', 403);
    }
    if (ticket.status !== STATUSES.OPEN) {
      throw new AppError('Tickets can only be edited while in OPEN status', 400);
    }

    delete updateData.assignedTo;
    delete updateData.status;
  }

  if (user.role === ROLES.AGENT) {
    delete updateData.assignedTo;
  }

  const allowedUpdates = ['title', 'description', 'category', 'priority', 'status', 'assignedTo'];
  const changes = [];

  for (const field of allowedUpdates) {
    if (updateData[field] !== undefined) {
      const prevVal = ticket[field];
      const newVal = updateData[field];

      if (field === 'status' && prevVal !== newVal) {
        if (!isValidTransition(prevVal, newVal, user.role)) {
          const allowed = getAllowedTransitions(prevVal, user.role);
          throw new AppError(
            `Invalid status transition from ${prevVal} to ${newVal}. Allowed transitions: ${allowed.join(', ') || 'None'}`,
            400
          );
        }
        changes.push({
          action: ACTIVITY_ACTIONS.STATUS_CHANGED,
          previousValue: prevVal,
          newValue: newVal,
          details: `Status changed from ${prevVal} to ${newVal}`
        });
      } else if (field === 'priority' && prevVal !== newVal) {
        changes.push({
          action: ACTIVITY_ACTIONS.PRIORITY_CHANGED,
          previousValue: prevVal,
          newValue: newVal,
          details: `Priority updated to ${newVal}`
        });
      } else if (field === 'category' && prevVal !== newVal) {
        changes.push({
          action: ACTIVITY_ACTIONS.CATEGORY_CHANGED,
          previousValue: prevVal,
          newValue: newVal,
          details: `Category changed from ${prevVal} to ${newVal}`
        });
      } else if (field === 'assignedTo') {
        const prevId = prevVal ? prevVal.toString() : null;
        const newId = newVal ? newVal.toString() : null;
        if (prevId !== newId) {
          changes.push({
            action: ACTIVITY_ACTIONS.TICKET_ASSIGNED,
            previousValue: prevId,
            newValue: newId,
            details: newVal ? 'Ticket assigned to agent' : 'Ticket unassigned'
          });
        }
      }

      ticket[field] = newVal;
    }
  }

  await ticket.save();

  for (const change of changes) {
    await recordActivity({
      ticketId: ticket._id,
      action: change.action,
      performedById: user._id,
      previousValue: change.previousValue,
      newValue: change.newValue,
      details: change.details
    });
  }

  return Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role avatar')
    .populate('assignedTo', 'name email role avatar');
};

export const updateTicketStatus = async (ticketId, nextStatus, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (user.role === ROLES.CUSTOMER) {
    if (ticket.createdBy.toString() !== user._id.toString()) {
      throw new AppError('Access denied: You can only update your own tickets', 403);
    }

    const customerAllowed =
      (ticket.status === STATUSES.OPEN && nextStatus === STATUSES.CLOSED) ||
      (ticket.status === STATUSES.RESOLVED && nextStatus === STATUSES.CLOSED) ||
      (ticket.status === STATUSES.RESOLVED && nextStatus === STATUSES.IN_PROGRESS);

    if (!customerAllowed) {
      throw new AppError('Customers may only close open/resolved tickets or reopen resolved tickets', 400);
    }
  }

  if (!isValidTransition(ticket.status, nextStatus, user.role)) {
    const allowed = getAllowedTransitions(ticket.status, user.role);
    throw new AppError(
      `Invalid status transition from ${ticket.status} to ${nextStatus}. Allowed transitions: ${allowed.join(', ') || 'None'}`,
      400
    );
  }

  const previousStatus = ticket.status;
  ticket.status = nextStatus;
  await ticket.save();

  await recordActivity({
    ticketId: ticket._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedById: user._id,
    previousValue: previousStatus,
    newValue: nextStatus,
    details: `Status transitioned from ${previousStatus} to ${nextStatus}`
  });

  return Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role avatar')
    .populate('assignedTo', 'name email role avatar');
};

export const assignTicket = async (ticketId, assignedToId, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  let agentName = 'Unassigned';
  if (assignedToId) {
    const agent = await User.findById(assignedToId);
    if (!agent) {
      throw new AppError('Assigned user not found', 404);
    }
    if (agent.role === ROLES.CUSTOMER) {
      throw new AppError('Cannot assign tickets to customer accounts', 400);
    }
    agentName = agent.name;
  }

  const previousAssigned = ticket.assignedTo ? ticket.assignedTo.toString() : null;
  ticket.assignedTo = assignedToId || null;

  if (assignedToId && ticket.status === STATUSES.OPEN) {
    ticket.status = STATUSES.IN_PROGRESS;
  }

  await ticket.save();

  await recordActivity({
    ticketId: ticket._id,
    action: ACTIVITY_ACTIONS.TICKET_ASSIGNED,
    performedById: user._id,
    previousValue: previousAssigned,
    newValue: assignedToId || null,
    details: assignedToId ? `Ticket assigned to ${agentName}` : 'Ticket unassigned'
  });

  return Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role avatar')
    .populate('assignedTo', 'name email role avatar');
};

export const deleteTicket = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  await Promise.all([
    Ticket.findByIdAndDelete(ticketId),
    Comment.deleteMany({ ticket: ticketId }),
    Activity.deleteMany({ ticket: ticketId })
  ]);

  return { id: ticketId };
};
