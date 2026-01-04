# BridgeVantage

## Overview

BridgeVantage is a Talent Mobility and Cultural Integration platform designed for enterprise HR and talent management. The application helps organizations visualize employee skills, identify retention risks, facilitate cross-departmental mentorship, and bridge knowledge gaps between legacy and digital teams.

The platform features two distinct views:
- **Employee View**: Personal skill radar, profile editing, and mentorship recommendations
- **Talent Manager View**: Retention heatmaps, cultural sync pairings, and organization-wide analytics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Chart.js with react-chartjs-2 for skill radar visualizations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api` prefix
- **Build**: Vite for frontend, esbuild for server bundling

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route page components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
```

### Key Design Patterns
- **Role-based Views**: Conditional rendering switches between Employee and Manager dashboards without page reload
- **Shared Schema**: Database types defined once in `shared/schema.ts` and used by both frontend and backend
- **Component Composition**: shadcn/ui provides unstyled primitives that are styled consistently via Tailwind

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for Express sessions

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **chart.js / react-chartjs-2**: Radar chart visualizations for employee skills
- **@radix-ui/***: Accessible UI primitives (dialog, dropdown, tooltip, etc.)
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Build Tools
- **Vite**: Frontend development server and bundler
- **esbuild**: Server-side bundling for production
- **drizzle-kit**: Database migration tooling