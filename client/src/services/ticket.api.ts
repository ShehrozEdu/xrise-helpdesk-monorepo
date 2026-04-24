import { api } from './api';
import type {
  CreateTicketInput,
  TicketQueryInput,
  PaginatedResponse,
  TicketResponse,
  TicketDetailResponse,
  TicketStatusResponse,
} from '@helpdesk/shared';

export const ticketApi = {
  create: (data: CreateTicketInput): Promise<{ ticketId: string }> => api.post('/tickets', data),
  
  checkStatus: (ticketId: string, email: string): Promise<TicketStatusResponse> =>
    api.get('/tickets/status', { params: { ticketId, email } }),

  getAll: (query: Partial<TicketQueryInput>): Promise<PaginatedResponse<TicketResponse>> =>
    api.get('/tickets', { params: query }),

  getById: (id: string): Promise<TicketDetailResponse> => api.get(`/tickets/${id}`),

  reply: (id: string, message: string): Promise<void> => api.post(`/tickets/${id}/reply`, { message }),

  updateStatus: (id: string, status: string): Promise<TicketResponse> => 
    api.patch(`/tickets/${id}/status`, { status }),

  assign: (id: string, assigneeId: string): Promise<TicketResponse> => 
    api.patch(`/tickets/${id}/assign`, { assigneeId }),

  draftReply: (id: string): Promise<{ draft: string }> => api.post(`/tickets/${id}/draft`),
};
