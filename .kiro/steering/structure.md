# Project Structure & Organization

## Root Directory Layout
```
dripzandkicks/
├── index.html              # Main landing page
├── styles.css              # All CSS styles (single file)
├── script.js               # JavaScript functionality
├── checkout.html           # Checkout page
├── checkout.css            # Checkout-specific styles
├── checkout.js             # Checkout functionality
├── confirmation.html       # Order confirmation page
├── confirmation.js         # Confirmation page logic
├── test-image-system.html  # Image system testing
├── assets/                 # Static assets
│   ├── images/            # Product and UI images
│   └── js/                # Additional JavaScript modules
├── .kiro/                 # Kiro IDE configuration
│   ├── steering/          # AI assistant guidance
│   └── specs/             # Feature specifications
└── lore-to-launchpad/     # Separate React/TypeScript project
```

## Architecture Patterns

### Main Project (Vanilla Web)
- **Single-page application** with smooth scrolling navigation
- **Component-based CSS** using BEM-like naming conventions
- **Modular JavaScript** with clear separation of concerns
- **Progressive enhancement** approach

### File Organization Rules
- **Single CSS file** (`styles.css`) for maintainability
- **Single JavaScript file** (`script.js`) for core functionality
- **Separate files** for distinct pages (checkout, confirmation)
- **Assets folder** for all media and additional resources

### CSS Structure
```css
/* Reset and base styles */
/* CSS custom properties (:root) */
/* Layout components (header, nav, sections) */
/* UI components (buttons, cards, forms) */
/* Utility classes */
/* Media queries */
```

### JavaScript Structure
- DOM element selections at top
- Helper functions for cart persistence
- Event listeners and handlers
- Scroll and navigation logic
- Cart functionality
- Performance optimizations (throttling)

## Naming Conventions
- **CSS Classes**: kebab-case (`.nav-container`, `.product-grid`)
- **JavaScript Variables**: camelCase (`cartCount`, `prefersReduced`)
- **HTML IDs**: camelCase (`shopNowBtn`, `menuToggle`)
- **File Names**: kebab-case (`checkout.html`, `test-image-system.html`)

## Component Patterns
- **Cards**: Product cards with consistent structure
- **Buttons**: Primary/secondary button variants
- **Navigation**: Sticky header with mobile toggle
- **Modals/Drawers**: Cart drawer with overlay
- **Forms**: Size/color selection interfaces

## Responsive Design Strategy
- **Mobile-first** CSS approach
- **Flexible grid** layouts using CSS Grid and Flexbox
- **Fluid typography** and spacing
- **Touch-friendly** interactive elements
- **Performance-conscious** image loading