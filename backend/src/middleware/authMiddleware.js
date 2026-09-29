import { verifyToken } from '../config/jwt.js';
import { User } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'User account no longer exists.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'User account is deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 401);
  }
};
