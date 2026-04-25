import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import toddlerRoutes from './src/server/routes/toddlers.ts';
import authRoutes from './src/server/routes/auth.ts';
import criteriaRoutes from './src/server/routes/criteria.ts';
import { query } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
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

    // Seed default criteria if table is empty
    const criteriaCheck = await query('SELECT count(*) FROM criteria');
    if (parseInt(criteriaCheck.rows[0].count) === 0) {
      await query(`
        INSERT INTO criteria (code, name, weight, type) VALUES
        ('C1', 'Berat Badan', 0.40, 'benefit'),
        ('C2', 'Tinggi Badan', 0.30, 'benefit'),
        ('C3', 'Umur', 0.20, 'benefit'),
        ('C4', 'Jenis Kelamin', 0.10, 'benefit')
      `);
      console.log('Default criteria seeded');
    }
    console.log('Database initialized');
  } catch (err) {
    console.warn('DB Init skipped or failed - check connection');
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Init DB
  await initDB();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/balita', toddlerRoutes);
  app.use('/api/criteria', criteriaRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
