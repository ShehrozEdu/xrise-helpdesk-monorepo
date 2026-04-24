import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/ticket.api';
import type {
  CreateTicketInput,
  TicketQueryInput,
  TicketDetailResponse,
  TicketResponse,
} from '@helpdesk/shared';

export const useTickets = (query: Partial<TicketQueryInput>) => {
  return useQuery({
    queryKey: ['tickets', query],
    queryFn: () => ticketApi.getAll(query),
    staleTime: 30_000,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: (data: CreateTicketInput) => ticketApi.create(data),
  });
};

export const useReplyToTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => ticketApi.reply(ticketId, message),
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ['ticket', ticketId] });
      const previousData = queryClient.getQueryData<TicketDetailResponse>(['ticket', ticketId]);

      if (previousData) {
        queryClient.setQueryData<TicketDetailResponse>(['ticket', ticketId], {
          ...previousData,
          events: [
            ...previousData.events,
            {
              _id: `optimistic-${Date.now()}`,
              ticketId,
              type: 'reply',
              message,
              createdBy: null,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['ticket', ticketId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUpdateTicketStatus = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => ticketApi.updateStatus(ticketId, status),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['ticket', ticketId] });
      const previousData = queryClient.getQueryData<TicketDetailResponse>(['ticket', ticketId]);

      if (previousData) {
        queryClient.setQueryData<TicketDetailResponse>(['ticket', ticketId], {
          ...previousData,
          ticket: {
            ...previousData.ticket,
            status: newStatus as TicketResponse['status'],
          },
        });
      }
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['ticket', ticketId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAssignTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assigneeId: string) => ticketApi.assign(ticketId, assigneeId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
