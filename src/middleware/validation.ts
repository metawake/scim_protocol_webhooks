import { Request, Response, NextFunction } from 'express';
import { ScimUserResource } from '../models/scimUser';

/**
 * Middleware to validate SCIM user data
 */
export const validateScimUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const scimUser = req.body as ScimUserResource;

    // Check for required fields
    if (!scimUser) {
      res.status(400).json({ error: 'Request body is empty' });
      return;
    }

    if (!scimUser.userName) {
      res.status(400).json({ error: 'userName is required' });
      return;
    }

    // Validate userName format (alphanumeric, dots, underscores, hyphens)
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(scimUser.userName)) {
      res.status(400).json({ 
        error: 'userName must contain only alphanumeric characters, dots, underscores, and hyphens' 
      });
      return;
    }

    // Validate emails if provided
    if (scimUser.emails && scimUser.emails.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      for (const email of scimUser.emails) {
        if (!email.value) {
          res.status(400).json({ error: 'Email value is required for each email entry' });
          return;
        }
        
        if (!emailRegex.test(email.value)) {
          res.status(400).json({ error: `Invalid email format: ${email.value}` });
          return;
        }
      }
    }

    // Validate schemas
    if (!scimUser.schemas || !scimUser.schemas.length) {
      res.status(400).json({ error: 'schemas array is required' });
      return;
    }

    const requiredSchema = 'urn:ietf:params:scim:schemas:core:2.0:User';
    if (!scimUser.schemas.includes(requiredSchema)) {
      res.status(400).json({ 
        error: `schemas must include the core User schema: ${requiredSchema}` 
      });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
}; 