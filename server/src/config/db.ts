import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Set it in Render → Environment.');
  }
  if (!uri.startsWith('mongodb')) {
    throw new Error(
      'MONGODB_URI must start with mongodb:// or mongodb+srv:// (not a file path or placeholder).'
    );
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(
      'MongoDB connection failed. Fix: Atlas → Network Access → allow 0.0.0.0/0, and verify password in MONGODB_URI.'
    );
    throw err;
  }
};
