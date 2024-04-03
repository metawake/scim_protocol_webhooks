import { v4 as uuidv4 } from 'uuid';
import { ScimUserResource, ScimUserDatabase } from '../models/scimUser';

// In-memory database for simplicity
let users: ScimUserDatabase[] = [];

export class UserService {
  /**
   * Creates a new user from SCIM user data
   */
  createUser(scimUser: ScimUserResource): ScimUserDatabase {
    const now = new Date();
    
    const newUser: ScimUserDatabase = {
      id: uuidv4(),
      userName: scimUser.userName,
      externalId: scimUser.externalId,
      familyName: scimUser.name?.familyName,
      givenName: scimUser.name?.givenName,
      emails: scimUser.emails || [],
      active: scimUser.active ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    return newUser;
  }

  /**
   * Retrieves all users
   */
  getUsers(): ScimUserDatabase[] {
    return users;
  }

  /**
   * Retrieves a user by ID
   */
  getUserById(id: string): ScimUserDatabase | undefined {
    return users.find(user => user.id === id);
  }

  /**
   * Retrieves a user by username
   */
  getUserByUsername(userName: string): ScimUserDatabase | undefined {
    return users.find(user => user.userName === userName);
  }

  /**
   * Updates a user
   */
  updateUser(id: string, scimUser: ScimUserResource): ScimUserDatabase | undefined {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    const updatedUser: ScimUserDatabase = {
      ...users[index],
      userName: scimUser.userName || users[index].userName,
      externalId: scimUser.externalId || users[index].externalId,
      familyName: scimUser.name?.familyName || users[index].familyName,
      givenName: scimUser.name?.givenName || users[index].givenName,
      emails: scimUser.emails || users[index].emails,
      active: scimUser.active !== undefined ? scimUser.active : users[index].active,
      updatedAt: new Date()
    };

    users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * Deletes a user
   */
  deleteUser(id: string): boolean {
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    return users.length < initialLength;
  }

  /**
   * Clears all users (for testing)
   */
  clearUsers(): void {
    users = [];
  }
} 