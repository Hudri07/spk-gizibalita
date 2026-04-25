import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.ts';
import { calculateSAW, ToddlerData } from '../services/saw.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// Middleware to authenticate token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    (req as any).user = user;
    next();
  });
};

// Use middleware for all routes
router.use(authenticateToken);

// Get all balita data
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM balita ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Add new balita record
router.post('/', async (req: Request, res: Response) => {
  const { name, weight, height, age, gender } = req.body;
  
  if (!name || !weight || !height || !age || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const text = 'INSERT INTO balita(name, weight, height, age, gender) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, weight, height, age, gender];
    const result = await query(text, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Get SAW analysis
router.get('/analysis', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM balita');
    const criteriaRes = await query('SELECT * FROM criteria ORDER BY id ASC');
    const criteria = criteriaRes.rows;

    const data: ToddlerData[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      weight: parseFloat(row.weight),
      height: parseFloat(row.height),
      age: parseInt(row.age),
      gender: row.gender
    }));

    const analysis = calculateSAW(data, criteria);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to conduct analysis' });
  }
});

// Delete record
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM balita WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Update record
router.put('/:id', async (req: Request, res: Response) => {
  const { name, weight, height, age, gender } = req.body;
  const { id } = req.params;

  if (!name || !weight || !height || !age || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const text = 'UPDATE balita SET name = $1, weight = $2, height = $3, age = $4, gender = $5 WHERE id = $6 RETURNING *';
    const values = [name, weight, height, age, gender, id];
    const result = await query(text, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

export default router;
