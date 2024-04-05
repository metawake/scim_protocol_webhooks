import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ScimUserResource } from '../models/scimUser';
import { Logger } from '../utils/logger';

const userService = new UserService();

export class ScimController {
  /**
   * Handle webhook for user creation
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const scimUser = req.body as ScimUserResource;
      
      // Validation already handled by middleware
      
      // Check if user already exists
      const existingUser = userService.getUserByUsername(scimUser.userName);
      if (existingUser) {
        Logger.info(`User creation failed: Username already exists: ${scimUser.userName}`);
        res.status(409).json({ 
          error: 'User with this userName already exists',
          status: '409',
          detail: `User with userName "${scimUser.userName}" already exists` 
        });
        return;
      }

      const newUser = userService.createUser(scimUser);
      Logger.info(`User created successfully: ${newUser.id}`, { userName: newUser.userName });
      
      res.status(201).json({
        id: newUser.id,
        userName: newUser.userName,
        name: {
          familyName: newUser.familyName,
          givenName: newUser.givenName
        },
        emails: newUser.emails,
        active: newUser.active,
        meta: {
          resourceType: 'User',
          created: newUser.createdAt.toISOString(),
          lastModified: newUser.updatedAt.toISOString()
        }
      });
    } catch (error) {
      Logger.error('Error creating user', error);
      res.status(500).json({ 
        error: 'Internal server error',
        status: '500',
        detail: 'An unexpected error occurred while processing the request'
      });
    }
  }

  /**
   * Get all users
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = userService.getUsers();
      Logger.info(`Retrieved all users: total=${users.length}`);
      
      res.status(200).json({
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: users.length,
        Resources: users.map(user => ({
          id: user.id,
          userName: user.userName,
          name: {
            familyName: user.familyName,
            givenName: user.givenName
          },
          emails: user.emails,
          active: user.active,
          meta: {
            resourceType: 'User',
            created: user.createdAt.toISOString(),
            lastModified: user.updatedAt.toISOString()
          }
        }))
      });
    } catch (error) {
      Logger.error('Error getting users', error);
      res.status(500).json({ 
        error: 'Internal server error',
        status: '500',
        detail: 'An unexpected error occurred while processing the request'
      });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = userService.getUserById(userId);
      
      if (!user) {
        Logger.info(`User not found: ${userId}`);
        res.status(404).json({ 
          error: 'User not found',
          status: '404',
          detail: `User with id "${userId}" not found`
        });
        return;
      }

      Logger.info(`Retrieved user: ${userId}`);
      res.status(200).json({
        id: user.id,
        userName: user.userName,
        name: {
          familyName: user.familyName,
          givenName: user.givenName
        },
        emails: user.emails,
        active: user.active,
        meta: {
          resourceType: 'User',
          created: user.createdAt.toISOString(),
          lastModified: user.updatedAt.toISOString()
        }
      });
    } catch (error) {
      Logger.error(`Error getting user: ${req.params.id}`, error);
      res.status(500).json({ 
        error: 'Internal server error',
        status: '500',
        detail: 'An unexpected error occurred while processing the request'
      });
    }
  }

  /**
   * Update user
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const scimUser = req.body as ScimUserResource;
      
      const updatedUser = userService.updateUser(userId, scimUser);
      
      if (!updatedUser) {
        Logger.info(`Update failed: User not found: ${userId}`);
        res.status(404).json({ 
          error: 'User not found',
          status: '404',
          detail: `User with id "${userId}" not found`
        });
        return;
      }

      Logger.info(`User updated: ${userId}`);
      res.status(200).json({
        id: updatedUser.id,
        userName: updatedUser.userName,
        name: {
          familyName: updatedUser.familyName,
          givenName: updatedUser.givenName
        },
        emails: updatedUser.emails,
        active: updatedUser.active,
        meta: {
          resourceType: 'User',
          created: updatedUser.createdAt.toISOString(),
          lastModified: updatedUser.updatedAt.toISOString()
        }
      });
    } catch (error) {
      Logger.error(`Error updating user: ${req.params.id}`, error);
      res.status(500).json({ 
        error: 'Internal server error',
        status: '500',
        detail: 'An unexpected error occurred while processing the request'
      });
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const deleted = userService.deleteUser(userId);
      
      if (!deleted) {
        Logger.info(`Delete failed: User not found: ${userId}`);
        res.status(404).json({ 
          error: 'User not found',
          status: '404',
          detail: `User with id "${userId}" not found`
        });
        return;
      }

      Logger.info(`User deleted: ${userId}`);
      res.status(204).send();
    } catch (error) {
      Logger.error(`Error deleting user: ${req.params.id}`, error);
      res.status(500).json({ 
        error: 'Internal server error',
        status: '500',
        detail: 'An unexpected error occurred while processing the request'
      });
    }
  }
} 