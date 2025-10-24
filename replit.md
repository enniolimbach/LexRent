# LexRent - Swiss Rental Contract Analysis Platform

## Overview

LexRent is a legal tech application designed for Swiss tenants to analyze rental contracts and determine potential rent reductions based on Swiss rental law (Art. 270a OR). The application uses OCR technology to extract contract data from uploaded documents, guides users through an interactive dialog to collect missing information, and performs legal calculations to assess rent adjustment possibilities.

The system is built as a full-stack web application with a React frontend and Express backend, currently in Phase 1 (MVP with mock data) with plans to integrate real OCR services and complete calculation logic in Phase 2.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Shadcn/ui (New York style variant) built on Radix UI primitives, providing accessible, composable components with consistent styling through Tailwind CSS.

**Design System**: Material Design principles combined with Swiss design sensibilities (precision, clarity, functional beauty). Uses Inter font for body text and JetBrains Mono for technical/legal data display. Color system is based on HSL values with CSS variables for theming support.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Local component state managed with React hooks.

**Routing**: Wouter for lightweight client-side routing.

**Form Handling**: React Hook Form with Zod for schema validation via @hookform/resolvers.

**Agent Architecture**: Client-side dialog agent (`DialogAgent` class) implements a state machine pattern to manage the interactive question flow for collecting missing contract data. The agent maintains conversation state and determines which questions to ask based on data completeness validation.

### Backend Architecture

**Framework**: Express.js on Node.js with TypeScript, using ES modules.

**API Design**: RESTful endpoints with file upload support via Multer (memory storage, 10MB limit, supports PDF/JPG/PNG).

**OCR Processing**: Server-side OCR agent (`extractContractData`) currently returns mock data for Phase 1. Designed for future integration with Google Cloud Vision API, Tesseract.js, or Azure Form Recognizer.

**Calculation Engine**: Placeholder utilities (`server/utils/calculations.ts`) for Swiss rental law calculations (Art. 270a OR). Will implement reference rate differential calculations, inflation adjustments, and cost increase considerations in Phase 2.

**Session Management**: Uses connect-pg-simple for PostgreSQL-backed session storage.

**Development Tools**: Custom Vite middleware setup for HMR (Hot Module Replacement) in development, with production-ready static file serving.

### Data Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database queries.

**Schema Design**: 
- Users table with UUID primary keys
- Contract data validated via Zod schemas (`contractDataSchema`) with fields for rent amounts, reference rates, dates, location, and user preferences
- Dialog state tracking with enum-based field identifiers

**Validation Strategy**: Zod schemas shared between client and server (`shared/schema.ts`) ensure consistent validation. The `getMissingFields` utility determines data completeness for the dialog flow.

**Data Flow**: File upload → Server OCR extraction → Validation → Dialog collection → Calculation → Results display

### External Dependencies

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`) with connection pooling support.

**UI Components**: 
- Radix UI component primitives (45+ components including Dialog, Popover, Select, Toast, etc.)
- Embla Carousel for any carousel functionality
- CMDK for command palette patterns
- Lucide React for iconography

**Build Tools**:
- Vite for frontend bundling with React plugin
- esbuild for backend bundling
- Tailwind CSS with PostCSS for styling
- TypeScript compiler for type checking

**Development Dependencies**:
- Replit-specific plugins (runtime error overlay, cartographer for code mapping, dev banner)
- tsx for TypeScript execution in development

**Date Handling**: date-fns library for date formatting and manipulation (Swiss locale support).

**Utility Libraries**:
- clsx and tailwind-merge (via cn utility) for conditional className composition
- class-variance-authority for component variant management
- nanoid for generating unique identifiers

**Future Integrations** (Phase 2):
- OCR service provider (Google Cloud Vision API, Tesseract.js, or Azure Form Recognizer)
- PDF parsing libraries for contract document processing
- Email service for sending legal letters to landlords