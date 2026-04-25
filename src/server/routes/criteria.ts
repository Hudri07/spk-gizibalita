import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    (req as any).user = user;
    next();
  });
};

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM criteria ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch criteria' });
  }
});

router.post('/', async (req, res) => {
  const { code, name, weight, type } = req.body;
  try {
    const result = await query(
      'INSERT INTO criteria (code, name, weight, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, name, weight, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create criteria' });
  }
});

router.put('/:id', async (req, res) => {
  const { code, name, weight, type } = req.body;
  try {
    const result = await query(
      'UPDATE criteria SET code = $1, name = $2, weight = $3, type = $4 WHERE id = $5 RETURNING *',
      [code, name, weight, type, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update criteria' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM criteria WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete criteria' });
  }
});

export default router;
