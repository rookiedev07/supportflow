import { body, param, query } from 'express-validator';
import { ROLES } from '../utils/statusTransitions.js';

export const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID format')
];

export const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role specified'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const userQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role filter')
];
