import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = { [err.path]: 'Invalid identifier format' };
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `A record with this ${field} already exists`;
    errors = { [field]: `${field} must be unique` };
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    Object.values(err.errors).forEach((val) => {
      errors[val.path] = val.message;
    });
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  return sendError(res, message, statusCode, errors);
};
