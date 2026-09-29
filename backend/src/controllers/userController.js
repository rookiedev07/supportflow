import * as userService from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    return sendSuccess(res, { users: result.users }, 200, null, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, { user }, 200);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user._id);
    return sendSuccess(res, { user }, 200, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user._id);
    return sendSuccess(res, result, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getAssignees = async (req, res, next) => {
  try {
    const assignees = await userService.getAssignees();
    return sendSuccess(res, { assignees }, 200);
  } catch (error) {
    next(error);
  }
};
