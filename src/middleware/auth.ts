import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to verify authentication using Bearer token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // Skip authentication if REQUIRE_AUTH is false
  if (process.env.REQUIRE_AUTH !== 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is missing' });
    return;
  }

  // Check if it's a Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Invalid authorization format. Use Bearer token' });
    return;
  }

  const token = parts[1];
  const apiKey = process.env.API_KEY;

  if (!apiKey || token !== apiKey) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  next();
}; 