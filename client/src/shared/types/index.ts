export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'agent' | 'admin';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TicketDetailResponse {
  ticket: import('../schemas/ticket.schema').TicketResponse;
  events: import('../schemas/event.schema').EventResponse[];
}

export interface TicketStatusResponse {
  ticketId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  latestReply: {
    message: string;
    createdAt: string;
  } | null;
}

export interface ServerToClientEvents {
  'ticket:created': (ticket: any) => void;
  'ticket:updated': (ticket: any) => void;
  'ticket:reply': (data: { ticketId: string, event: any }) => void;
}

export interface ClientToServerEvents {
  'join:ticket': (id: string) => void;
}
