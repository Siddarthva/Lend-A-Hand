import { Router } from 'express';
import * as bookingCtrl from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createBookingRules, updateBookingRules, cancelBookingRules } from '../validators/booking.validator.js';

const router = Router();

router.use(protect);

router.post('/', createBookingRules, validateRequest, bookingCtrl.create);
router.get('/me', bookingCtrl.getMyBookings);
router.patch('/:id', updateBookingRules, validateRequest, bookingCtrl.update);
router.post('/:id/cancel', cancelBookingRules, validateRequest, bookingCtrl.cancel);

export default router;
