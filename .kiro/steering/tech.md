# Technology Stack & Build System

## Main Project (Dripz & Kix)
**Tech Stack:**
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS custom properties
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **Google Fonts** - Cabin font family for typography

**CSS Architecture:**
- CSS custom properties (CSS variables) for theming
- Mobile-first responsive design
- Breakpoints: Mobile (<900px), Desktop (≥900px), Large screens (≥1280px)
- Glassy/backdrop-filter effects for modern UI
- Smooth animations with `cubic-bezier` timing functions
- Accessibility: `prefers-reduced-motion` support

**JavaScript Patterns:**
- Event-driven architecture
- Local storage for cart persistence
- Throttled scroll listeners for performance
- DOM manipulation with modern APIs
- Error handling with try/catch blocks

## Lore-to-Launchpad Subproject
**Tech Stack:**
- **React 18** with TypeScript
- **Vite** as build tool and dev server
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Supabase** for backend/database
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching

## Common Commands

### Main Project
```bash
# Serve locally
python -m http.server 8000
# or
npx serve .

# Access at http://localhost:8000
```

### Lore-to-Launchpad
```bash
cd lore-to-launchpad

# Development
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Deployment
- **Main project**: GitHub Pages (static hosting)
- **Lore-to-Launchpad**: Vite build output suitable for any static host
- Both projects are configured for production deployment