import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import { initSocket } from './socket';

const start = async () => {
  try {
    await connectDB();
    
    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

start();
