import * as activityService from '../services/activityService.js';
import * as ticketService from '../services/ticketService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getActivity = async (req, res, next) => {
  try {
    await ticketService.getTicketById(req.params.id, req.user);
    const activities = await activityService.getTicketActivities(req.params.id);
    return sendSuccess(res, { activities }, 200);
  } catch (error) {
    next(error);
  }
};
