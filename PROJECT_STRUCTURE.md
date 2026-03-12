# Project Structure & File Organization

## Complete Directory Tree

```
notes-management-api/
│
├── README.md                          # Main project documentation
├── GETTING_STARTED.md                 # Quick start guide
├── ARCHITECTURE.md                    # System design and architecture
├── API_EXAMPLES.md                    # API endpoints with curl examples
├── DEPLOYMENT.md                      # Production deployment guide
├── .gitignore                         # Git ignore rules
├── docker-compose.yml                 # Docker services orchestration
├── Dockerfile.backend                 # Backend container config
├── Dockerfile.frontend                # Frontend container config
│
├── backend/                           # Express.js backend API
│   ├── src/
│   │   ├── index.ts                   # Main Express application setup
│   │   ├── server.ts                  # Server entry point
│   │   │
│   │   ├── config/
│   │   │   └── index.ts              # Environment & config management
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Auth endpoint handlers
│   │   │   └── notesController.ts    # Notes endpoint handlers
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.ts               # Authentication routes
│   │   │   └── notes.ts              # Notes routes
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification middleware
│   │   │   └── errorHandler.ts       # Global error handling
│   │   │
│   │   ├── services/
│   │   │   ├── authService.ts        # Auth business logic
│   │   │   └── notesService.ts       # Notes business logic
│   │   │
│   │   └── utils/
│   │       ├── jwt.ts                # JWT utilities
│   │       ├── errors.ts             # Error handling utilities
│   │       └── validation.ts         # Zod schemas & types
│   │
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema definition
│   │   └── seed.ts                   # Database seeding script
│   │
│   ├── package.json                  # Backend dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── main.tsx                  # React entry point
│   │   ├── App.tsx                   # Main app with routing
│   │   ├── index.css                 # Global styles
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.tsx           # Landing/homepage
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Register.tsx          # Register page
│   │   │   ├── Dashboard.tsx         # Notes dashboard
│   │   │   ├── Profile.tsx           # User profile page
│   │   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── FormField.tsx         # Reusable form input
│   │   │   ├── NoteCard.tsx          # Note display card
│   │   │   ├── NoteEditor.tsx        # Note create/edit modal
│   │   │   └── ThemeToggle.tsx       # Light/dark mode toggle
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx        # Main application layout
│   │   │   └── Sidebar.tsx           # Navigation sidebar
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth queries (login, register)
│   │   │   └── useNotes.ts           # Notes queries (CRUD, search)
│   │   │
│   │   ├── services/
│   │   │   └── api.ts                # API integration functions
│   │   │
│   │   ├── utils/
│   │   │   ├── api.ts                # Axios setup & token management
│   │   │   └── types.ts              # TypeScript interfaces
│   │   │
│   │   └── context/
│   │       └── store.ts              # Zustand state stores
│   │
│   ├── index.html                    # HTML entry point
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── package.json                  # Frontend dependencies
│   └── README.md                     # Frontend documentation
```

## File Responsibilities

### Backend Files

#### Core
- **src/index.ts** - Creates Express app, sets up middleware, routes, error handling
- **src/server.ts** - Starts HTTP server, handles graceful shutdown

#### Configuration
- **config/index.ts** - Loads and validates environment variables
- **prisma/schema.prisma** - Defines database tables and relations
- **prisma/seed.ts** - Creates sample users and notes

#### Controllers (Request Handling)
- **controllers/authController.ts** - Registers, logs in users, gets profile
- **controllers/notesController.ts** - CRUD operations, search, pagination

#### Routes (URL Mapping)
- **routes/auth.ts** - Maps /auth endpoints to controllers
- **routes/notes.ts** - Maps /notes endpoints to controllers

#### Middleware (Request Processing)
- **middleware/auth.ts** - Verifies JWT tokens, checks authorization
- **middleware/errorHandler.ts** - Catches errors and formats responses

#### Services (Business Logic)
- **services/authService.ts** - User registration, authentication, hashing
- **services/notesService.ts** - Note CRUD, search, filtering, pagination

#### Utilities
- **utils/jwt.ts** - Generates and verifies JWT tokens
- **utils/errors.ts** - Creates consistent error responses
- **utils/validation.ts** - Zod schemas for input validation

### Frontend Files

#### Core
- **main.tsx** - Mounts React app to DOM
- **App.tsx** - Sets up routing and query client

#### Pages (Full Screen Components)
- **Landing.tsx** - Marketing page with features and CTA
- **Login.tsx** - Login form with validation
- **Register.tsx** - Signup form with password confirmation
- **Dashboard.tsx** - Main user interface for managing notes
- **Profile.tsx** - User information display
- **ProtectedRoute.tsx** - Redirects unauthenticated users to login

