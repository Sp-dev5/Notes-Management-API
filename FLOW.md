# API Request/Response Flows

Detailed diagrams showing how different operations flow through the application.

## 1. User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT SENDS REQUEST                                             │
│ POST /api/auth/register                                          │
│ {                                                                │
│   "email": "user@example.com",                                   │
│   "password": "securePass123"                                    │
│ }                                                                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Express Route │
        │  (auth.js)     │
        └────────┬───────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Validation Middleware      │
    │ (validate(schemas.register)│
    │ - Check email format       │
    │ - Check password length    │
    └────────┬───────────────────┘
             │
             ├─ Invalid? ──→ 400 Bad Request + error details
             │
             ▼ Valid
  ┌─────────────────────────────┐
  │ authController.register()   │
  │ 1. Receive validated data   │
  │ 2. Check if user exists     │◄──── User.findByEmail()
  │ 3. Hash password (bcrypt)   │      (Query: SELECT * FROM users WHERE email)
  │ 4. Create user in DB        │◄──── User.create()
  │ 5. Return user data         │      (Query: INSERT INTO users ...)
  └────────┬────────────────────┘
           │
           ├─ User exists? ──→ 409 Conflict (duplicate email)
           │
           ▼ Success
     ┌───────────────────┐
     │  201 Created      │
     │  Response:        │
     │ {                 │
     │   "success": true,│
     │   "message": "...",
     │   "data": {       │
     │     "id": 1,      │
     │     "email": "...",
     │     "role": "user"│
     │   }               │
     │ }                 │
     └───────────────────┘
```

## 2. User Login & Token Generation Flow

```
┌─────────────────────────────────────────────────────────┐
│ CLIENT SENDS REQUEST                                     │
│ POST /api/auth/login                                     │
│ {                                                        │
│   "email": "user@example.com",                           │
│   "password": "securePass123"                            │
│ }                                                        │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Validation      │
    │ (schemas.login) │
    └────────┬────────┘
             │
             ├─ Invalid? ──→ 400 Bad Request
             │
             ▼ Valid
   ┌──────────────────────────────┐
   │ authController.login()       │
   │                              │
   │ 1. Find user by email ───────┼──→ User.findByEmail()
   │                              │    (SELECT * FROM users WHERE email)
   └────────┬─────────────────────┘
            │
            ├─ Not found? ──→ 401 Unauthorized (invalid credentials)
            │
            ▼
   ┌──────────────────────────────┐
   │ 2. Verify password ──────────┼──→ User.verifyPassword()
   │    (bcrypt.compare)          │    (compares hash)
   └────────┬─────────────────────┘
            │
            ├─ Invalid? ──→ 401 Unauthorized (invalid credentials)
            │
            ▼
   ┌──────────────────────────────┐
   │ 3. Generate JWT token        │
   │    json.sign({               │
   │      id, email, role         │
   │    }, JWT_SECRET, {          │
   │      expiresIn: "1h"         │
   │    })                        │
   └────────┬─────────────────────┘
            │
            ▼
    ┌──────────────────┐
    │  200 OK          │
    │  Response:       │
    │ {                │
    │   "success": true,
    │   "message": "Login successful",
    │   "data": {      │
    │     "token": "eyJhbGciOiJIUzI1NiIs...",
    │     "user": {    │
    │       "id": 1,   │
    │       "email":"",│
    │       "role":""  │
    │     }            │
    │   }              │
    │ }                │
    └──────────────────┘

TOKEN STRUCTURE:
┌──────────────────────────────────────────────────────┐
│ Header: {                                             │
│   "alg": "HS256",  Certificate type                 │
│   "typ": "JWT"                                        │
│ }                                                     │
├──────────────────────────────────────────────────────┤
│ Payload (Decoded): {                                  │
│   "id": 1,         User ID                           │
│   "email": "user@example.com",                        │
│   "role": "user",  Role (user or admin)              │
│   "iat": 1234567890,  Issued At timestamp           │
│   "exp": 1234571490   Expiration timestamp          │
│ }                                                     │
├──────────────────────────────────────────────────────┤
│ Signature:                                            │
│ HMAC-SHA256(                                          │
│   base64UrlEncode(header) + "." +                     │
│   base64UrlEncode(payload),                           │
│   JWT_SECRET                                          │
│ )                                                     │
└──────────────────────────────────────────────────────┘
```

## 3. Protected Request - Authentication Middleware Flow

```
┌──────────────────────────────────────┐
│ CLIENT SENDS PROTECTED REQUEST       │
│ GET /api/notes                       │
│ Header: Authorization: Bearer TOKEN  │
└────────┬─────────────────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Express Route Layer  │
    │ (notes.js)           │
    │ router.use(          │
    │   authenticate       │
    │ )                    │
    └────────┬─────────────┘
             │
             ▼
 ┌──────────────────────────────┐
 │ AUTHENTICATE MIDDLEWARE      │
 │ (middleware/auth.js)         │
 │                              │
 │ 1. Extract from header:      │
 │    const token =             │
 │      req.headers.             │
 │      authorization.           │
 │      split(' ')[1]           │
 └────────┬─────────────────────┘
          │
          ├─ No token? ──→ 401 Unauthorized
          │                (No auth token provided)
          │
          ▼ Token exists
 ┌──────────────────────────────┐
 │ 2. Verify token signature:   │
 │    jwt.verify(               │
 │      token,                  │
 │      JWT_SECRET              │
 │    )                         │
 └────────┬─────────────────────┘
          │
          ├─ Invalid? ──→ 401 Unauthorized
          │               (Invalid token)
          │
          ├─ Expired? ──→ 401 Unauthorized
          │               (Token expired)
          │
          ▼ Valid & not expired
 ┌──────────────────────────────┐
 │ 3. Decode token payload      │
 │    Extract:                  │
 │    - id: 1                   │
 │    - email: "..."            │
 │    - role: "user" or "admin" │
 └────────┬─────────────────────┘
          │
          ▼
 ┌──────────────────────────────┐
 │ 4. Attach to request:        │
 │    req.user = {              │
 │      id: 1,                  │
 │      email: "...",           │
 │      role: "user"            │
 │    }                         │
 └────────┬─────────────────────┘
          │
          ▼
    ┌──────────────┐
    │ next()       │
    │ Continue to  │
    │ route handler
    └──────────────┘
```

## 4. Create Note Flow

```
┌────────────────────────────────────┐
│ AUTHENTICATED CLIENT REQUEST       │
│ POST /api/notes                    │
│ Authorization: Bearer TOKEN        │
│ {                                  │
│   "title": "Meeting Notes",        │
│   "content": "Important details"   │
│ }                                  │
└────────┬───────────────────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Authentication   │
    │ (see flow #3)    │
    │ Attaches user to │
    │ request          │
    └────────┬─────────┘
             │
             ├─ Failed? ──→ 401 Unauthorized
             │
             ▼ Success
    ┌──────────────────────────┐
    │ Validation Middleware    │
    │ validate(schemas.      │
    │   createNote)            │
    │ - Title required         │
    │ - Content optional       │
    └────────┬─────────────────┘
             │
             ├─ Invalid? ──→ 400 Bad Request
             │
             ▼ Valid
  ┌─────────────────────────────┐
  │ notesController.createNote()│
  │                             │
  │ 1. Extract from request:    │
  │    - title                  │
  │    - content                │
  │    - userId (from req.user) │
  └────────┬────────────────────┘
           │
           ▼
  ┌─────────────────────────────┐
  │ Note.create()               │
  │ INSERT INTO notes VALUES    │
  │ (                           │
  │   user_id: 1,              │
  │   title: "Meeting Notes",  │
  │   content: "...",          │
  │   created_at: NOW(),       │
  │   updated_at: NOW()        │
  │ )                          │
  │ RETURNING *                │
  └────────┬────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ 201 Created      │
    │ Response: {      │
    │   "success":true,│
    │   "message":"...",
    │   "data": {      │
    │     "id": 123,   │
    │     "user_id": 1,│
    │     "title":"...",
    │     "content":"",│
    │     "created_at",│
    │     "updated_at" │
    │   }              │
    │ }                │
    └──────────────────┘
```

## 5. Get User's Notes with Pagination & Search

```
┌────────────────────────────────────────┐
│ AUTHENTICATED CLIENT REQUEST           │
│ GET /api/notes?page=1&limit=10         │
│           &search=Meeting              │
│ Authorization: Bearer TOKEN            │
└────────┬─────────────────────────────┤
         │
         ▼
    ┌──────────────────┐
    │ Authentication   │
    │ Attaches user    │
    │ to request       │
    └────────┬─────────┘
             │
             ▼
  ┌──────────────────────────────────┐
  │ notesController.getUserNotes()   │
  │                                  │
  │ 1. Extract querystring params:   │
  │    - page: 1                     │
  │    - limit: 10                   │
  │    - search: "Meeting"           │
  │                                  │
  │ 2. Calculate offset:             │
  │    offset = (page - 1) * limit   │
  │           = 0                    │
  │                                  │
  │ 3. userId from req.user.id       │
  └────────┬─────────────────────────┘
           │
           ▼
  ┌────────────────────────────────┐
  │ IF search term provided:       │
  │   Note.searchByTitle()         │
  │   SELECT * FROM notes          │
  │   WHERE user_id = $1 AND       │
  │         title ILIKE $2         │
  │   ORDER BY created_at DESC     │
  │   LIMIT 10 OFFSET 0            │
  │                                │
  │ ELSE:                          │
  │   Note.findByUserId()          │
  │   SELECT * FROM notes          │
  │   WHERE user_id = $1           │
  │   ORDER BY created_at DESC     │
  │   LIMIT 10 OFFSET 0            │
  └────────┬────────────────────────┘
           │
           ▼
  ┌────────────────────────────────┐
  │ Get total count for pagination:│
  │ Note.countByUserId()           │
  │ SELECT COUNT(*) FROM notes     │
  │ WHERE user_id = $1             │
  └────────┬────────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ 200 OK               │
    │ Response:            │
    │ {                    │
    │   "success": true,   │
    │   "message": "....", │
    │   "data": {          │
    │     "notes": [       │
    │       {              │
    │         "id": 1,     │
    │         "user_id":1, │
    │         "title":"...",
    │         "content":"",│
    │         ...dates     │
    │       },             │
    │       { ...more}     │
    │     ],               │
    │     "pagination": { │
    │       "total": 23,   │
    │       "page": 1,     │
    │       "limit": 10,   │
    │       "pages": 3     │
    │     }                │
    │   }                  │
    │ }                    │
    └──────────────────────┘
```

## 6. Update Note with Ownership Verification

```
┌──────────────────────────────────┐
│ AUTHENTICATED CLIENT REQUEST     │
│ PUT /api/notes/123               │
│ Authorization: Bearer TOKEN      │
│ {                                │
│   "title": "Updated Title",      │
│   "content": "Updated content"   │
│ }                                │
└────────┬────────────────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Authentication   │
    │ Attaches:        │
    │ - req.user.id: 1 │
    │ - req.user.role  │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Validation              │
    │ (schemas.updateNote)    │
    │ - Title and content are │
    │   both optional         │
    └────────┬─────────────────┘
             │
             ▼
 ┌──────────────────────────────┐
 │ notesController.updateNote() │
 │                              │
 │ 1. Extract noteId from URL:  │
 │    noteId = 123              │
 │                              │
 │ 2. Get note from database    │
 │    Note.findById(123)        │
 └────────┬─────────────────────┘
          │
          ├─ Not found? ──→ 404 Not Found
          │
          ▼ Found
 ┌──────────────────────────────┐
 │ 3. Check Ownership:          │
 │                              │
 │    IF note.user_id ≠ req.user.id:
 │       AND req.user.role ≠ "admin":
 │         ──→ 403 Forbidden    │
 │                              │
 │    ELSE:                     │
 │         Can proceed          │
 └────────┬─────────────────────┘
          │
          ▼
 ┌──────────────────────────────┐
 │ 4. Update note:              │
 │    Note.update(              │
 │      id: 123,                │
 │      title: "Updated Title", │
 │      content: "Updated..."   │
 │    )                         │
 │                              │
 │    UPDATE notes              │
 │    SET title = $1,           │
 │        content = $2,         │
 │        updated_at = NOW()    │
 │    WHERE id = $3             │
 │    RETURNING *               │
 └────────┬─────────────────────┘
          │
          ▼
    ┌──────────────────┐
    │ 200 OK           │
    │ Response:        │
    │ {                │
    │   "success":true,│
    │   "message":"...",
    │   "data": {      │
    │     "id": 123,   │
    │     "user_id": 1,│
    │     "title":"...",
    │     "content":"",│
    │     "created_at",│
    │     "updated_at":│
    │     "(just now)" │
    │   }              │
    │ }                │
    └──────────────────┘
```

## 7. Admin Access - Get All Notes

```
┌────────────────────────────────┐
│ AUTHENTICATED CLIENT REQUEST   │
│ GET /api/notes/admin/all-notes │
│ Authorization: Bearer TOKEN    │
│ (Token issued to admin user)   │
└────────┬───────────────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Authentication   │
    │ req.user.role =  │
    │ "admin"          │
    └────────┬─────────┘
             │
             ▼
  ┌─────────────────────────┐
  │ AUTHORIZATION CHECK     │
  │ authorize(['admin'])    │
  │                         │
  │ IF req.user.role NOT IN │
  │    ['admin']:           │
  │   ──→ 403 Forbidden     │
  │                         │
  │ ELSE: Continue          │
  └────────┬────────────────┘
           │
           ▼
 ┌──────────────────────────────┐
 │ notesController.getAllNotes()│
 │                              │
 │ 1. Extract page & limit      │
 │    from querystring          │
 │                              │
 │ 2. Calculate offset          │
 │    offset = (page-1)*limit   │
 └────────┬─────────────────────┘
          │
          ▼
 ┌──────────────────────────────┐
 │ Note.getAll()                │
 │ SELECT * FROM notes          │
 │ ORDER BY created_at DESC     │
 │ LIMIT limit OFFSET offset    │
 │ (NO WHERE clause = ALL notes)│
 └────────┬─────────────────────┘
          │
          ▼
 ┌──────────────────────────────┐
 │ COUNT total for pagination   │
 │ SELECT COUNT(*) FROM notes   │
 └────────┬─────────────────────┘
          │
          ▼
    ┌──────────────────────────┐
    │ 200 OK                   │
    │ Response includes:       │
    │ - ALL notes in system    │
    │  (for ALL users)         │
    │ - Admin can see notes    │
    │  from user 1, 2, 3, etc. │
    │ - Admin can manage any   │
    │  note (delete, etc.)     │
    └──────────────────────────┘
```

## 8. Error Handling Chain

```
┌────────────────────────────┐
│ Request reaches controller │
└────────┬───────────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Controller code │
    │ throws error    │
    │ or calls next() │
    │ with error      │
    └────────┬────────┘
             │
             ▼
┌───────────────────────────────┐
│ Error bubbles up to           │
│ Express error handler         │
└────────┬──────────────────────┘
         │
         ▼
┌───────────────────────────────┐
│ errorHandler middleware       │
│ (middleware/errorHandler.js)  │
│                               │
│ Checks:                       │
│ - Database error codes?       │
│   └─→ 23505 = Unique constrai│
│   └─→ 23503 = FK constraint  │
│ - Custom error object?        │
│   └─→ Has statusCode?        │
│ - Unknown error?              │
│   └─→ Default to 500         │
└────────┬──────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Generate standard error      │
│ response using               │
│ responses.error()            │
└────────┬───────────────────────┘
         │
         ▼
  ┌──────────────────────┐
  │ HTTP Response Sent   │
  │ Status + JSON body   │
  └──────────────────────┘
```

## 9. Request Lifecycle Summary

```
                    ╔═══════════════════════╗
                    ║     CLIENT REQUEST    ║
                    ║  (with or without     ║
                    ║   Authorization)      ║
                    ╚═════════════╤═════════╝
                                  │
                                  ▼
                    ╔═══════════════════════╗
                    ║ Express receives req  ║
                    ║ (app.js middleware)   ║
                    ║ - Parse JSON          ║
                    ║ - Request logging     ║
                    ╚═════════════╤═════════╝
                                  │
                    ┌─────────────┴──────────────┐
                    │ Public Route?              │
                    │ (/api/auth/register)       │
                    ▼                            ▼
        ╔═══════════════════╗      ╔════════════════════════╗
        │ Public Endpoint   │      │ Protected Endpoint     │
        │ (no auth needed)  │      │ (/api/notes)           │
        ╚═════════╤═════════╝      ╚═════════╤══════════════╝
                  │                          │
                  │                          ▼
                  │              ╔════════════════════════╗
                  │              ║ Authentication       ║
                  │              ║ Middleware           ║
                  │              ║ - Extract token      ║
                  │              ║ - Verify signature   ║
                  │              ║ - Attach user        ║
                  │              ╚═════════╤════════════╝
                  │                        │
                  │              ┌─────────┴──────────┐
                  │              ▼                    ▼
                  │         ╔═══════════╗  ╔───────────────╗
                  │         │ Success   │  │ Failure       │
                  │         │ Continue  │  │ → 401 Error   │
                  │         ╚═════╤═════╝  ╚───────────────╝
                  │               │
                  ├───────────────┤
                  │               │
                  ▼               ▼
        ╔═══════════════════════════════╗
        ║ Route-specific Validation     ║
        ║ (Joi schemas)                 ║
        ╚═════════╤═════════╤═══════════╝
                  │         │
        ┌─────────┘         └────────┐
        ▼                            ▼
   ╔════════════╗            ╔────────────────╗
   │ Valid      │            │ Invalid        │
   │ Continue   │            │ → 400 Error    │
   ╚═════╤══════╝            ╚────────────────╝
         │
         ▼
   ╔════════════════════════╗
   ║ Controller function    ║
   ║ - Business logic       ║
   ║ - DB queries via Model ║
   ║ - Error checking       ║
   ╚═════╤════════╤═════════╝
        │         │
        ▼         ▼
   Success     Error
     │           │
     │           ▼
     │     ╔═════════════════╗
     │     ║ Error Handler   ║
     │     ║ Middleware      ║
     │     ╚═════╤═══════════╝
     │           │
     └─────┬─────┘
           ▼
   ╔═══════════════════════════╗
   ║ Response Builder          ║
   ║ (responses.js)            ║
   ║ - Standard format         ║
   ║ - Status code             ║
   ║ - Message + data          ║
   ╚═════════╤═════════════════╝
             │
             ▼
   ╔═══════════════════════════╗
   ║ HTTP Response sent to     ║
   ║ client with Status Code   ║
   ║ + JSON body               ║
   ╚═══════════════════════════╝
```

## 10. Database Transaction Flow

```
Controller receives request
        ↓
   Validate input
        ↓
    (Optional checks)
        ↓
Database Query 1 (e.g., SELECT)
    ├─ Connection from pool
    ├─ Execute SQL
    ├─ Parse result rows
    ├─ Return to pool
        ↓ Results
Database Query 2 (e.g., INSERT/UPDATE/DELETE)
    ├─ Connection from pool
    ├─ Execute parameterized SQL
    │  (prevents SQL injection)
    ├─ Check constraint violations
    │  ├─ Unique constraint (23505)
    │  └─ Foreign key (23503)
    ├─ Return RETURNING clause
    ├─ Return to pool
        ├─ Success ──→ Response to client
        └─ Error ──→ Error handler
```

This flow documentation helps understand how each request moves through the system, including:
- How authentication works
- How authorization is enforced
- Where validation occurs
- How errors are handled
- Database interaction patterns
- Response generation
