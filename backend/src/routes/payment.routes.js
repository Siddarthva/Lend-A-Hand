import { Router } from 'express';
import * as paymentCtrl from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/initiate', paymentCtrl.initiate);
router.post('/refund', paymentCtrl.refund);
router.get('/transactions/me', paymentCtrl.getMyTransactions);

export default router;
