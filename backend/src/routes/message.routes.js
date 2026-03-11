import { Router } from 'express';
import * as msgCtrl from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { sendMessageRules } from '../validators/message.validator.js';

const router = Router();

router.use(protect);

router.get('/threads', msgCtrl.getThreads);
router.post('/threads', msgCtrl.createThread);
router.get('/threads/:id/messages', msgCtrl.getMessages);
router.post('/', sendMessageRules, validateRequest, msgCtrl.sendMessage);

export default router;
