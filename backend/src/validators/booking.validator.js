import { body, param } from 'express-validator';
import { BOOKING_STATUS, PAYMENT_METHODS } from '../config/constants.js';

export const createBookingRules = [
    body('serviceId').isMongoId().withMessage('Valid service ID required'),
    body('providerId').isMongoId().withMessage('Valid provider ID required'),
    body('scheduledStart').isISO8601().withMessage('Valid date required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('paymentMethod').optional().isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
    body('notes').optional().trim().isLength({ max: 1000 }),
];

export const updateBookingRules = [
    param('id').isMongoId().withMessage('Valid booking ID required'),
    body('status').optional().isIn(Object.values(BOOKING_STATUS)).withMessage('Invalid status'),
];

export const cancelBookingRules = [
    param('id').isMongoId().withMessage('Valid booking ID required'),
    body('reason').optional().trim().isLength({ max: 500 }),
];
