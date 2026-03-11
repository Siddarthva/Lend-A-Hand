import { Router } from 'express';
import * as serviceCtrl from '../controllers/service.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createServiceRules, updateServiceRules } from '../validators/service.validator.js';

const router = Router();

// Public
router.get('/', serviceCtrl.getServices);

// Admin only
router.post('/', protect, authorize('admin'), createServiceRules, validateRequest, serviceCtrl.createService);
router.patch('/:id', protect, authorize('admin'), updateServiceRules, validateRequest, serviceCtrl.updateService);

export default router;
