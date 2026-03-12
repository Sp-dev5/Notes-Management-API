# Notes Management Platform

A production-quality notes management system built with modern web technologies. This is a full-stack application demonstrating professional SaaS architecture, security best practices, and thoughtful UX design.

## 📋 Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **Note Management** - Create, read, update, delete operations with full-text search
- ✅ **Role-Based Access Control** - User and Admin roles with appropriate permissions
- ✅ **Pagination** - Efficient note listing with configurable pagination
- ✅ **Dark Mode** - Light/dark theme support throughout the application

### Technical Features
- ✅ **TypeScript** - Full type safety across backend and frontend
- ✅ **API Documentation** - Swagger/OpenAPI docs at `/api/docs`
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Validation** - Comprehensive validation with Zod
- ✅ **Error Handling** - Consistent error responses with proper HTTP status codes
- ✅ **State Management** - Zustand for frontend state, React Query for data
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## 🏗️ Architecture

```
notes-management-api/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities (JWT, validation, errors)
│   │   ├── index.ts        # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   ├── package.json
│   └── README.md
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API integration
│   │   ├── context/        # Zustand stores
│   │   ├── layouts/        # Layout components
│   │   ├── utils/          # Types and utilities
│   │   ├── App.tsx         # Main app
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md
│
├── docker-compose.yml       # Docker services orchestration
├── Dockerfile.backend       # Backend container configuration
├── Dockerfile.frontend      # Frontend container configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Without Docker

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env

# Update .env with your PostgreSQL database URL and JWT secret
# DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"

npm install
npm run db:migrate  # Run database migrations
npm run seed        # Seed with sample data
npm run dev         # Start development server
```

Server will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev         # Start development server
```

App will run on `http://localhost:5173`

### With Docker

```bash
# From the root directory
docker-compose up -d

# Backend: http://localhost:5000
# Frontend: http://localhost:5173
# Database: PostgreSQL on localhost:5432
```

## 📚 API Documentation

### Authentication

```bash
# Register
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}

# Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "secure_password"
}

# Get Profile (requires token)
GET /api/v1/auth/profile
Headers: Authorization: Bearer <token>
```

### Notes API

```bash
# Include JWT token in Authorization header for all requests
Headers: Authorization: Bearer <your_jwt_token>

# Create Note
POST /api/v1/notes
{
  "title": "My Note",
  "content": "Note content here"
}

# Get Notes (with pagination)
GET /api/v1/notes?page=1&limit=10

# Get Note by ID
GET /api/v1/notes/:id

# Update Note
PUT /api/v1/notes/:id
{
  "title": "Updated Title",
  "content": "Updated content"
}

# Delete Note
DELETE /api/v1/notes/:id

# Search Notes
GET /api/v1/notes/search?q=query&page=1&limit=10
```

### Full API Documentation

Visit `http://localhost:5000/api/docs` for interactive Swagger documentation.

## 🔐 Security

- **Password Hashing**: bcryptjs with salting
- **JWT Tokens**: Short-lived access tokens with configurable expiration
- **Rate Limiting**: Login attempts limited to 5 per 15 minutes
- **Input Validation**: Zod schemas for all endpoints
- **CORS Protection**: Configured for frontend domain
- **Error Handling**: Sanitized error messages in production

## 🎨 UI/UX

### Design System
- **Color Scheme**: Dark Slate with Electric Blue accents (#0f172a, #1e293b, #0ea5e9)
- **Glass Effects**: Glassmorphism with backdrop blur for modern aesthetic
- **Gradient Text**: Electric blue gradients for headings
- **Layout**: Modern card-based design with glassmorphic containers
- **Typography**: Clean sans-serif with maintained hierarchy
- **Icons**: Lucide React icons with electric blue coloring
- **Transitions**: Smooth 300ms animations throughout
- **Responsive**: Full mobile support with touch-friendly controls

### Key Pages
- **Landing Page**: Marketing copy with feature highlights and CTA buttons
- **Auth Pages**: Clean, focused login/register forms with dark theming
- **Dashboard**: Grid layout for note browsing with search and pagination
- **Profile**: User information with glassmorphic cards
- **Sidebar**: Navigation with active states and logout button
- **Modal**: Note editor with glassmorphic design and proper contrast

## 📊 Database Schema

### Users Table
- `id`: Unique identifier (CUID)
- `name`: User's full name
- `email`: Unique email address
- `passwordHash`: Bcrypted password
- `role`: USER | ADMIN
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Notes Table
- `id`: Unique identifier (CUID)
- `title`: Note title (required)
- `content`: Note body (required)
- `userId`: Foreign key to User
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS
FRONTEND_URL="http://localhost:5173"
```

### Frontend API Configuration

Update `src/utils/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

## 📝 Sample Credentials

After seeding the database:

**Admin Account**
- Email: `admin@example.com`
- Password: `admin@123456`

**Demo User**
- Email: `demo@example.com`
- Password: `demo@123456`

## 🚢 Deployment

### Backend (Node.js)
Requires:
- Node.js 18+ runtime
- PostgreSQL 14+ database
- Environment variables configured

### Frontend (React)
Requires:
- Static file hosting (Netlify, Vercel, etc.)
- API URL pointing to your backend

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d --build
```

## 🧪 Testing

### API Endpoints
Use the Swagger docs at `/api/docs` or Postman collection for testing.

### Frontend
Manual testing recommended. React Query DevTools available in development.

## 📋 Roadmap

Potential enhancements:
- [ ] Refresh token rotation
- [ ] Note sharing and collaboration
- [ ] Tags and categories
- [ ] Rich text editor
- [ ] File attachments
- [ ] E2E encryption
- [ ] Mobile apps
- [ ] Offline sync

## ⚖️ Disclaimer

This project is a demonstration application intended for **educational purposes**. It should not be used in production environments without additional security hardening and infrastructure, including:

- SSL/TLS certificates
- Rate limiting on all endpoints
- Database encryption at rest
- Regular security audits
- Intrusion detection systems
- Data backup and recovery procedures
- Compliance with data protection regulations (GDPR, etc.)

## 📄 License

MIT License

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for learning purposes.

## 📞 Support

For questions or issues:
1. Check the README in `/backend` and `/frontend`
2. Review API documentation at `/api/docs`
3. Check database schema in `backend/prisma/schema.prisma`

---

**Built with ❤️ using Node.js, React, PostgreSQL, and TypeScript**
