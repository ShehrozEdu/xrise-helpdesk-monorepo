import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { validate, validateQuery } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { publicRateLimiter } from '../middleware/rateLimiter';
import {
  createTicketSchema,
  checkTicketStatusSchema,
  updateTicketStatusSchema,
  replyToTicketSchema,
  assignTicketSchema,
  ticketQuerySchema,
} from '../shared';

const router = Router();

// Public routes
router.post('/', publicRateLimiter, validate(createTicketSchema), TicketController.create);
router.get('/status', publicRateLimiter, validateQuery(checkTicketStatusSchema), TicketController.checkStatus);

// Protected routes (Agent + Admin)
router.use(authenticate);
router.get('/', validateQuery(ticketQuerySchema), TicketController.getAll);
router.get('/:id', TicketController.getById);
router.post('/:id/reply', validate(replyToTicketSchema), TicketController.reply);
router.patch('/:id/status', validate(updateTicketStatusSchema), TicketController.updateStatus);
router.post('/:id/draft', TicketController.draftReply);

// Admin only routes
router.patch('/:id/assign', requireRole('admin'), validate(assignTicketSchema), TicketController.assign);

export default router;
