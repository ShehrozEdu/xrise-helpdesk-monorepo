import pino from 'pino';
import { env } from './env';

// Disable pino-pretty on Vercel or in production
const isVercel = !!process.env.VERCEL;
const isProduction = env.NODE_ENV === 'production';

const transport = (!isVercel && !isProduction && env.NODE_ENV === 'development')
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
      },
    } 
  : undefined;

export const logger = pino({
  level: (isVercel || isProduction) ? 'info' : 'debug',
  transport,
});
