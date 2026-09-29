import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { ROLES } from '../utils/statusTransitions.js';

export const getUsers = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    users,
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

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const updateUser = async (userId, updateData, currentUserId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (userId.toString() === currentUserId.toString() && updateData.role && updateData.role !== user.role) {
    throw new AppError('You cannot alter your own administrative role', 400);
  }

  if (userId.toString() === currentUserId.toString() && updateData.isActive === false) {
    throw new AppError('You cannot deactivate your own administrative account', 400);
  }

  if (updateData.name) user.name = updateData.name;
  if (updateData.role) user.role = updateData.role;
  if (updateData.isActive !== undefined) user.isActive = updateData.isActive;

  await user.save();

  return User.findById(userId).select('-password');
};

export const deleteUser = async (userId, currentUserId) => {
  if (userId.toString() === currentUserId.toString()) {
    throw new AppError('You cannot delete your own administrative account', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await User.findByIdAndDelete(userId);
  return { id: userId };
};

export const getAssignees = async () => {
  return User.find({
    role: { $in: [ROLES.AGENT, ROLES.ADMIN] },
    isActive: true
  })
    .select('name email role avatar')
    .sort({ name: 1 });
};
