import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { env } from './config/env';
import { logger } from './config/logger';

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    await User.deleteMany({});

    const passwordHash1 = await bcrypt.hash('Agent1Pass!', 12);
    const passwordHashAdmin = await bcrypt.hash('AdminPass!', 12);

    await User.insertMany([
      { name: 'Alice Agent', email: 'agent1@xriseai.com', password: passwordHash1, role: 'agent' },
      { name: 'Bob Admin', email: 'admin@xriseai.com', password: passwordHashAdmin, role: 'admin' },
    ]);

    logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Seeding failed');
    process.exit(1);
  }
};

seed();
