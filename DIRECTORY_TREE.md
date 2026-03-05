# Complete Project Directory Tree

```
Notes Management API/
│
├── 📄 QUICK_START.md              👈 START HERE! - Get running in 5 minutes
├── 📄 README.md                   - Full setup guide & API documentation
├── 📄 PROJECT_OVERVIEW.md         - Bird's eye view of everything
├── 📄 STRUCTURE.md                - Deep dive into code architecture
├── 📄 FLOW.md                     - Visual request/response flows
├── 📄 API_EXAMPLES.md             - Copy-paste API examples
│
├── 📄 package.json                - Dependencies: express, pg, jwt, bcrypt
├── 📄 .env.example                - Template for configuration
├── 📄 .gitignore                  - What to exclude from git
│
└── 📁 src/                        - Source code root
    │
    ├── 📄 server.js               - Entry point: starts the server
    │                              - Initializes database
    │                              - Listens on PORT
    │
    ├── 📄 app.js                  - Express app setup
    │                              - Middleware configuration
    │                              - Route registration
    │                              - Error handling
    │
    ├── 📁 config/                 - Configuration & setup
    │   ├── env.js                 - Load environment variables
    │   │                          - Export app config object
    │   │
    │   └── database.js            - PostgreSQL connection pool
    │                              - Create tables (schema)
    │                              - Define indexes
    │                              - Handle DB errors
    │
    ├── 📁 middleware/             - Request processing layer
    │   ├── auth.js                - JWT authentication
    │   │                          - Role authorization
    │   │                          │
    │   │                          └─ authenticate() - Verify token
    │   │                          └─ authorize() - Check role
    │   │
    │   └── errorHandler.js        - Global error catching
    │                              - Database error handling
    │                              - 404 handler
    │
    ├── 📁 controllers/            - Business logic layer
    │   ├── authController.js      - User registration
    │   │                          - User login
    │   │                          - Get user profile
    │   │
    │   └── notesController.js     - Create notes
    │                              - Read (user's notes + admin all)
    │                              - Update notes
    │                              - Delete notes
    │                              - Search functionality
    │
    ├── 📁 routes/                 - API endpoint definitions
    │   ├── auth.js                - POST /api/auth/register
    │   │                          - POST /api/auth/login
    │   │                          - GET /api/auth/profile
    │   │
    │   └── notes.js               - POST /api/notes
    │                              - GET /api/notes
    │                              - GET /api/notes/:id
    │                              - PUT /api/notes/:id
    │                              - DELETE /api/notes/:id
    │                              - GET /api/notes/admin/all-notes
    │
    ├── 📁 models/                 - Database layer
    │   ├── User.js                - User.create()
    │   │                          - User.findByEmail()
    │   │                          - User.findById()
    │   │                          - User.verifyPassword()
    │   │                          - User.getAll() [admin]
    │   │
    │   └── Note.js                - Note.create()
    │                              - Note.findById()
    │                              - Note.findByUserId()
    │                              - Note.getAll() [admin]
    │                              - Note.searchByTitle()
    │                              - Note.update()
    │                              - Note.delete()
    │                              - Note.countByUserId()
    │
    └── 📁 utils/                  - Utility functions
        ├── validation.js          - Joi validation schemas
        │                          - register schema
        │                          - login schema
        │                          - createNote schema
        │                          - updateNote schema
        │                          - validate() middleware
        │
        └── responses.js           - response.success()
                                   - response.error()
                                   - Standard format helpers
```

## Code Flow Diagram

```
CLIENT REQUEST
    │
    ▼
EXPRESS SERVER (app.js)
    │
    ├─→ Middleware Stack:
    │   ├─ JSON Parser
    │   ├─ Logger
    │   ├─ Authentication (if protected route)
    │   └─ Input Validation
    │
    ├─→ Router (routes/)
    │   ├─ /api/auth ──→ authController
    │   └─ /api/notes ──→ notesController
    │
    ├─→ Controller (controllers/)
    │   └─ Calls Model functions
    │
    ├─→ Model (models/)
    │   └─ Queries Database
    │
    ├─→ Database (config/database.js)
    │   └─ PostgreSQL
    │
    ├─→ Response Handler (utils/responses.js)
    │   └─ Format response
    │
    └─→ Error Handler (middleware/errorHandler.js)
        └─ If any error occurs

                    ▼
            HTTP RESPONSE
```

## File Dependencies

```
server.js
    └─→ app.js
        ├─→ config/database.js
        ├─→ config/env.js
        ├─→ routes/auth.js
        │   ├─→ controllers/authController.js
        │   │   ├─→ models/User.js
        │   │   │   └─→ config/database.js
        │   │   └─→ utils/responses.js
        │   ├─→ utils/validation.js
        │   └─→ middleware/auth.js
        │       └─→ config/env.js
        └─→ routes/notes.js
            ├─→ controllers/notesController.js
            │   ├─→ models/Note.js
            │   │   └─→ config/database.js
            │   ├─→ models/User.js
            │   └─→ utils/responses.js
            ├─→ utils/validation.js
            └─→ middleware/auth.js
                └─→ config/env.js
```

## Database Schema

