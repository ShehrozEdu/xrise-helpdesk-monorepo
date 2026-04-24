import { z } from 'zod';
export const TICKET_STATUSES = ['open', 'in-progress', 'closed'] as const;
export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;

export const createTicketSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  body: z.string().min(10, 'Please provide more details'),
  priority: z.enum(TICKET_PRIORITIES).default('medium'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const ticketResponseSchema = z.object({
  _id: z.string(),
  ticketId: z.string(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  body: z.string(),
  status: z.enum(TICKET_STATUSES),
  priority: z.enum(TICKET_PRIORITIES),
  assigneeId: z.any().nullable().optional(), // Can be string or populated User
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TicketResponse = z.infer<typeof ticketResponseSchema>;

export const checkTicketStatusSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  email: z.string().email('Invalid email address'),
});

export type CheckTicketStatusInput = z.infer<typeof checkTicketStatusSchema>;

export const updateTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
});

export const replyToTicketSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

export const assignTicketSchema = z.object({
  assigneeId: z.string().min(1, 'Assignee ID is required'),
});

export const ticketQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  search: z.string().optional(),
  assigneeId: z.string().optional(),
});

export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
