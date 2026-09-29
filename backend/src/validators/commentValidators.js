import { body, param } from 'express-validator';

export const createCommentValidation = [
  param('id').isMongoId().withMessage('Invalid ticket ID format'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Comment message is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment message must be between 1 and 2000 characters')
];
