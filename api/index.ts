import app, { initDB } from '../src/server/app.ts';

// Middleware to ensure DB is initialized on first request
// In Vercel serverless, this might run multiple times across different instances
let dbInitialized = false;

export default async (req: any, res: any) => {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
  return app(req, res);
};
