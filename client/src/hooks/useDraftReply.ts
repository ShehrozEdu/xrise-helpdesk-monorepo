import { useMutation } from '@tanstack/react-query';
import { ticketApi } from '../services/ticket.api';

export const useDraftReply = () => {
  return useMutation({
    mutationFn: (ticketId: string) => ticketApi.draftReply(ticketId),
  });
};
