# Architecture Overview

## System Design

```
┌──────────────────────────────────────────────────────────┐
│                        Frontend (React)                   │
│  - Landing Page                                          │
│  - Auth Pages (Login/Register)                           │
│  - Dashboard (Note Management)                           │
│  - Profile Page                                          │
│  - Dark Mode Support                                     │
└──────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST API
                            │ JWT Bearer Token
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │              API Routes & Controllers               │  │
│  │  - /auth (Register, Login, Profile)                │  │
│  │  - /notes (CRUD, Search, Pagination)               │  │
│  └────────────────────────────────────────────────────┘  │
│                            │                              │
│  ┌────────────────────────┴─────────────────────────┐   │
│  │                Middleware                        │   │
│  │  - Auth (JWT Verification)                       │   │
│  │  - Validation (Zod Schemas)                      │   │
│  │  - Error Handling                                │   │
│  │  - Rate Limiting                                 │   │
│  │  - Logging (Morgan)                              │   │
│  │  - CORS Protection                               │   │
│  └────────────────────────────────────────────────────┘  │
│                            │                              │
│  ┌────────────────────────┴─────────────────────────┐   │
│  │              Services (Business Logic)           │   │
│  │  - AuthService                                   │   │
│  │  - NotesService                                  │   │
│  │  - JWT Token Management                          │   │
│  │  - Password Hashing                              │   │
│  └────────────────────────────────────────────────────┘  │
│                            │                              │
└────────────────────────────┼──────────────────────────────┘
                             │
                             │ Prisma ORM
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Users Table                                       │  │
│  │  - id, name, email, passwordHash, role, ...       │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Notes Table                                       │  │
│  │  - id, title, content, userId, createdAt, ...     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Register/Login
       ▼
┌─────────────────────────────────┐
│  Auth Controller                │
│  - Validate input               │
│  - Check credentials            │
└──────────┬──────────────────────┘
           │
           │ 2. Hash Password (bcrypt)
           │    or Verify Password
           ▼
┌─────────────────────────────────┐
│  Auth Service                   │
│  - Create User                  │
│  - Find User                    │
└──────────┬──────────────────────┘
           │
           │ 3. Generate JWT Token
           │    (user payload + secret + expiry)
           ▼
┌─────────────────────────────────┐
│  JWT Token                      │
│  - Access Token (1h)            │
│  - Refresh Token (7d)           │
└──────────┬──────────────────────┘
           │
           │ 4. Send to Client
           ▼
┌─────────────┐
│   Client    │ ← Store token in localStorage
└─────────────┘

For subsequent requests:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ Send with Authorization: Bearer <token>
       ▼
┌─────────────────────────────────┐
│  Express Request                │
│  Headers.Authorization          │
└──────────┬──────────────────────┘
           │
           │ 5. Auth Middleware
           │    - Extract token
           │    - Verify with JWT_SECRET
           │    - Decode payload
           ▼
┌─────────────────────────────────┐
│  req.userId verified            │
│  req.userRole verified          │
│  Access granted to protected    │
│  routes                         │
└─────────────────────────────────┘
```

## State Management Flow

### Frontend (Zustand)
```
┌─────────────────────────────────┐
│     useAuthStore                │
│  - user (User | null)           │
│  - token (string | null)        │
│  - isAuthenticated (boolean)    │
│  - setUser()                    │
│  - setToken()                   │
│  - logout()                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│     useThemeStore               │
│  - isDark (boolean)             │
│  - toggleTheme()                │
└─────────────────────────────────┘

UI Components
    │
    ├─ useAuthStore() → Check authentication
    ├─ useThemeStore() → Apply theme
    └─ useQuery/useMutation → Fetch data
```

### Data Fetching (React Query)
```
Component
    │
    ├─ useNotes() → Query all notes
    ├─ useNoteById() → Query single note
    ├─ useCreateNote() → Mutation
    ├─ useUpdateNote() → Mutation
    ├─ useDeleteNote() → Mutation
    └─ useSearchNotes() → Query with search
         │
         ├─ Query Key: ['notes', page, limit]
         ├─ Auto-caching
         ├─ Auto-refetch
         ├─ Loading states
         └─ Error states
```

## API Request/Response Pattern

### Request
```http
POST /api/v1/notes
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "title": "My Note",
  "content": "Note content here"
}
```

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "cuid123",
    "title": "My Note",
    "content": "Note content here",
    "userId": "user123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "path": "title",
      "message": "Title is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Security Features

### Password Security
```
User Input: "MyPassword123"
    ↓
bcryptjs.hash(password, 10)  // 10 salt rounds
    ↓
$2b$10$KIXzLjBWqh/fN2q8pQqxOe...  // Stored in DB
    ↓
bcryptjs.compare(inputPassword, hash)
    ↓
true/false
```

### JWT Security
```
Token Generation:
{
  userId: "user123",
  email: "user@example.com",
  role: "USER"
}
    ↓
Sign with JWT_SECRET + exp=1h
    ↓
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Token Verification:
Header: Authorization: Bearer <token>
    ↓
Extract token
    ↓
Verify signature with JWT_SECRET
    ↓
Check expiration
    ↓
Grant/Deny access
```

### Input Validation
```
User Input
    ↓
Zod Schema Validation
    ↓
- Type check
- Length check
- Format check
- Custom rules
    ↓
Valid Data → Process
Invalid Data → Error Response (400)
```

## Deployment Considerations

### Frontend
- Build static assets: `npm run build`
- Serve from CDN or static hosting
- Update API URL for production
- Set secure cookie flags
- Enable CORS only for backend domain

### Backend
- Run in Node.js container
- Use environment variables for secrets
- Enable HTTPS/TLS
- Configure rate limiting
- Set up logging and monitoring
- Implement database backups
- Use connection pooling for DB

### Database
- Regular backups
- Replication for redundancy
- Index optimization
- Connection pooling
- Monitoring and alerts

### Security Hardening
- Enable WAF (Web Application Firewall)
- DDoS protection
- SQL Injection prevention (via ORM)
- XSS protection
- CSRF tokens for state-changing requests
- Security headers (CSP, X-Frame-Options, etc.)