#### Components (Reusable Pieces)
- **Header.tsx** - Top navigation with search and user menu
- **Sidebar.tsx** - Application navigation menu
- **FormField.tsx** - Text input with error display
- **NoteCard.tsx** - Individual note display with edit/delete
- **NoteEditor.tsx** - Modal for creating/editing notes
- **ThemeToggle.tsx** - Light/dark mode button

#### Hooks (Custom Logic)
- **useAuth.ts** - Login, register, get profile mutations
- **useNotes.ts** - Note queries, mutations, search hook

#### State Management
- **context/store.ts** - Zustand stores for auth and theme
  - useAuthStore: User, token, authentication
  - useThemeStore: Dark mode preference

#### Services & Utils
- **services/api.ts** - API integration functions
- **utils/api.ts** - Axios client with auth headers
- **utils/types.ts** - TypeScript interfaces

#### Styles
- **index.css** - Global styles with Tailwind and custom components

### Configuration Files

#### Backend
- **package.json** - Dependencies, scripts, metadata
- **tsconfig.json** - TypeScript compiler options
- **.env.example** - Environment variables template

#### Frontend
- **package.json** - Dependencies, scripts, metadata
- **tsconfig.json** - TypeScript compiler options
- **vite.config.ts** - Vite bundler configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **index.html** - Root HTML file

#### Docker
- **docker-compose.yml** - PostgreSQL, backend, frontend services
- **Dockerfile.backend** - Backend image build instructions
- **Dockerfile.frontend** - Frontend image build instructions

## Data Flow

### Authentication Flow
1. User submits form on Login/Register page
2. Form handler calls API function
3. API makes HTTP request to backend
4. Controller validates input, calls service
5. Service creates/verifies user, returns JWT
6. Frontend stores token in localStorage
7. Token sent in Authorization header on future requests
8. Auth middleware verifies token before processing request

### Note Management Flow
1. User clicks "New Note" or edits existing note
2. Modal opens with NoteEditor component
3. User fills in title and content
4. Form submission calls createNote or updateNote
5. API function makes HTTP POST/PUT request
6. Backend controller validates, calls service
7. Service creates/updates note in database
8. Response returned to frontend
9. React Query automatically refetches and updates UI

### Search Flow
1. User types in search header
2. Debounced search query triggers
3. useSearchNotes hook is activated
4. API sends search request with query parameter
5. Backend searches title and content with case-insensitive matching
6. Results returned with pagination
7. UI updates with matching notes

## Key Design Decisions

### Backend Architecture
- **Service Layer**: Business logic separated from HTTP handlers
- **Middleware Stack**: Auth, validation, error handling in pipeline
- **Zod Validation**: Type-safe schema validation
- **JWT Auth**: Stateless authentication suitable for APIs
- **Prisma ORM**: Type-safe database access with migrations

### Frontend Architecture
- **Zustand State**: Minimal setup for global state (auth, theme)
- **React Query**: Server state management with caching and sync
- **Hook-based**: Custom hooks for data fetching (useNotes, useAuth)
- **Component Composition**: Small, focused, reusable components
- **Tailwind CSS**: Utility-first CSS for rapid UI development

## Environment Configuration

### Backend Environment Variables
```
DATABASE_URL     # PostgreSQL connection string
PORT             # Server port (default: 5000)
NODE_ENV         # development/production
JWT_SECRET       # Token signing key
JWT_EXPIRES_IN   # Access token lifetime
JWT_REFRESH_SECRET # Refresh token key
JWT_REFRESH_EXPIRES_IN # Refresh token lifetime
FRONTEND_URL     # Allowed CORS origin
```

### Frontend Configuration
```
VITE_API_URL     # Backend API base URL
```

## Build & Deployment

### Development
- Backend: `npm run dev` (tsx watch with auto-reload)
- Frontend: `npm run dev` (Vite dev server with HMR)

### Production
- Backend: `npm run build` → TypeScript compiled to dist/
- Frontend: `npm run build` → React compiled to dist/

### Docker
- Single command: `docker-compose up -d`
- Automatically starts PostgreSQL, backend, and frontend

## Testing & Quality

### Validation
- Backend: Zod schemas on all inputs
- Frontend: HTML5 form validation + custom checks

### Error Handling
- Consistent JSON error format
- Proper HTTP status codes
- User-friendly error messages

### Performance
- React Query caching prevents unnecessary API calls
- Pagination for note lists
- Lazy loading via React Router

---

**Complete, production-ready Notes Management Platform built with best practices! 🚀**
