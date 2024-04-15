import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log file paths
const infoLogPath = path.join(logDir, 'info.log');
const errorLogPath = path.join(logDir, 'error.log');

/**
 * Simple logger utility
 */
export class Logger {
  static info(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] ${timestamp}: ${message}${data ? ' - ' + JSON.stringify(data) : ''}`;
    
    console.log(logMessage);
    
    // Append to log file
    fs.appendFileSync(infoLogPath, logMessage + '\n');
  }

  static error(message: string, error?: any): void {
    const timestamp = new Date().toISOString();
    
    // Format error object
    let errorStr = '';
    if (error) {
      if (error instanceof Error) {
        errorStr = ` - ${error.message}\n${error.stack}`;
      } else {
        errorStr = ` - ${JSON.stringify(error)}`;
      }
    }
    
    const logMessage = `[ERROR] ${timestamp}: ${message}${errorStr}`;
    
    console.error(logMessage);
    
    // Append to log file
    fs.appendFileSync(errorLogPath, logMessage + '\n');
  }

  static request(req: any, res: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[REQUEST] ${timestamp}: ${req.method} ${req.url} - ${res.statusCode}`;
    
    console.log(logMessage);
    
    // Append to log file
    fs.appendFileSync(infoLogPath, logMessage + '\n');
  }
} 