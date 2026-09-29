import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    process.stdout.write('Empty database detected. Auto-seeding initial data...\n');
    await seedDatabase(false);
  }

  const server = app.listen(PORT, () => {
    process.stdout.write(`SupportFlow API running on port ${PORT}\n`);
  });

  const handleShutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();
