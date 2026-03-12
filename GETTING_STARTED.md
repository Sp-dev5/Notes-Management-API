# Getting Started with Notes Management Platform

## Quickest Setup (Docker)

```bash
# From project root
docker-compose up -d

# Services:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:5000
# - API Docs: http://localhost:5000/api/docs
# - DB: pgAdmin available at http://localhost:5050
```

## Local Development Setup

### System Requirements
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set:
# DATABASE_URL=postgresql://user:password@localhost:5432/notes_db
# JWT_SECRET=your-secret-key

# Initialize database
npm run db:migrate
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Step 2: Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### Step 3: Access the Application

1. **Frontend**: Open `http://localhost:5173`
2. **API Docs**: Open `http://localhost:5000/api/docs`
3. **Login** with demo credentials:
   - Email: `demo@example.com`
   - Password: `demo@123456`

## Project Structure

```
notes-management-api/
├── backend/          # Express API
├── frontend/         # React app
├── docker-compose.yml
└── README.md
```

## Common Commands

### Backend
```bash
cd backend

npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed database
```

### Frontend
```bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Database Management

### Using Prisma Studio

```bash
cd backend
npm run db:studio
```

Opens visual DB editor at `http://localhost:5555`

### Migrations

```bash
# Create migration
npm run db:migrate

# Push schema changes
npm run db:push

# Reset database
npm run db:reset
```

## Troubleshooting

### Port Already in Use
- Backend (5000): `lsof -i :5000` and kill the process
- Frontend (5173): `lsof -i :5173` and kill the process
- PostgreSQL (5432): `lsof -i :5432` and kill the process

### Database Connection Issues
- Verify PostgreSQL is running
- Check `.env` DATABASE_URL matches your credentials
- Ensure database exists: `createdb notes_db`

### Node Module Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf dist/ .next/
npm run build
```

## API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Note",
    "content": "This is my note content"
  }'
```

## Environment Cheat Sheet

### Backend .env
```env
DATABASE_URL=postgresql://user:password@localhost:5432/notes_db
PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-in-production-12345
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=change-this-too-67890
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### PostgreSQL Connection
```
Host: localhost
Port: 5432
Database: notes_db
User: notesuser
Password: notespassword
```

## Next Steps

1. 📖 Read [Backend README](./backend/README.md)
2. 📖 Read [Frontend README](./frontend/README.md)
3. 📚 Explore API at `/api/docs`
4. 🎨 Customize styling in `frontend/tailwind.config.js`
5. 🔐 Update JWT secrets for production
6. 🚀 Deploy to your hosting platform

## Support

- API Issues: Check `/api/docs`
- Database Issues: Use `npm run db:studio`
- Frontend Issues: Check browser console
- General: Review individual README files

---

**Happy coding! 🚀**
