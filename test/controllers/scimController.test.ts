import request from 'supertest';
import app from '../../src/app';
import { UserService } from '../../src/services/userService';

// Temporarily set REQUIRE_AUTH to false for tests
process.env.REQUIRE_AUTH = 'false';

describe('SCIM Controller', () => {
  const userService = new UserService();
  const testApiKey = 'test-api-key';
  
  // Set API key for tests
  process.env.API_KEY = testApiKey;

  beforeEach(() => {
    // Clear users before each test
    userService.clearUsers();
  });

  describe('POST /scim/v2/Users', () => {
    it('should create a new user with valid auth', async () => {
      // Test with authentication
      process.env.REQUIRE_AUTH = 'true';

      const userData = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: 'testuser',
        name: {
          familyName: 'User',
          givenName: 'Test'
        },
        emails: [
          {
            value: 'test@example.com',
            type: 'work',
            primary: true
          }
        ],
        active: true
      };

      const response = await request(app)
        .post('/scim/v2/Users')
        .set('Authorization', `Bearer ${testApiKey}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.userName).toBe('testuser');
      expect(response.body.emails[0].value).toBe('test@example.com');
      expect(response.body.active).toBe(true);
      
      // Reset for other tests
      process.env.REQUIRE_AUTH = 'false';
    });

    it('should return 401 with invalid auth token', async () => {
      // Test with authentication
      process.env.REQUIRE_AUTH = 'true';

      const userData = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: 'testuser'
      };

      await request(app)
        .post('/scim/v2/Users')
        .set('Authorization', 'Bearer invalid-token')
        .send(userData)
        .expect(401);
      
      // Reset for other tests
      process.env.REQUIRE_AUTH = 'false';
    });

    it('should return 400 if userName is missing', async () => {
      const userData = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        name: {
          familyName: 'User',
          givenName: 'Test'
        }
      };

      await request(app)
        .post('/scim/v2/Users')
        .send(userData)
        .expect(400);
    });
    
    it('should return 400 if schemas are missing', async () => {
      const userData = {
        userName: 'testuser'
      };

      await request(app)
        .post('/scim/v2/Users')
        .send(userData)
        .expect(400);
    });
  });

  describe('GET /scim/v2/Users', () => {
    it('should return all users', async () => {
      // Create a test user first
      const userData = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: 'testuser',
        emails: [{ value: 'test@example.com' }]
      };
      
      await request(app)
        .post('/scim/v2/Users')
        .send(userData);
      
      const response = await request(app)
        .get('/scim/v2/Users')
        .expect(200);
      
      expect(response.body.totalResults).toBe(1);
      expect(response.body.Resources[0].userName).toBe('testuser');
    });
  });

  describe('Webhook endpoint', () => {
    it('should create a user via webhook', async () => {
      const userData = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: 'webhookuser',
        emails: [{ value: 'webhook@example.com' }]
      };
      
      const response = await request(app)
        .post('/scim/v2/webhook/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.userName).toBe('webhookuser');
      
      // Verify user was created
      const usersResponse = await request(app)
        .get('/scim/v2/Users')
        .expect(200);
      
      expect(usersResponse.body.Resources.some((user: any) => 
        user.userName === 'webhookuser'
      )).toBe(true);
    });
  });
  
  // Clean up environment after tests
  afterAll(() => {
    delete process.env.REQUIRE_AUTH;
    delete process.env.API_KEY;
  });
}); 