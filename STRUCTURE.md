# Project Structure & Architecture

## Directory Layout

```
Notes Management API/
├── src/
│   ├── app.js                          # Express app setup & middleware configuration
│   ├── server.js                       # Server entry point - starts the application
│   ├── config/
│   │   ├── database.js                 # PostgreSQL connection pool & schema initialization
│   │   └── env.js                      # Environment variables management
│   ├── middleware/
│   │   ├── auth.js                     # JWT authentication & authorization
│   │   └── errorHandler.js             # Global error handler & 404 handler
│   ├── controllers/
│   │   ├── authController.js           # User registration, login, profile logic
│   │   └── notesController.js          # Notes CRUD operations logic
│   ├── routes/
│   │   ├── auth.js                     # Auth endpoints routing
│   │   └── notes.js                    # Notes endpoints routing
│   ├── models/
│   │   ├── User.js                     # User database operations & password hashing
│   │   └── Note.js                     # Note database operations
│   └── utils/
│       ├── validation.js               # Input validation schemas & middleware
│       └── responses.js                # Standard response formatting
├── .env.example                        # Example environment configuration file
├── .env                                # (Create manually) Actual env variables
├── .gitignore                          # Git ignore rules (should include .env, node_modules)
├── package.json                        # Project dependencies & scripts
├── README.md                           # Setup instructions & API documentation
├── STRUCTURE.md                        # This file - architecture explanation
└── FLOW.md                             # Detailed flow diagrams & flow execution
```

## File Descriptions

### Entry Point

**`src/server.js`**
- Main entry point of the application
- Initializes the database
- Starts the Express server
- Displays formatted welcome message

**`src/app.js`**
- Configures Express middleware
- Sets up route handlers (auth, notes)
- Registers error handlers
- Defines health check & API info endpoints

### Configuration

**`src/config/env.js`**
- Loads environment variables from `.env`
- Exports configuration object used throughout the app
- Contains: port, database config, JWT settings, app settings

**`src/config/database.js`**
- Creates PostgreSQL connection pool
- Initializes database schema (users & notes tables)
- Exports database query function
- Defines table structure with indexes

### Middleware

**`src/middleware/auth.js`**
- `authenticate()` - Verifies JWT token from request header
- `authorize(roles)` - Checks if user has required role
- Returns 401 if token missing/invalid
- Returns 403 if user lacks permission

**`src/middleware/errorHandler.js`**
- `errorHandler()` - Catches errors from controllers
- Handles database constraint violations
- Catches custom errors
- Returns standardized error responses
- `notFound()` - Handles 404 requests

### Controllers

**`src/controllers/authController.js`**
- `register()` - Creates new user with hashed password
- `login()` - Authenticates user and issues JWT token
- `getProfile()` - Returns authenticated user's information
- Validates user input
- Handles password hashing with bcrypt

**`src/controllers/notesController.js`**
- `createNote()` - Creates note for authenticated user
- `getUserNotes()` - Gets user's notes with pagination & search
- `getNote()` - Gets single note with ownership check
- `updateNote()` - Updates note with ownership check
- `deleteNote()` - Deletes note with ownership check
- `getAllNotes()` - Admin only - gets all notes in system

### Models (Database Layer)

**`src/models/User.js`**
- `create()` - Creates new user with hashed password
- `findByEmail()` - Finds user by email for login
- `findById()` - Gets user info by ID
- `verifyPassword()` - Compares plain password with hash
- `getAll()` - Lists all users (admin)

**`src/models/Note.js`**
- `create()` - Creates new note for user
- `findById()` - Gets single note
- `findByUserId()` - Gets all notes of a user with pagination
- `getAll()` - Gets all notes in system
- `searchByTitle()` - Case-insensitive search by title
- `update()` - Updates note title/content
- `delete()` - Deletes note
- `countByUserId()` - Counts user's notes

### Routes

**`src/routes/auth.js`**
- `POST /api/auth/register` - Public route for registration
- `POST /api/auth/login` - Public route for login
- `GET /api/auth/profile` - Protected route - requires auth

**`src/routes/notes.js`**
- `POST /api/notes` - Create note (requires auth)
- `GET /api/notes` - Get user's notes (requires auth)
- `GET /api/notes/:id` - Get single note (requires auth)
- `PUT /api/notes/:id` - Update note (requires auth)
- `DELETE /api/notes/:id` - Delete note (requires auth)
- `GET /api/notes/admin/all-notes` - Get all notes (requires admin)

### Utilities

**`src/utils/validation.js`**
- Defines Joi schemas for input validation
- `register` schema - email, password validation
- `login` schema - email, password validation
- `createNote` schema - title (required), content (optional)
- `updateNote` schema - title, content (both optional)
- `validate()` middleware - validates request body

**`src/utils/responses.js`**
- `success()` - Sends standardized success response
- `error()` - Sends standardized error response
- Ensures consistent response format across API

## Data Flow Architecture

