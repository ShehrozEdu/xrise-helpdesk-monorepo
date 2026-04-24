import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ServerToClientEvents, ClientToServerEvents } from '@helpdesk/shared';
import { logger } from './config/logger';
import { env } from './config/env';

let io: SocketServer<ClientToServerEvents, ServerToClientEvents>;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('join:ticket', (id: string) => {
      socket.join(`ticket:${id}`);
      logger.debug(`User ${socket.id} joined ticket:${id}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
