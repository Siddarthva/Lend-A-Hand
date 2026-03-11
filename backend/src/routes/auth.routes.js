import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authCtrl from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { registerRules, loginRules, refreshRules } from '../validators/auth.validator.js';

const router = Router();

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many login attempts. Please try again later.' },
});

router.post('/register', authLimiter, registerRules, validateRequest, authCtrl.register);
router.post('/login', authLimiter, loginRules, validateRequest, authCtrl.login);
router.post('/refresh', refreshRules, validateRequest, authCtrl.refresh);
router.post('/logout', protect, authCtrl.logout);

export default router;
