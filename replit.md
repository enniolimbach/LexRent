# LexRent - Swiss Rental Contract Analysis Platform

## Overview

LexRent is a legal tech application designed for Swiss tenants to analyze rental contracts and determine potential rent reductions based on Swiss rental law (Art. 270a OR). The application uses OCR technology to extract contract data from uploaded documents, guides users through an interactive dialog to collect missing information, performs legal calculations to assess rent adjustment possibilities, and automatically generates formal letters to landlords as downloadable PDFs.

The system is built as a full-stack web application with a React frontend and Express backend. All core features are implemented (Phases 1-4): file upload with OCR extraction, interactive dialog, legal calculation engine, and PDF letter generation. Future enhancements include real OCR integration and production deployment.

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

**Agent Architecture**: 
- `DialogAgent` (client-side): State machine pattern for interactive question flow, manages conversation state and determines questions based on data completeness
- `CalculationAgent` (client-side): Performs Swiss rental law calculations per Art. 270a OR, generates German legal explanations
- `DocumentAgent` (client-side): Transforms contract and calculation data into formal German business letters

### Backend Architecture

**Framework**: Express.js on Node.js with TypeScript, using ES modules.

**API Design**: RESTful endpoints with file upload support via Multer (memory storage, 10MB limit, supports PDF/JPG/PNG).

**OCR Processing**: Server-side OCR agent (`extractContractData`) currently returns comprehensive mock data including tenant/landlord information. Designed for future integration with Google Cloud Vision API, Tesseract.js, or Azure Form Recognizer.

**Calculation Engine**: Complete implementation of Swiss rental law formulas (`client/src/utils/calculationFormulas.ts`):
- Reference rate differential calculation (Art. 270a OR)
- Interest-based rent reduction (2.91% per 0.25% rate change)
- Cost increase offsetting (configurable annual percentage)
- Inflation adjustment based on LIK (Landesindex der Konsumentenpreise)
- Effective reduction calculation with detailed breakdown

**Session Management**: Uses connect-pg-simple for PostgreSQL-backed session storage.

**Development Tools**: Custom Vite middleware setup for HMR (Hot Module Replacement) in development, with production-ready static file serving.

### Data Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database queries.

**Schema Design**: 
- Users table with UUID primary keys
- Contract data validated via Zod schemas (`contractDataSchema`) with fields for rent amounts, reference rates, dates, location, user preferences, and Phase 4 additions (tenant name, landlord/management company, property address)
- Dialog state tracking with enum-based field identifiers
- Calculation result interface with detailed breakdown structure

**Validation Strategy**: Zod schemas shared between client and server (`shared/schema.ts`) ensure consistent validation. The `getMissingFields` utility determines data completeness for the dialog flow.

**Data Flow**: File upload → Server OCR extraction → Validation → Interactive dialog → Calculation with breakdown → **PDF letter generation** → Download

### External Dependencies

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`) with connection pooling support.

**UI Components**: 
- Radix UI component primitives (45+ components including Dialog, Popover, Select, Toast, etc.)
- Embla Carousel for any carousel functionality
- CMDK for command palette patterns
- Lucide React for iconography
- @react-pdf/renderer for client-side PDF generation (Phase 4)

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

**PDF Generation** (Phase 4):
- @react-pdf/renderer for creating professional Swiss business letters
- Client-side PDF rendering with proper German character support (umlauts: ä, ö, ü, ß)
- Swiss formatting for currency (CHF with apostrophes) and dates

**Future Integrations**:
- Real OCR service provider (Google Cloud Vision API, Tesseract.js, or Azure Form Recognizer)
- PDF parsing libraries for advanced contract document processing
- Email service for direct letter sending to landlords (currently download-only)
- Integration with BWO (Bundesamt für Wohnungswesen) for official reference rate data
- BFS (Bundesamt für Statistik) for official inflation/LIK data

## Project Status (October 2025)

**Phase 1 - MVP (Completed)**: File upload with drag & drop, mock OCR extraction, structured JSON display
**Phase 2 - Interactive Dialog (Completed)**: State machine for missing data collection, chat interface with 5-question sequence, automatic summary transition
**Phase 3 - Legal Calculation (Completed)**: Complete Swiss rental law formula implementation, German explanations, detailed breakdown display
**Phase 4 - PDF Generation (Completed)**: Automatic formal letter generation, professional Swiss business letter layout, PDF download functionality

**Current State**: Production-ready prototype with complete user journey from upload to PDF download. All core features tested and validated via automated E2E tests.

**Key Components**:
- `client/src/pages/home.tsx`: Main application with state management
- `client/src/agents/`: DialogAgent, CalculationAgent, DocumentAgent
- `client/src/components/`: FileUpload, ChatInterface, ResultSummary, PdfPreview, LetterDocument
- `client/src/utils/`: calculationFormulas, pdfTemplates, validation
- `server/agents/ocrAgent.ts`: Mock OCR extraction (ready for real integration)
- `shared/schema.ts`: Shared data schemas and types