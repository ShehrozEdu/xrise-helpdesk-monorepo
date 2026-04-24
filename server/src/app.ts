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
    origin: true,
    credentials: true,
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
