# MDRRMO Pio Duran - Public Preparedness for Disaster App

## Overview

This is a mobile-first Progressive Web Application (PWA) for the Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran. The app provides disaster preparedness tools, emergency hotlines, incident reporting, typhoon tracking, interactive maps, and AI-powered assistance for citizens during emergencies.

The application is built as a Create React App (CRA) project with CRACO for extended configuration, featuring offline-first capabilities with service workers and IndexedDB for storing incident reports when offline.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Create React App, extended via CRACO for custom webpack configuration
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **State Management**: React Context API (AuthContext for authentication)
- **Routing**: React Router DOM for client-side navigation
- **UI Components**: Radix UI primitives wrapped with shadcn/ui, Framer Motion for animations
- **Maps**: Leaflet for interactive mapping functionality
- **Mobile-First**: Fixed max-width of 430px, optimized for mobile devices

### Backend Architecture
- **Server**: Express.js dev server with custom middleware for API routes
- **Database**: PostgreSQL with Drizzle ORM (node-postgres driver)
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **AI Integration**: OpenAI API via Replit AI Integrations for chat and image generation

### Offline-First PWA Features
- **Service Worker**: Custom service worker for asset caching and offline support
- **Cache Strategy**: Static assets cached on install, API responses cached at runtime
- **Offline Queue**: IndexedDB-based queue for storing incident reports when offline
- **Cache Manager**: Utility for pre-caching critical API endpoints

### Database Schema
- **Conversations**: Chat conversation storage with id, title, createdAt
- **Messages**: Individual messages linked to conversations with role and content

### Key Application Modules
1. **Home/Dashboard**: Main navigation hub with module cards
2. **Hotline Numbers**: Emergency contact directory
3. **Report Incident**: Geotagged incident reporting with offline support
4. **Typhoon Dashboard/History**: Real-time typhoon tracking and historical data
5. **Interactive Map**: Leaflet-based map for evacuation centers and hazard zones
6. **Disaster Guidelines**: Preparedness information and checklists
7. **AI Assistant**: OpenAI-powered chat for emergency guidance
8. **Admin Dashboard**: Administrative interface with setup capabilities

### Authentication
- JWT-based authentication with tokens stored in localStorage
- Axios interceptors for automatic token injection and 401 handling
- Protected routes via AuthContext provider

## External Dependencies

### Third-Party Services
- **OpenAI API**: Powers AI assistant chat and image generation via Replit AI Integrations
- **Reverse Geocoding**: Used for converting coordinates to addresses in geolocation hook

### Database
- **PostgreSQL**: Primary database with Drizzle ORM
- **Neon Database**: Serverless PostgreSQL option (neon-http driver available)

### Key NPM Packages
- **drizzle-orm/drizzle-kit**: Database ORM and migrations
- **axios**: HTTP client for API requests
- **leaflet**: Interactive maps
- **framer-motion**: Animations
- **sonner**: Toast notifications
- **react-hook-form + zod**: Form handling and validation
- **date-fns**: Date manipulation

### Development Tools
- **CRACO**: CRA configuration override
- **Custom Webpack Plugins**: Health check monitoring and visual editing support
- **Babel Plugin**: Custom metadata injection for visual editing features

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI API base URL
- `REACT_APP_BACKEND_URL`: Backend API URL (optional, defaults to same origin)