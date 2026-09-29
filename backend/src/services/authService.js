import { User } from '../models/User.js';
import { signToken } from '../config/jwt.js';
import { AppError } from '../utils/appError.js';
import { ROLES } from '../utils/statusTransitions.js';

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('An account with this email address already exists', 409, {
      email: 'Email is already registered'
    });
  }

  const assignedRole = role && Object.values(ROLES).includes(role) ? role : ROLES.CUSTOMER;

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: assignedRole
  });

  const token = signToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    },
    token
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  const token = signToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    },
    token
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};
