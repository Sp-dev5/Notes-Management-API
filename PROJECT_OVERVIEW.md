# Project Overview & Quick Reference

## What This Project Does

This is a **Notes Management API** - a complete backend system that allows users to:
- Create accounts with secure passwords
- Login with JWT tokens
- Create, read, update, and delete personal notes
- Search notes by title
- Access notes only they own (unless they're admin)

Admin users can view and manage all notes in the system.

## Project Architecture at a Glance

```
Client (Postman/cURL)
    │
    └─→ HTTP Request
         │
         └─→ Express Server (app.js)
              │
              ├─→ Middleware Layer
              │   ├─ Authentication (JWT verification)
              │   ├─ Authorization (role checking)
              │   ├─ Validation (input checking)
              │   └─ Error Handler (centralized)
              │
              ├─→ Routes (routes/)
              │   ├─ /api/auth (register, login, profile)
              │   └─ /api/notes (CRUD operations)
              │
              ├─→ Controllers (controllers/)
              │   ├─ authController (business logic)
              │   └─ notesController (business logic)
              │
              ├─→ Models (models/)
              │   ├─ User (database operations)
              │   └─ Note (database operations)
              │
              └─→ Database (database.js)
                   │
                   └─→ PostgreSQL
                       ├─ users table
                       └─ notes table
```

## File Purpose Summary

| File/Folder | Purpose |
|-------------|---------|
| `src/server.js` | Start the server, initialize database |
| `src/app.js` | Configure Express, set up middleware |
| `src/config/database.js` | PostgreSQL connection & schema |
| `src/config/env.js` | Load environment variables |
| `src/middleware/auth.js` | JWT verification & role checking |
| `src/middleware/errorHandler.js` | Catch & format errors |
| `src/controllers/authController.js` | Register, login, profile logic |
| `src/controllers/notesController.js` | Create, read, update, delete notes |
| `src/models/User.js` | User database operations |
| `src/models/Note.js` | Note database operations |
| `src/routes/auth.js` | Auth endpoint routing |
| `src/routes/notes.js` | Notes endpoint routing |
| `src/utils/validation.js` | Input validation schemas |
| `src/utils/responses.js` | Standard response formatting |
| `package.json` | Dependencies & scripts |
| `.env.example` | Template for configuration |
| `README.md` | Setup guide & API documentation |
| `STRUCTURE.md` | Detailed architecture explanation |
| `FLOW.md` | Visual flow diagrams |

## How Data Flows

### 1. Registration
```
User Input (email, password)
    ↓
Validation (format check)
    ↓
Check if email exists
    ↓
Hash password with bcrypt
    ↓
Store in database
    ↓
Return user info (no password)
```

### 2. Login
```
User Input (email, password)
    ↓
Find user in database
    ↓
Verify password hash matches
    ↓
Create JWT token (includes: id, email, role)
    ↓
Return token to user
```

### 3. Accessing Notes
```
Client sends request with token
    ↓
Extract token from header
    ↓
Verify token signature
    ↓
Extract user info from token
    ↓
Attach user to request
    ↓
Controller processes request
    ↓
Database query (filtered by user_id)
    ↓
Return results to user
```

## Key Security Features

✅ **Password Security**
- Passwords hashed with bcrypt (not stored as plain text)
- Never sent back to client
- Compared securely during login

✅ **Token Security**
- JWT signed with secret key
- Includes user info (id, email, role)
- Expires after 1 hour (configurable)
- Required for all protected endpoints

✅ **Data Ownership**
- Users can only access their own notes
- Queries automatically filtered by user_id
- Admin bypass for system-wide access

✅ **Input Protection**
- All inputs validated before processing
- Database queries use parameterized statements (prevents SQL injection)
- Invalid data rejected with clear error messages

## Database Schema

### Users Table
```
id          → Primary key
email       → Unique identifier (login)
password    → bcrypt hash
role        → "user" or "admin"
created_at  → Registration timestamp
updated_at  → Last update timestamp
```

### Notes Table
```
id          → Primary key
user_id     → Foreign key (which user owns it)
title       → Note title (required)
content     → Note content (optional)
created_at  → Creation timestamp
updated_at  → Last modification timestamp
```

## API Endpoints Quick Reference

### Authentication (Public - No Token Required)
```
POST   /api/auth/register       Create account
POST   /api/auth/login          Get JWT token
```

### Authentication (Protected - Token Required)
```
GET    /api/auth/profile        Get logged-in user info
```

### Notes (Protected - Token Required)
```
POST   /api/notes               Create note
GET    /api/notes               Get user's notes
GET    /api/notes/:id           Get single note
PUT    /api/notes/:id           Update note
DELETE /api/notes/:id           Delete note
```

### Notes (Admin Only - Token + Admin Role Required)
```
GET    /api/notes/admin/all-notes   View all notes (any user)
```

## Response Format

Every response follows this structure:

**Success:**
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { /* actual data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* optional details */ ]
}
```

## Environment Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed and running
- [ ] `npm install` - dependencies installed
- [ ] `.env` file created with correct credentials
- [ ] Database `notes_management` created
- [ ] `npm run dev` - server starts successfully
- [ ] `curl http://localhost:5000/health` - returns 200 OK

