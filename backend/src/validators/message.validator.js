import { body } from 'express-validator';

export const sendMessageRules = [
    body('threadId').optional().isMongoId(),
    body('receiverId').isMongoId().withMessage('Valid receiver ID required'),
    body('content').trim().notEmpty().withMessage('Message content is required')
        .isLength({ max: 5000 }),
];
