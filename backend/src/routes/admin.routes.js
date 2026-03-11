import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', adminCtrl.getUsers);
router.patch('/users/:id/status', adminCtrl.updateUserStatus);
router.get('/analytics', adminCtrl.getAnalytics);

export default router;
