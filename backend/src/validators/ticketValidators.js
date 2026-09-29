import { body, param, query } from 'express-validator';
import { STATUSES, PRIORITIES, CATEGORIES } from '../utils/statusTransitions.js';

export const createTicketValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(Object.values(CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(CATEGORIES).join(', ')}`),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(Object.values(PRIORITIES))
    .withMessage(`Priority must be one of: ${Object.values(PRIORITIES).join(', ')}`)
];

export const updateTicketValidation = [
  param('id').isMongoId().withMessage('Invalid ticket ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .optional()
    .isIn(Object.values(CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(CATEGORIES).join(', ')}`),
  body('priority')
    .optional()
    .isIn(Object.values(PRIORITIES))
    .withMessage(`Priority must be one of: ${Object.values(PRIORITIES).join(', ')}`),
  body('status')
    .optional()
    .isIn(Object.values(STATUSES))
    .withMessage(`Status must be one of: ${Object.values(STATUSES).join(', ')}`),
  body('assignedTo')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true;
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!mongoIdRegex.test(val)) {
        throw new Error('Assigned user must be a valid ID or null');
      }
      return true;
    })
];

export const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid ticket ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(STATUSES))
    .withMessage(`Status must be one of: ${Object.values(STATUSES).join(', ')}`)
];

export const assignTicketValidation = [
  param('id').isMongoId().withMessage('Invalid ticket ID format'),
  body('assignedTo')
    .custom((val) => {
      if (val === null || val === '') return true;
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!mongoIdRegex.test(val)) {
        throw new Error('Assigned user must be a valid ID or null');
      }
      return true;
    })
];

export const ticketIdValidation = [
  param('id').isMongoId().withMessage('Invalid ticket ID format')
];

export const ticketQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('status')
    .optional()
    .isIn(Object.values(STATUSES))
    .withMessage(`Invalid status filter`),
  query('priority')
    .optional()
    .isIn(Object.values(PRIORITIES))
    .withMessage(`Invalid priority filter`),
  query('category')
    .optional()
    .isIn(Object.values(CATEGORIES))
    .withMessage(`Invalid category filter`),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'priority', 'status', 'ticketNumber'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];
