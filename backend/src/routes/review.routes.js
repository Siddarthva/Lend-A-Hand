import { Router } from 'express';
import * as reviewCtrl from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createReviewRules, providerIdParam } from '../validators/review.validator.js';

const router = Router();

router.post('/', protect, createReviewRules, validateRequest, reviewCtrl.create);
router.get('/providers/:id/reviews', providerIdParam, validateRequest, reviewCtrl.getProviderReviews);

export default router;
