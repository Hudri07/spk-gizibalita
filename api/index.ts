import express from 'express';
import cors from 'cors';
import toddlerRoutes from '../src/server/routes/toddlers.ts';
import authRoutes from '../src/server/routes/auth.ts';
import criteriaRoutes from '../src/server/routes/criteria.ts';
import { query } from '../src/server/db.ts';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database Table if they don't exist
const initDB = async () => {
  try {
    // Balita table
    await query(`
      CREATE TABLE IF NOT EXISTS balita (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        height DECIMAL(5,2) NOT NULL,
        age INTEGER NOT NULL,
        gender CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Users table for auth
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criteria table
    await query(`
      CREATE TABLE IF NOT EXISTS criteria (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        weight DECIMAL(5,4) NOT NULL,
        type VARCHAR(10) CHECK (type IN ('benefit', 'cost')) DEFAULT 'benefit'
      )
    `);
  } catch (err) {
    console.warn('DB Init skipped or failed - check connection string');
  }
};

// Middleware to ensure DB is initialized on first request
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized && req.path.startsWith('/api')) {
    await initDB();
    dbInitialized = true;
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/balita', toddlerRoutes);
app.use('/api/criteria', criteriaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel' });
});

export default app;
