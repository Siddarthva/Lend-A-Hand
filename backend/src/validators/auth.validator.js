import { body } from 'express-validator';

export const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['customer', 'provider']).withMessage('Invalid role'),
];

export const loginRules = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

export const refreshRules = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];
