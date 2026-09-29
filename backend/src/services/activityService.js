import { Activity } from '../models/Activity.js';

export const recordActivity = async ({
  ticketId,
  action,
  performedById,
  previousValue = null,
  newValue = null,
  details = ''
}) => {
  return Activity.create({
    ticket: ticketId,
    action,
    performedBy: performedById,
    previousValue,
    newValue,
    details
  });
};

export const getTicketActivities = async (ticketId) => {
  return Activity.find({ ticket: ticketId })
    .populate('performedBy', 'name email role avatar')
    .sort({ createdAt: -1 });
};
