import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Masking URI for safety in logs
    if (env.MONGODB_URI) {
      const maskedUri = env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
      console.log(`URI: ${maskedUri}`);
    } else {
      console.log('URI is undefined!');
    }
    
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    logger.info('Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    logger.error({ err: error }, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};
