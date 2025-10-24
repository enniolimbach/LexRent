# LexRent Design Guidelines

## Design Approach

**Selected Approach:** Design System-Based (Material Design + Swiss Design Principles)

**Justification:** LexRent is a professional legal tech application requiring trust, clarity, and information processing efficiency. The utility-focused nature, information-dense content, and need for stability align with a systematic design approach. We'll blend Material Design's structured components with Swiss design's precision and minimalism.

**Core Principles:**
- Trust through clarity and transparency
- Information hierarchy that guides users through complex legal data
- Professional aesthetic befitting legal/financial applications
- Swiss sensibilities: precision, neutrality, functional beauty

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts) - Modern, highly legible, professional
- Monospace: JetBrains Mono - For displaying JSON data and contract details

**Hierarchy:**
- Hero/H1: 3xl to 4xl (text-3xl md:text-4xl), font-bold, tracking-tight
- Section Headers/H2: 2xl to 3xl (text-2xl md:text-3xl), font-semibold
- Card Titles/H3: xl to 2xl (text-xl md:text-2xl), font-semibold
- Body Large: lg (text-lg), font-normal, leading-relaxed
- Body Regular: base (text-base), font-normal, leading-normal
- Body Small/Helper: sm (text-sm), font-normal
- Legal/Technical Data: sm monospace, font-medium
- Labels: sm (text-sm), font-medium, uppercase tracking-wide

---

## Layout System

**Spacing Primitives (Tailwind Units):**
- Micro spacing: 1, 2 (gaps, small padding)
- Standard spacing: 4, 6, 8 (component padding, margins)
- Section spacing: 12, 16, 20 (vertical rhythm, card spacing)
- Page margins: 24, 32 (large breakpoints)

**Container Strategy:**
- Max width: max-w-6xl for main content area
- Constrained reading width: max-w-3xl for text-heavy sections
- Full bleed for hero/header sections with inner max-w-6xl

**Grid System:**
- Single column on mobile (base)
- 2-column for data display cards on tablet+ (md:grid-cols-2)
- Asymmetric layouts for upload area (2/3) vs. info sidebar (1/3) on desktop

---

## Component Library

### Navigation
- Clean header with logo left, minimal navigation right
- Sticky navigation: shadow appears on scroll
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16 with proper padding

### File Upload Component
- Large drag-and-drop zone: min-h-64 on desktop, min-h-48 mobile
- Dashed border (border-2 border-dashed) with rounded corners (rounded-xl)
- Centered icon (document icon, size w-16 h-16) above text
- Clear hierarchy: "Vertrag hochladen" (large), supported formats below (small)
- Hover state: subtle scale transform and opacity change
- Active drag state: distinct visual feedback
- File preview after upload: compact card with filename, size, remove option

### Result Card / Data Display
- Card container: rounded-lg with shadow-md, padding p-6
- Section headers within cards: border-b pb-3 mb-4
- Data rows: Grid layout (grid grid-cols-2 gap-x-8 gap-y-4)
- Label-value pairs: Label uppercase sm font-medium, value base font-normal
- JSON data display: monospace font in contained box with subtle background, rounded corners, p-4
- Collapsible sections for detailed data with chevron indicators

### Buttons
- Primary CTA: px-6 py-3, rounded-lg, font-semibold, shadow-sm
- Secondary: px-4 py-2, rounded-md, font-medium
- Icon buttons: square aspect ratio, p-2, rounded-md
- Full-width on mobile, auto-width on desktop for primary actions

### Status Indicators
- Upload progress: Linear progress bar, h-2, rounded-full
- Success/error states: Alert boxes with icons, rounded-lg, p-4
- Loading states: Spinner with descriptive text

### Information Cards
- Feature cards explaining process: min-h-48, p-6, rounded-lg
- Icon top-left (w-10 h-10), title, description below
- Subtle hover elevation increase

---

## Page Structure

### Landing/Home Page
**Hero Section:**
- Height: 70vh minimum, centered content
- Headline with strong hierarchy
- Subtitle explaining value proposition
- Primary CTA (Upload button) + Secondary CTA (Learn more)
- Trust indicators: "Basierend auf Art. 270a OR" badge
- Background: Subtle gradient or abstract legal-themed illustration

**How It Works Section:**
- 3-column grid (stacks to single column mobile)
- Step cards with numbers, icons, descriptions
- Vertical rhythm: py-20

**Features Section:**
- 2-column alternating layout
- Feature description left/right with supporting visual placeholder
- Each feature: heading, body text, optional list

**Trust Section:**
- Single column, centered, max-w-3xl
- Legal disclaimers, data privacy assurance
- Compact spacing: py-12

**Footer:**
- 3-column layout: About, Legal Links, Contact
- Copyright and language switcher
- Minimal height, comprehensive information

### Upload/Application Page
**Single Column Focus:**
- Centered upload zone: max-w-2xl
- Progress indicator if multi-step
- Clear instructions above upload area
- Helper text below explaining supported formats (PDF, JPG, PNG)

**Results Display:**
- Extracted data card immediately below upload
- Collapsible sections for different data categories
- Action buttons at bottom: "Berechnung durchführen" (disabled/TODO), "Neu beginnen"

---

## Images

**Hero Section Image:**
- Abstract illustration or photograph suggesting legal documents, Swiss housing, or contract review
- Style: Clean, professional, not stock-photo generic
- Placement: Background with overlay or split-screen right side
- Treatment: Subtle opacity or blur to not compete with text

**Feature Section Images:**
- Icon-based illustrations rather than photographs
- Document icons, checkmark badges, calculation symbols
- Keep minimal and professional

**No images needed for:**
- Upload interface (icon-only)
- Data display sections (focus on clarity)

---

## Accessibility & Interaction

- Focus states: Visible ring with offset (ring-2 ring-offset-2)
- Touch targets: Minimum 44px height for interactive elements
- Form inputs: Clear labels, placeholder text, error messages inline
- Keyboard navigation: Logical tab order, Enter to submit
- Screen reader: Proper ARIA labels for upload zone and dynamic content

---

## Animation Guidelines

**Minimal, purposeful motion:**
- Page transitions: None (instant)
- Upload progress: Smooth linear animation
- Card hover: Subtle scale (scale-105) with smooth transition
- Success states: Simple fade-in for confirmation messages
- Loading: Spinner rotation only, no elaborate sequences

**Timing:** transition-all duration-200 for most interactions