## Common Task Flows

### Task: Register & Create a Note
```
1. POST /api/auth/register
   ├─ Send email + password
   └─ Receive user info
2. POST /api/auth/login
   ├─ Send email + password
   └─ Receive JWT token
3. POST /api/notes
   ├─ Send token in header
   ├─ Send title + content
   └─ Receive created note
```

### Task: View & Update Your Notes
```
1. POST /api/auth/login (if not already logged in)
   └─ Receive JWT token
2. GET /api/notes
   ├─ Send token in header
   └─ Receive list of your notes
3. PUT /api/notes/:id
   ├─ Send token in header
   ├─ Send updated title/content
   └─ Receive updated note
```

### Task: Admin Views All Notes
```
1. POST /api/auth/login (as admin user)
   └─ Receive admin JWT token (includes role: admin)
2. GET /api/notes/admin/all-notes
   ├─ Send admin token in header
   ├─ Middleware checks role = "admin"
   └─ Receive all notes from all users
```

## Error Scenarios & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 No token | Missing Authorization header | Add `Authorization: Bearer TOKEN` |
| 401 Expired | Token older than 1 hour | Login again to get new token |
| 401 Invalid | Wrong JWT secret or malformed | Verify token from login response |
| 403 Forbidden | User accessing another's note | Users can only access own notes |
| 404 Not Found | Note doesn't exist or wrong ID | Check note ID exists |
| 409 Conflict | Email already registered | Use different email or login |
| 400 Bad Request | Missing required fields | Include title in create request |

## Development Tips

**Local Testing:**
```bash
# Start server in development mode (auto-reload)
npm run dev

# Test endpoint
curl http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'
```

**View Database:**
```bash
# Connect to PostgreSQL
psql -U postgres -d notes_management

# List tables
\dt

# View users
SELECT id, email, role FROM users;

# View notes
SELECT id, user_id, title FROM notes;
```

**Reset Database:**
```sql
-- Drop and recreate tables (deletes all data)
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Server will recreate schema on restart
```

## Performance Considerations

Current optimizations:
- Database indexes on frequently searched columns
  - `users(email)` - fast user lookup
  - `notes(user_id)` - fast notes query
  - `notes(title)` - fast search

Potential improvements:
- Add Redis caching for user profiles
- Add pagination pagination (already implemented)
- Add request rate limiting
- Add database connection pooling (already done)
- Implement API response compression

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Set `NODE_ENV=production`
- [ ] Use managed database (not local PostgreSQL)
- [ ] Enable HTTPS (use reverse proxy like Nginx)
- [ ] Add rate limiting middleware
- [ ] Add request logging & monitoring
- [ ] Set up automated backups
- [ ] Use environment variables for all config
- [ ] Add CORS if frontend is separate domain
- [ ] Test all error scenarios
- [ ] Load test with expected user count

## Files to Read First

1. **README.md** - Setup instructions & basic API guide
2. **STRUCTURE.md** - What each file does & why
3. **FLOW.md** - How data moves through the system
4. **API_EXAMPLES.md** - Ready-to-use curl commands

## Technology Stack Why We Chose It

- **Express.js** - Lightweight, flexible, great for APIs
- **PostgreSQL** - Reliable, supports advanced queries, good for relational data
- **JWT** - Stateless authentication, good for APIs
- **bcrypt** - Industry standard for password hashing
- **Joi** - Powerful input validation
- **dotenv** - Simple environment variable management

## Next Steps

1. Run `npm install`
2. Create `.env` file from `.env.example`
3. Set up PostgreSQL database
4. Run `npm run dev`
5. Test endpoints with `API_EXAMPLES.md` commands
6. Read through `STRUCTURE.md` to understand the code

---

**Questions?** Check the documentation files:
- Setup issues → README.md
- Code understanding → STRUCTURE.md
- Request flows → FLOW.md
- API testing → API_EXAMPLES.md
