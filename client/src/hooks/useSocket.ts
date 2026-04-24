import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import type { ServerToClientEvents, ClientToServerEvents } from '@helpdesk/shared';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = (ticketId?: string) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (ticketId) {
        socket.emit('join:ticket', ticketId);
      }
    });

    socket.on('ticket:created', () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('New ticket received!', { id: 'new-ticket' });
    });

    socket.on('ticket:updated', (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      if (updatedTicket._id) {
        queryClient.invalidateQueries({ queryKey: ['ticket', updatedTicket._id] });
      }
    });

    socket.on('ticket:reply', (data) => {
      if (data.ticketId) {
        queryClient.invalidateQueries({ queryKey: ['ticket', data.ticketId] });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId, queryClient]);

  return socketRef.current;
};
