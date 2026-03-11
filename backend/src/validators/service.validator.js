import { body, param } from 'express-validator';
import { CATEGORIES } from '../config/constants.js';

export const createServiceRules = [
    body('name').trim().notEmpty().withMessage('Service name is required')
        .isLength({ max: 120 }),
    body('description').trim().notEmpty().withMessage('Description is required')
        .isLength({ max: 2000 }),
    body('category').isIn(CATEGORIES).withMessage('Invalid category'),
    body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be >= 0'),
    body('duration').optional().isInt({ min: 1 }),
    body('tags').optional().isArray(),
];

export const updateServiceRules = [
    param('id').isMongoId().withMessage('Valid service ID required'),
    body('name').optional().trim().isLength({ max: 120 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('category').optional().isIn(CATEGORIES),
    body('basePrice').optional().isFloat({ min: 0 }),
    body('active').optional().isBoolean(),
];
