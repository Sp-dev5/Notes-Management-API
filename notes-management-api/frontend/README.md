# Notes Management Frontend

Modern React application with Tailwind CSS for the Notes Management platform.

## Features

- ✅ Responsive design
- ✅ Light/Dark mode support
- ✅ Authentication pages (Login/Register)
- ✅ Dashboard with note management
- ✅ Search functionality
- ✅ Real-time updates with React Query
- ✅ State management with Zustand

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

## Running the Application

Development mode:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at \`http://localhost:5173\`

Build for production:
\`\`\`bash
npm run build
\`\`\`

Preview production build:
\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── context/          # Zustand stores
│   ├── layouts/          # Layout components
│   ├── utils/            # Utility functions and types
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
\`\`\`

## Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Lucide React
- **Language**: TypeScript

## API Integration

The frontend is configured to connect to the backend API at \`http://localhost:5000/api/v1\`.

Update the API base URL in \`src/utils/api.ts\` if needed.

## Environment Variables

No environment variables are required for the frontend in development mode.

For production, update the API URL in \`src/utils/api.ts\`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
