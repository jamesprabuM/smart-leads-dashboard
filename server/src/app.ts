import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler } from './middleware/errorHandler';
import { sendError } from './utils/response';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    success: dbConnected,
    message: dbConnected
      ? 'Smart Leads API is running'
      : 'API is up but MongoDB is not connected — check MONGODB_URI on Render and Atlas Network Access (0.0.0.0/0)',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use((_req, res) => {
  sendError(res, 'Route not found', 404);
});

app.use(errorHandler);

export default app;
