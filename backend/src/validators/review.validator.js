import { body, param } from 'express-validator';

export const createReviewRules = [
    body('bookingId').isMongoId().withMessage('Valid booking ID required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('comment').optional().trim().isLength({ max: 2000 }),
    body('categoryRatings').optional().isObject(),
    body('categoryRatings.quality').optional().isInt({ min: 1, max: 5 }),
    body('categoryRatings.punctuality').optional().isInt({ min: 1, max: 5 }),
    body('categoryRatings.value').optional().isInt({ min: 1, max: 5 }),
    body('categoryRatings.communication').optional().isInt({ min: 1, max: 5 }),
];

export const providerIdParam = [
    param('id').isMongoId().withMessage('Valid provider ID required'),
];
