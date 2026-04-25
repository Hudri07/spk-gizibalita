import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use a mock pool if DATABASE_URL is not provided to prevent crash
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

export const query = async (text: string, params?: any[]) => {
  if (!pool) {
    console.warn('DATABASE_URL not set. Database operations will fail.');
    throw new Error('Database not connected');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
