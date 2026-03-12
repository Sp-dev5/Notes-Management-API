# Notes Management Backend

Production-grade Notes Management API built with Express.js, PostgreSQL, and JWT authentication.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (User/Admin)
- ✅ CRUD operations for notes
- ✅ Full-text search
- ✅ Input validation with Zod
- ✅ Error handling and logging
- ✅ Rate limiting
- ✅ Swagger API documentation
- ✅ TypeScript support

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update .env with your PostgreSQL database URL and JWT secret

5. Run Prisma migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

6. Seed the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

## Running the Server

Development mode (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

Production build:
\`\`\`bash
npm run build
npm start
\`\`\`

## API Documentation

Once the server is running, visit:
- **API Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/health

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Sample Credentials

After seeding:
- **Admin**: admin@example.com / admin@123456
- **Demo User**: demo@example.com / demo@123456

## Project Structure

\`\`\`
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── index.ts         # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
├── package.json
├── tsconfig.json
└── .env.example
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/v1/auth/register\` - Register new user
- \`POST /api/v1/auth/login\` - Login user
- \`GET /api/v1/auth/profile\` - Get user profile (requires auth)

### Notes
- \`POST /api/v1/notes\` - Create note (requires auth)
- \`GET /api/v1/notes\` - Get notes (requires auth)
- \`GET /api/v1/notes?page=1&limit=10\` - Get notes with pagination
- \`GET /api/v1/notes/:id\` - Get note by ID (requires auth)
- \`PUT /api/v1/notes/:id\` - Update note (requires auth)
- \`DELETE /api/v1/notes/:id\` - Delete note (requires auth)
- \`GET /api/v1/notes/search?q=query\` - Search notes (requires auth)

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Logging**: Morgan
- **Documentation**: Swagger/OpenAPI
- **Rate Limiting**: express-rate-limit
