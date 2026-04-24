import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { loginSchema } from '@helpdesk/shared';
import { publicRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', publicRateLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
