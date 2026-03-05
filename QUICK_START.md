# Quick Start Guide

Get the Notes Management API up and running in 5 minutes.

## Prerequisites

✓ Node.js v14+ installed
✓ PostgreSQL installed and running
✓ cURL or Postman (for testing)

## Installation Steps

### 1. Install Dependencies (30 seconds)

```bash
cd "c:\Projects\Notes Management API"
npm install
```

### 2. Configure Environment (30 seconds)

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_management
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRES_IN=1h
```

### 3. Create Database (10 seconds)

```bash
psql -U postgres -c "CREATE DATABASE notes_management;"
```

**Note:** Tables will be created automatically when you start the server.

### 4. Start Server (15 seconds)

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════╗
║  Notes Management API                              ║
║  Version v1                                         ║
║  Environment: DEVELOPMENT                          ║
╚════════════════════════════════════════════════════╝

✓ Server is running on http://localhost:5000
✓ Health check: http://localhost:5000/health
✓ API info: http://localhost:5000/api
```

## Test It Works

### Health Check
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"OK",...}`

### Full Test Workflow

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Copy the token from response**

#### 3. Create a Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Note","content":"Hello World"}'
```

#### 4. Get Your Notes
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success!** You've created and retrieved a note.

## Project Structure

```
Notes Management API/
├── src/
│   ├── server.js              ← Start here
│   ├── app.js                 ← Express config
│   ├── config/                ← Database & env setup
│   ├── middleware/            ← Auth & error handling
│   ├── controllers/           ← Business logic
│   ├── routes/                ← API endpoints
│   ├── models/                ← Database operations
│   └── utils/                 ← Validation & responses
├── README.md                  ← Full documentation
├── STRUCTURE.md               ← Architecture deep dive
├── FLOW.md                    ← Visual request flows
├── API_EXAMPLES.md            ← Copy-paste API requests
└── PROJECT_OVERVIEW.md        ← This project at a glance
```

## What Each Folder Does

| Folder | Purpose |
|--------|---------|
| **src/config/** | Database connection & environment variables |
| **src/middleware/** | JWT authentication & error handling |
| **src/controllers/** | Business logic for auth & notes |
| **src/routes/** | API endpoint definitions |
| **src/models/** | Direct database operations |
| **src/utils/** | Input validation & response formatting |

## Key Features Implemented

✅ **User Authentication**
- Register with email/password
- Login with JWT tokens
- Secure password hashing

✅ **Notes Management**
- Create, read, update, delete notes
- Pagination support
- Search by title

✅ **Access Control**
- Users access only their notes
- Admin users access all notes
- Role-based endpoints

✅ **API Quality**
- Input validation
- Consistent error responses
- Appropriate HTTP status codes

## Common Issues & Fixes

### Port Already in Use
Change `PORT` in `.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure `notes_management` database exists

### Token Expired
- Get a new token by logging in again
- Tokens expire after 1 hour (increase `JWT_EXPIRES_IN` if needed)

## Next Steps

1. **Read the docs:**
   - [README.md](README.md) - Setup & API overview
   - [STRUCTURE.md](STRUCTURE.md) - How everything works
   - [FLOW.md](FLOW.md) - Visual diagrams
   - [API_EXAMPLES.md](API_EXAMPLES.md) - Test examples

2. **Explore the code:**
   - Start: `src/server.js` (entry point)
   - Then: `src/app.js` (Express setup)
   - Then: `src/routes/` (API endpoints)

3. **Test with Postman:**
   - See [API_EXAMPLES.md](API_EXAMPLES.md) for Postman setup

4. **Add features:**
   - Refresh tokens
   - Note categories
   - User profiles
   - Rate limiting

## Production Deployment

Before going to production:

```bash
# 1. Use strong JWT_SECRET
JWT_SECRET=generate-a-long-random-string-here

# 2. Set production environment
NODE_ENV=production

# 3. Use production database
DB_HOST=your-production-db-host

# 4. Run with process manager (PM2)
npm install -g pm2
pm2 start src/server.js --name "notes-api"
```

## Scripts Available

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests (when added)
npm test
```

## Documentation Files

| File | Read When |
|------|-----------|
| **PROJECT_OVERVIEW.md** | Want a quick 10,000 ft view |
| **README.md** | Need setup or API documentation |
| **STRUCTURE.md** | Want to understand the code |
| **FLOW.md** | Want to see how requests flow |
| **API_EXAMPLES.md** | Want to test with curl/Postman |

## Support

- **API Issues?** → Check [API_EXAMPLES.md](API_EXAMPLES.md)
- **Code Questions?** → Check [STRUCTURE.md](STRUCTURE.md)
- **Request Flow?** → Check [FLOW.md](FLOW.md)
- **Setup Help?** → Check [README.md](README.md)

---

**Ready to start developing?** 

The API is fully functional and ready to extend. Review [STRUCTURE.md](STRUCTURE.md) to understand how to add new features!
