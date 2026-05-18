import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

const connectWithRetry = (attempt = 1): void => {
  connectDB().catch((err) => {
    console.error(`MongoDB connection attempt ${attempt} failed:`, err);
    setTimeout(() => connectWithRetry(attempt + 1), 5000);
  });
};

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});
