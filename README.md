# Notes Management API

A secure backend API that allows authenticated users to create and manage personal notes with role-based access control.

## Features

✨ **User Authentication**
- User registration with email and password
- JWT-based login and session management
- Secure password hashing with bcrypt

📝 **Notes Management**
- Create, read, update, and delete notes
- Each note includes id, title, content, timestamps
- Ownership enforcement - users only access their own notes

🔐 **Role-Based Access Control**
- Two roles: `user` and `admin`
- Regular users manage only their own notes
- Admin users can view and delete any note

⚡ **API Features**
- Input validation with detailed error messages
- Appropriate HTTP status codes
- Pagination support for notes listing
- Search notes by title (optional)
- Global error handling

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Environment Config**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_management
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# App
APP_NAME=Notes Management API
API_VERSION=v1
```

### 3. Set Up PostgreSQL Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE notes_management;"
```

The tables will be automatically created when you start the server.

### 4. Run the Application

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will start on `http://localhost:5000`

### 5. Verify Setup

Health check endpoint:
```bash
curl http://localhost:5000/health
```

API info:
```bash
curl http://localhost:5000/api
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "created_at": "2026-03-05T10:30:00.000Z",
    "updated_at": "2026-03-05T10:30:00.000Z"
  }
}
```

### Notes Endpoints

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

Response (201 Created):
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "This is the content of my note",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:35:00.000Z"
  }
}
```

#### Get User's Notes
```http
GET /api/notes?page=1&limit=10
Authorization: Bearer <token>
```

With search:
```http
GET /api/notes?page=1&limit=10&search=shopping
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": 1,
        "user_id": 1,
        "title": "My First Note",
        "content": "Content here",
        "created_at": "2026-03-05T10:35:00.000Z",
        "updated_at": "2026-03-05T10:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Note retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "Content here",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:35:00.000Z"
  }
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:40:00.000Z"
  }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 1
  }
}
```

#### Get All Notes (Admin Only)
```http
GET /api/notes/admin/all-notes?page=1&limit=10
Authorization: Bearer <admin-token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "All notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Note Title",
        "content": "Content",
        "created_at": "2026-03-05T10:35:00.000Z",
        "updated_at": "2026-03-05T10:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

## Error Response Format

All errors follow a standard format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]  // Optional
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error or missing required fields
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., email duplicate)
- `500 Internal Server Error` - Server error

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Token is obtained from login endpoint and expires based on `JWT_EXPIRES_IN` setting.

## Project Structure

See [STRUCTURE.md](STRUCTURE.md) for detailed project architecture.

See [FLOW.md](FLOW.md) for detailed request/response flows.

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Create Note:**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content"}'
```

### Using Postman

1. Import the API endpoints listed above
2. Create an environment variable `token` for storing JWT
3. After login, set the token from response
4. Use `{{token}}` in Authorization header for protected routes

## Troubleshooting

**Database Connection Error**
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure database `notes_management` exists

**Token Expired Error**
- Obtain a new token by logging in again
- Increase `JWT_EXPIRES_IN` if needed

**Port Already in Use**
- Change `PORT` in `.env` file
- Or kill the process using the port

## Contributing

This is a learning project. Feel free to extend with:
- Refresh tokens
- More sophisticated pagination
- Additional user fields
- Note categories/tags
- Sharing notes between users

## License

ISC
