import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, 'https://xrise-helpdesk-client.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// Standard middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Central error handler
app.use(errorHandler);

export default app;