### User Registration Flow
```
POST /api/auth/register
    ↓
Validation (email, password)
    ↓
Check if user exists (query DB)
    ↓
Hash password with bcrypt
    ↓
Create user in database
    ↓
Return user data (201 Created)
```

### User Login Flow
```
POST /api/auth/login
    ↓
Validation (email, password)
    ↓
Find user by email (query DB)
    ↓
Verify password with bcrypt
    ↓
Generate JWT token (10 minute or configured expiry)
    ↓
Return token + user data (200 OK)
```

### Protected Request Flow
```
GET /api/notes
    ↓
Extract token from Authorization header
    ↓
Verify token signature with JWT_SECRET
    ↓
Decode token to get user data
    ↓
Attach user to request object
    ↓
Route handler continues (controller)
```

### Create Note Flow
```
POST /api/notes
    ↓
Authentication check (must have token)
    ↓
Validation (title is required)
    ↓
Extract user_id from authenticated user
    ↓
Insert note into database
    ↓
Return created note (201 Created)
```

### Get User's Notes with Search
```
GET /api/notes?page=1&limit=10&search=meeting
    ↓
Authentication check
    ↓
Extract pagination params (page, limit)
    ↓
If search term exists:
    → Query notes WHERE user_id AND title LIKE search_term
    Else:
    → Query notes WHERE user_id ORDER BY created_at DESC
    ↓
Return notes + pagination info (200 OK)
```

### Update/Delete Note Flow
```
PUT/DELETE /api/notes/:id
    ↓
Authentication check
    ↓
Get note from database
    ↓
Check if note exists (404 if not)
    ↓
Check ownership:
    → If admin role: Allow
    → If user role and owns note: Allow
    → Otherwise: 403 Forbidden
    ↓
Execute update/delete
    ↓
Return result (200 OK)
```

## Authentication & Authorization

### JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "id": 1,              // User ID
  "email": "user@example.com",
  "role": "user",       // "user" or "admin"
  "iat": 1234567890,    // Issued at
  "exp": 1234571490     // Expire time
}

Signature: HMAC-SHA256(header + payload, JWT_SECRET)
```

### Role-Based Access Control

**Regular User (role = "user")**
- Can create unlimited notes
- Can read/update/delete only their own notes
- Cannot access admin endpoints
- Cannot view other users' notes

**Admin User (role = "admin")**
- Can view all notes in the system
- Can delete any note
- Cannot directly access other users' accounts
- Identified by `role: "admin"` in JWT payload

## Database Schema

### users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,                    -- bcrypt hash
  role VARCHAR(50) DEFAULT 'user',                   -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### notes Table
```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,                                       -- Can be null/empty
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_users_email` - Fast user lookup by email (for login)
- `idx_notes_user_id` - Fast notes lookup by user (for getting user's notes)
- `idx_notes_title` - Fast text search by title

## Error Handling Strategy

### Validation Errors (400)
- Missing required fields
- Invalid email format
- Password too short
- Invalid JSON

### Authentication Errors (401)
- Missing Authorization header
- Invalid token signature
- Token expired
- Malformed token

### Authorization Errors (403)
- User tries to access another user's note
- Regular user tries to access admin endpoint

### Not Found Errors (404)
- User tries to access non-existent note
- Route doesn't exist

### Conflict Errors (409)
- Email already registered
- Duplicate resource creation

### Server Errors (500)
- Database connection failure
- Unexpected exceptions

## Response Format

All responses (success or error) follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]  // Optional
}
```

## Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Never stored in plain text
   - Never returned in API responses

2. **Token Security**
   - JWT signed with secret key
   - Tokens expire after configured time
   - Token required for all protected endpoints

3. **Data Ownership**
   - Users can only access their own notes
   - Admins can access all notes
   - Queries filter by user_id automatically

4. **Input Validation**
   - All inputs validated before processing
   - SQL injection prevented by parameterized queries
   - Invalid data rejected with 400 error

5. **Error Handling**
   - Database errors don't expose sensitive info
   - Server errors return generic message
   - Detailed errors logged on server

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for signing tokens (CHANGE IN PRODUCTION)
- `JWT_EXPIRES_IN` - Token expiration time (e.g., "1h")
- `APP_NAME` - Application name
- `API_VERSION` - API version

## Scalability Considerations

For production deployment, consider:

1. **Database**
   - Add connection pooling configuration
   - Add database backup strategy
   - Consider read replicas for scaling

2. **Authentication**
   - Implement refresh tokens
   - Add rate limiting on login attempts
   - Add API key authentication for service-to-service

3. **Caching**
   - Add Redis for frequently accessed notes
   - Cache user profile data

4. **Monitoring**
   - Add structured logging
   - Add performance monitoring
   - Add error tracking (Sentry, etc.)

5. **Deployment**
   - Dockerize application
   - Use environment-specific configs
   - Add health checks and metrics

## Testing

To add automated tests:

1. Create `tests/` directory
2. Add test files: `auth.test.js`, `notes.test.js`
3. Use Jest testing framework (already in dependencies)
4. Test controllers and models in isolation
5. Use mocked database for unit tests
