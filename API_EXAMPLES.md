# API Examples & Testing Guide

Ready-to-use examples for testing the Notes Management API.

## Prerequisites

- API running on `http://localhost:5000`
- PostgreSQL database configured
- cURL or Postman installed

## Quick Start Testing

### 1. Health Check
First, verify the API is running:

```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-03-05T10:30:00.000Z"
}
```

### 2. API Info
Get API information:

```bash
curl http://localhost:5000/api
```

## Authentication Workflow

### Step 1: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

### Step 2: Login as Registered User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwigZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjc4MDQ4NjAwLCJleHAiOjE2NzgwNTIyMDB9.XXxXxXXxXxXXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
}
```

**Save the token value. You'll use it for the next requests.**

### Step 3: Get User Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from Step 2.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2026-03-05T10:30:00.000Z",
    "updated_at": "2026-03-05T10:30:00.000Z"
  }
}
```

## Notes Management - User Operations

### Create a Note

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Shopping List",
    "content": "- Milk\n- Bread\n- Eggs\n- Cheese"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Shopping List",
    "content": "- Milk\n- Bread\n- Eggs\n- Cheese",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:35:00.000Z"
  }
}
```

### Get All User's Notes

```bash
curl -X GET "http://localhost:5000/api/notes?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Shopping List",
        "content": "- Milk\n- Bread\n- Eggs\n- Cheese",
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

### Search Notes by Title

```bash
curl -X GET "http://localhost:5000/api/notes?page=1&limit=10&search=shopping" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Shopping List",
        "content": "- Milk\n- Bread\n- Eggs\n- Cheese",
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

### Get Single Note

```bash
curl -X GET http://localhost:5000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Shopping List",
    "content": "- Milk\n- Bread\n- Eggs\n- Cheese",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:35:00.000Z"
  }
}
```

### Update a Note

```bash
curl -X PUT http://localhost:5000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Shopping List",
    "content": "- Bananas\n- Bread\n- Butter\n- Coffee"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Shopping List",
    "content": "- Bananas\n- Bread\n- Butter\n- Coffee",
    "created_at": "2026-03-05T10:35:00.000Z",
    "updated_at": "2026-03-05T10:40:00.000Z"
  }
}
```

### Delete a Note

```bash
curl -X DELETE http://localhost:5000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 1
  }
}
```

## Error Scenarios

### Missing Required Field

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "No title provided"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required"
  ]
}
```

### Invalid Token

```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer INVALID_TOKEN"
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or malformed token"
}
```

### Missing Authorization Header

```bash
curl -X GET http://localhost:5000/api/notes
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### Accessing Another User's Note

**Scenario:** User 1 trying to access User 2's note

```bash
curl -X GET http://localhost:5000/api/notes/5 \
  -H "Authorization: Bearer USER1_TOKEN"
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not have permission to view this note"
}
```

### Note Not Found

```bash
curl -X GET http://localhost:5000/api/notes/99999 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

### Duplicate Email Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "AnotherPassword123"
  }'
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "A user with this email already exists"
}
```

### Invalid Login Credentials

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "WrongPassword"
  }'
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Admin Operations

### Create Admin User (Database Update)

To test admin features, manually update a user in the database:

```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

Then login as that user to get an admin token.

### Admin: Get All Notes

```bash
curl -X GET "http://localhost:5000/api/notes/admin/all-notes?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": 1,
        "user_id": 1,
        "title": "User 1 Note",
        "content": "Content",
        "created_at": "2026-03-05T10:35:00.000Z",
        "updated_at": "2026-03-05T10:35:00.000Z"
      },
      {
        "id": 2,
        "user_id": 2,
        "title": "User 2 Note",
        "content": "Content",
        "created_at": "2026-03-05T10:36:00.000Z",
        "updated_at": "2026-03-05T10:36:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### Admin: Delete Any Note

Admins can delete notes from any user:

```bash
curl -X DELETE http://localhost:5000/api/notes/2 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 2
  }
}
```

## Postman Setup

### 1. Create Collection
- File → New → Collection → "Notes Management API"

### 2. Create Environment
- Click "Environments" → Create new environment
- Name: "Local Development"
- Add variables:
  - `base_url` = `http://localhost:5000`
  - `token` = `` (empty, will be filled during login)

### 3. Create Requests

#### Register Request
- **Method:** POST
- **URL:** `{{base_url}}/api/auth/register`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

#### Login Request
- **Method:** POST
- **URL:** `{{base_url}}/api/auth/login`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Tests Tab (Script):**
  ```javascript
  if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
  }
  ```

#### Create Note Request
- **Method:** POST
- **URL:** `{{base_url}}/api/notes`
- **Headers:**
  - `Authorization` = `Bearer {{token}}`
- **Body:**
  ```json
  {
    "title": "Test Note",
    "content": "This is a test note"
  }
  ```

#### Get Notes Request
- **Method:** GET
- **URL:** `{{base_url}}/api/notes?page=1&limit=10`
- **Headers:**
  - `Authorization` = `Bearer {{token}}`

#### Update Note Request
- **Method:** PUT
- **URL:** `{{base_url}}/api/notes/{{note_id}}`
- **Headers:**
  - `Authorization` = `Bearer {{token}}`
- **Body:**
  ```json
  {
    "title": "Updated Note",
    "content": "Updated content"
  }
  ```

#### Delete Note Request
- **Method:** DELETE
- **URL:** `{{base_url}}/api/notes/{{note_id}}`
- **Headers:**
  - `Authorization` = `Bearer {{token}}`

### 4. Execution Order
1. Run Register request
2. Run Login request (automatically sets token)
3. Run other requests using the token

## Batch Testing Script

Create a file `test.sh` for quick testing:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"
EMAIL="testuser@example.com"
PASSWORD="password123"

echo "=== Health Check ==="
curl $BASE_URL/health

echo -e "\n=== API Info ==="
curl $BASE_URL/api

echo -e "\n=== Register User ==="
REGISTER=$(curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo $REGISTER

echo -e "\n=== Login User ==="
LOGIN=$(curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo $LOGIN

TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo -e "\n=== Get Profile ==="
curl -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n=== Create Note ==="
curl -X POST $BASE_URL/api/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content"}'

echo -e "\n=== Get Notes ==="
curl -X GET "$BASE_URL/api/notes?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Run with:
```bash
bash test.sh
```

## HTTP Status Codes Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | Missing/invalid token, expired |
| 403 | Forbidden | User lacks permission, ownership check failed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, constraint violation |
| 500 | Server Error | Unexpected server issue |

## Pagination Example

Get page 2 with 5 items per page:

```bash
curl -X GET "http://localhost:5000/api/notes?page=2&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response will include:
```json
{
  "pagination": {
    "total": 23,      // Total notes
    "page": 2,        // Current page
    "limit": 5,       // Items per page
    "pages": 5        // Total pages
  }
}
```

To calculate:
- Page 1: Items 1-5
- Page 2: Items 6-10
- Page 3: Items 11-15
- etc.
