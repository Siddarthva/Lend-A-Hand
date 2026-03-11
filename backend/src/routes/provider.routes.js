import { Router } from 'express';
import * as providerCtrl from '../controllers/provider.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', providerCtrl.getProviders);
router.get('/:id', providerCtrl.getProviderById);

// Provider only
router.post('/profile', protect, authorize('provider'), providerCtrl.createProfile);
router.patch('/profile', protect, authorize('provider'), providerCtrl.updateProfile);

export default router;
