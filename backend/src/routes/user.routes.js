import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/me', userCtrl.getMe);
router.patch('/me', userCtrl.updateMe);
router.get('/:id', authorize('admin'), userCtrl.getUserById);

export default router;
