# SCIM Import Service

A production-ready webhook service that imports SCIM (System for Cross-domain Identity Management) user data.

## Features

- Webhook endpoint for importing SCIM user data
- Basic SCIM 2.0 REST API implementation for user resources
- In-memory storage for user data (can be extended to use a database)
- Written in TypeScript with Express.js
- Production-ready features:
  - Bearer token authentication
  - Request validation
  - Rate limiting
  - Comprehensive logging
  - Security enhancements with Helmet
  - Error handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory (or use the default values):

```
PORT=3000
NODE_ENV=development
API_KEY=your-secret-api-key-here
REQUIRE_AUTH=true
```

### Running the Service

To start the service in development mode:

```bash
npm run dev
```

To build and run in production mode:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

All endpoints require Bearer token authentication unless disabled via the `REQUIRE_AUTH` environment variable:

```
Authorization: Bearer your-secret-api-key-here
```

### SCIM 2.0 API

- `POST /scim/v2/Users` - Create a new user
- `GET /scim/v2/Users` - List all users
- `GET /scim/v2/Users/:id` - Get a user by ID
- `PUT /scim/v2/Users/:id` - Update a user
- `DELETE /scim/v2/Users/:id` - Delete a user

### Webhook

- `POST /scim/v2/webhook/users` - Import user data via webhook

## Example Webhook Payload

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "john.doe",
  "name": {
    "familyName": "Doe",
    "givenName": "John"
  },
  "emails": [
    {
      "value": "john.doe@example.com",
      "type": "work",
      "primary": true
    }
  ],
  "active": true
}
```

## Example API Requests

### Create a user

```bash
curl -X POST http://localhost:3000/scim/v2/Users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key-here" \
  -d '{
    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
    "userName": "john.doe",
    "name": {
      "familyName": "Doe",
      "givenName": "John"
    },
    "emails": [
      {
        "value": "john.doe@example.com",
        "type": "work",
        "primary": true
      }
    ],
    "active": true
  }'
```

### Get all users

```bash
curl -X GET http://localhost:3000/scim/v2/Users \
  -H "Authorization: Bearer your-secret-api-key-here"
```

## Testing

Run tests with:

```bash
npm test
```

## Configuration Options

| Environment Variable | Description | Default |
|----------------------|-------------|---------|
| PORT | Port to run the server on | 3000 |
| NODE_ENV | Environment (development/production) | development |
| API_KEY | Secret key for API authentication | your-secret-api-key-here |
| REQUIRE_AUTH | Whether to require authentication | true |

## Production Considerations

This service includes several production-ready features:

1. **Authentication** - Bearer token authentication for API endpoints
2. **Validation** - Input validation for SCIM data
3. **Rate Limiting** - Protection against abuse
4. **Logging** - Comprehensive request/response logging
5. **Security Headers** - Using Helmet for improved security
6. **Error Handling** - Consistent error response format

For a full production deployment, you might consider:

- Using a persistent database (MongoDB, PostgreSQL, etc.) instead of in-memory storage
- Adding monitoring and alerting
- Setting up CI/CD pipelines
- Implementing webhook signature verification
- Containerizing the application with Docker
- Setting up TLS/HTTPS

## Notes

This is a proof-of-concept implementation and doesn't include all SCIM 2.0 protocol features like:

- Schema discovery
- Bulk operations
- Complex filtering
- Pagination
- Authentication and authorization
- Persistent storage

For a production environment, you would need to add these features along with proper error handling, logging, and security measures. 