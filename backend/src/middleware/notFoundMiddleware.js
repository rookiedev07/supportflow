import { sendError } from '../utils/apiResponse.js';

export const notFound = (req, res) => {
  return sendError(res, `Resource not found: ${req.method} ${req.originalUrl}`, 404);
};
