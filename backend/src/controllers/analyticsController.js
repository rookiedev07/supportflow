import * as analyticsService from '../services/analyticsService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getDashboardStats(req.user);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};
