import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow';
    const conn = await mongoose.connect(mongoUri);
    return conn;
  } catch (error) {
    process.exit(1);
  }
};
