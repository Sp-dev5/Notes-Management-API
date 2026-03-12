# API Examples & Endpoints

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication Endpoints

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clin3h1d70000qz0h8f1z0z1z",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clin3h1d70000qz0h8f1z0z1z",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "clin3h1d70000qz0h8f1z0z1z",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Notes Endpoints

All note endpoints require authentication. Include token in header:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note."
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "clin3i9d70001qz0h8f2z0z2z",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "userId": "clin3h1d70000qz0h8f1z0z1z",
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z",
    "user": {
      "id": "clin3h1d70000qz0h8f1z0z1z",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### Get All Notes (Paginated)
```bash
curl -X GET "http://localhost:5000/api/v1/notes?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": "clin3i9d70001qz0h8f2z0z2z",
        "title": "My First Note",
        "content": "This is the content of my first note.",
        "userId": "clin3h1d70000qz0h8f1z0z1z",
        "createdAt": "2024-01-15T10:35:00Z",
        "updatedAt": "2024-01-15T10:35:00Z",
        "user": {
          "id": "clin3h1d70000qz0h8f1z0z1z",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2024-01-15T10:36:00Z"
}
```

### Get Note by ID
```bash
curl -X GET http://localhost:5000/api/v1/notes/clin3i9d70001qz0h8f2z0z2z \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Note retrieved successfully",
  "data": {
    "id": "clin3i9d70001qz0h8f2z0z2z",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "userId": "clin3h1d70000qz0h8f1z0z1z",
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z",
    "user": {
      "id": "clin3h1d70000qz0h8f1z0z1z",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "timestamp": "2024-01-15T10:36:00Z"
}
```

### Update Note
```bash
curl -X PUT http://localhost:5000/api/v1/notes/clin3i9d70001qz0h8f2z0z2z \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Updated Note Title",
    "content": "Updated note content here."
  }'
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": "clin3i9d70001qz0h8f2z0z2z",
    "title": "Updated Note Title",
    "content": "Updated note content here.",
    "userId": "clin3h1d70000qz0h8f1z0z1z",
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:40:00Z",
    "user": {
      "id": "clin3h1d70000qz0h8f1z0z1z",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "timestamp": "2024-01-15T10:40:00Z"
}
```

### Delete Note
```bash
curl -X DELETE http://localhost:5000/api/v1/notes/clin3i9d70001qz0h8f2z0z2z \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (204 No Content)**
```
(Empty response body)
```

### Search Notes
```bash
curl -X GET "http://localhost:5000/api/v1/notes/search?q=first&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "notes": [
      {
        "id": "clin3i9d70001qz0h8f2z0z2z",
        "title": "My First Note",
        "content": "This is the content of my first note.",
        "userId": "clin3h1d70000qz0h8f1z0z1z",
        "createdAt": "2024-01-15T10:35:00Z",
        "updatedAt": "2024-01-15T10:35:00Z",
        "user": {
          "id": "clin3h1d70000qz0h8f1z0z1z",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "timestamp": "2024-01-15T10:41:00Z"
}
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "timestamp": "2024-01-15T10:45:00Z"
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "error": "Unauthorized",
  "errors": ["Invalid or expired token"],
  "timestamp": "2024-01-15T10:46:00Z"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "success": false,
  "error": "Forbidden",
  "errors": ["You do not have permission to access this resource"],
  "timestamp": "2024-01-15T10:47:00Z"
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": "Note not found",
  "timestamp": "2024-01-15T10:48:00Z"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2024-01-15T10:49:00Z"
}
```

## Using Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select **Paste Raw Text**
4. Paste the JSON below

```json
{
  "info": {
    "name": "Notes Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{base_url}}/auth/register", "host": ["{{base_url}}"], "path": ["auth", "register"]},
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"TestPassword123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{base_url}}/auth/login", "host": ["{{base_url}}"], "path": ["auth", "login"]},
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"test@example.com\", \"password\": \"TestPassword123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Notes",
      "item": [
        {
          "name": "Create Note",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"},
              {"key": "Authorization", "value": "Bearer {{token}}"}
            ],
            "url": {"raw": "{{base_url}}/notes", "host": ["{{base_url}}"], "path": ["notes"]},
            "body": {
              "mode": "raw",
              "raw": "{\"title\": \"My Note\", \"content\": \"Note content here\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost:5000/api/v1"},
    {"key": "token", "value": ""}
  ]
}
```

### Setup Variables

1. Click the environment dropdown (top-right)
2. Click "Manage Environments"
3. Set `base_url` = `http://localhost:5000/api/v1`
4. After login, copy token to `token` variable

## Testing with cURL

### Save Token to File
```bash
# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo@123456"
  }' | jq -r '.data.token')

echo $TOKEN
```

### Use Saved Token
```bash
curl -X GET http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limiting

- **Login endpoint**: 5 requests per 15 minutes per IP
- Other endpoints: No rate limiting (can be added)

**Rate Limit Error (429 Too Many Requests)**
```json
{
  "success": false,
  "error": "Too many login attempts, please try again later",
  "timestamp": "2024-01-15T10:50:00Z"
}
```

---

**Happy API testing! 🚀**
