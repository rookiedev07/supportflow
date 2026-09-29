import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow_test';

export const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI);
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