```
PostgreSQL notes_management Database
│
├─ TABLE: users
│  ├─ id (INT, PRIMARY KEY)
│  ├─ email (VARCHAR, UNIQUE)
│  ├─ password (VARCHAR, bcrypt hash)
│  ├─ role (VARCHAR, DEFAULT 'user')
│  ├─ created_at (TIMESTAMP)
│  └─ updated_at (TIMESTAMP)
│  │
│  └─ INDEX: idx_users_email
│      └─ For fast email lookup during login
│
├─ TABLE: notes
│  ├─ id (INT, PRIMARY KEY)
│  ├─ user_id (INT, FOREIGN KEY → users.id)
│  ├─ title (VARCHAR)
│  ├─ content (TEXT)
│  ├─ created_at (TIMESTAMP)
│  └─ updated_at (TIMESTAMP)
│  │
│  ├─ INDEX: idx_notes_user_id
│  │   └─ For fast notes lookup by user
│  │
│  └─ INDEX: idx_notes_title
│      └─ For fast title search
```

## API Endpoint Tree

```
/api/
├─ auth/
│  ├─ POST register
│  ├─ POST login
│  └─ GET profile (protected)
│
├─ notes/
│  ├─ POST / (create note)
│  ├─ GET / (get user's notes)
│  ├─ GET /:id (get single note)
│  ├─ PUT /:id (update note)
│  ├─ DELETE /:id (delete note)
│  └─ admin/
│     └─ GET all-notes (admin only)
│
└─ [Special]
   ├─ GET / (API info)
   └─ /health (health check)
```

## Request Processing Pipeline

```
Request arrives
    ↓
┌─────────────────────────────────────────┐
│ Express Middleware (serial processing)  │
├─────────────────────────────────────────┤
│ 1. express.json()                       │
│    Parse JSON body                      │
│ 2. express.urlencoded()                 │
│    Parse form data                      │
│ 3. Request Logger                       │
│    Log method & path                    │
│ 4. [If Protected Route]                 │
│    authenticate()                       │
│    └─ Verify JWT token                  │
│ 5. [If Requires Validation]             │
│    validate()                           │
│    └─ Check input format                │
└─────────────────────────────────────────┘
    ↓ All passed
┌─────────────────────────────────────────┐
│ Route Handler (router.js)               │
├─────────────────────────────────────────┤
│ Route matches path                      │
│ Call appropriate controller             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Controller (controllers/)                │
├─────────────────────────────────────────┤
│ Execute business logic                  │
│ Call Model methods for DB ops           │
│ Get results or catch errors             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Response Handler (utils/responses.js)   │
├─────────────────────────────────────────┤
│ Format response with:                   │
│ - success: true/false                   │
│ - message: description                  │
│ - data: actual response data            │
│ - HTTP status code                      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ OR Error Handler                        │
│ (middleware/errorHandler.js)            │
├─────────────────────────────────────────┤
│ If error thrown:                        │
│ - Catch in global handler               │
│ - Format error response                 │
│ - Return appropriate status code        │
└─────────────────────────────────────────┘
    ↓
Response sent to client
```

## Authentication & Authorization Flow

```
Protected Request
    ↓
Extract Authorization header
    ├─ No header? ──→ 401 (no token)
    ├─ Wrong format? ──→ 401 (invalid)
    │
    ▼ Has "Bearer TOKEN"
Split and get token
    ↓
jwt.verify(token, JWT_SECRET)
    ├─ Invalid signature? ──→ 401 (invalid)
    ├─ Expired? ──→ 401 (expired)
    │
    ▼ Valid signature
Decode payload (user id, email, role)
    ↓
Attach to req.user
    ├─ req.user.id
    ├─ req.user.email
    └─ req.user.role
    │
    ▼
[If Route Requires Specific Role]
Check if user role in allowed list
    ├─ Not in list? ──→ 403 (forbidden)
    │
    ▼ Role allowed
Continue to controller
```

## Data Security Layers

```
CLIENT SENDS DATA
    ↓
Validation Layer
├─ Check format (email, length, etc.)
├─ Reject invalid → 400 Bad Request
    ↓ Valid
Database Layer
├─ Use parameterized queries
│  └─ Prevents SQL injection
├─ Check constraints
│  ├─ Unique (duplicate email) → 409
│  └─ Foreign key (missing user) → 404
    ↓
Password Handling
├─ Hash with bcrypt (10 rounds)
├─ Never store plaintext
├─ Never return in response
    ↓
Token Generation
├─ Sign with JWT_SECRET
├─ Include user info (id, email, role)
├─ Set expiration time
    ↓
Authorization Checks
├─ Verify user owns resource
├─ Or user is admin
├─ Deny access otherwise → 403
```

## File Size Overview

```
Small Files (Core Logic)
├─ middleware/auth.js             ~100 lines
├─ utils/responses.js             ~30 lines
├─ controllers/authController.js  ~70 lines
├─ routes/auth.js                 ~15 lines

Medium Files (Database Operations)
├─ models/User.js                 ~50 lines
├─ models/Note.js                 ~70 lines
├─ utils/validation.js            ~60 lines

Larger Files (Complex Logic)
├─ controllers/notesController.js ~120 lines
├─ config/database.js             ~60 lines
├─ middleware/errorHandler.js     ~35 lines

Application Setup
├─ app.js                         ~60 lines
├─ server.js                      ~35 lines
├─ config/env.js                  ~25 lines

Documentation
├─ README.md                      ~500 lines
├─ STRUCTURE.md                   ~400 lines
├─ FLOW.md                        ~500 lines
├─ API_EXAMPLES.md                ~400 lines
```

---

**Start with QUICK_START.md for immediate setup, then explore the code using this tree structure!**
