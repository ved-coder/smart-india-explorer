import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import regionsRouter from './routes/regions.js';
import itinerariesRouter from './routes/itineraries.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Enable CORS for frontend connection (standard Vite port is 5173)
app.use(cors({
  origin: [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174'
  ],
  credentials: true
}));

app.use(express.json());

// Initialize and seed database
initDb();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/regions', regionsRouter);
app.use('/api/itineraries', itinerariesRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart India Explorer Backend is running.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Smart India Explorer backend running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
