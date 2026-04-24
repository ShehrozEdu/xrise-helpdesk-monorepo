import { z } from 'zod';

export const eventResponseSchema = z.object({
  _id: z.string(),
  ticketId: z.string(),
  type: z.enum(['created', 'reply', 'status_change', 'reassigned']),
  message: z.string(),
  createdBy: z.any().nullable(), // Null for customer actions, User object for agents
  createdAt: z.string(),
});

export type EventResponse = z.infer<typeof eventResponseSchema>;
