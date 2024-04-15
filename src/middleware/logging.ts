import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

/**
 * Middleware to log HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // For collecting response time
  const startTime = Date.now();

  // Log request details
  Logger.info(`Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: sanitizeRequestBody(req.body)
  });

  // Log response when it completes
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    Logger.info(`Response: ${req.method} ${req.url} - ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    });
  });

  next();
};

function sanitizeRequestBody(body: any): any {
  if (!body) return body;
  
  try {
    // Create a deep copy to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(body));
    
    // Sanitize sensitive fields
    if (sanitized.password) sanitized.password = '***REDACTED***';
    if (sanitized.token) sanitized.token = '***REDACTED***';
    
    return sanitized;
  } catch (err) {
    // If we can't stringify the body, return a simple object
    return { note: 'Body could not be processed for logging' };
  }
} 