# Dripz & Kix Image Management System

This directory contains the centralized image management system for the Dripz & Kix website product cards.

## Directory Structure

```
assets/
├── images/
│   ├── products/           # Product images (to be populated)
│   ├── fallback-*.svg      # Category-specific fallback images
│   └── README.md          # This file
└── js/
    ├── image-manager.js    # Core image management system
    └── image-integration.js # Integration utilities
```

## Product Images Directory

The `products/` directory should contain optimized product images with the following naming convention:

- `classic-white-sneaker.jpg`
- `night-runner-sneaker.jpg`
- `color-pop-sneaker.jpg`
- `retro-court-sneaker.jpg`
- `runner-pro-sneaker.jpg`
- `minimal-slip-sneaker.jpg`
- `future-flex-sneaker.jpg`
- `street-proto-sneaker.jpg`
- `track-alpha-sneaker.jpg`

## Image Specifications

### Dimensions
- **Source Resolution**: 800x600px (4:3 aspect ratio)
- **Display Size**: 220px height, 100% width (CSS controlled)
- **File Size**: Target under 150KB per image

### Formats
- **Primary**: JPEG (.jpg) for broad compatibility
- **Future**: WebP with JPEG fallback for optimization

### Quality Guidelines
- Consistent lighting and background treatment
- Product centered and properly positioned
- Similar angle and perspective across all images
- Professional product photography quality

## Fallback System

The system includes category-specific SVG fallbacks:

- `fallback-sneaker.svg` - Default fallback for any product
- `fallback-classic.svg` - Classic/casual sneakers
- `fallback-runner.svg` - Running shoes
- `fallback-lifestyle.svg` - Lifestyle sneakers
- `fallback-performance.svg` - Performance/athletic shoes

## Usage

### Basic Integration

```html
<!-- Include the image management system -->
<script src="assets/js/image-manager.js"></script>
<script src="assets/js/image-integration.js"></script>
```

### JavaScript API

```javascript
// Get product image configuration
const imageConfig = ImageManager.getProductImage('classic-white');

// Apply new image system to all sections
ImageIntegration.applyNewImageSystem();

// Update a specific card
ImageIntegration.updateCardImage(cardElement, 'night-runner');
```

## Adding New Products

1. Add optimized image to `products/` directory
2. Update `PRODUCT_IMAGES` configuration in `image-manager.js`
3. Add product mapping in `image-integration.js` if needed

Example configuration:
```javascript
'new-product': {
  id: 'new-product',
  src: 'new-product-sneaker.jpg',
  alt: 'Descriptive alt text for accessibility',
  category: 'classic', // classic, runner, lifestyle, performance
  colorway: 'blue',
  fallbackText: 'New product sneaker',
  width: 800,
  height: 600
}
```

## Performance Considerations

- Images are lazy-loaded by default
- Critical images (first 3 products) are preloaded
- Fallback system prevents broken image displays
- Version-based cache busting for updates

## Browser Support

- Modern browsers with ES6+ support
- Graceful degradation for older browsers
- SVG fallback support for all browsers

## Maintenance

- Regularly optimize images for web delivery
- Update version number in `IMAGE_CONFIG` when making changes
- Test fallback system after updates
- Monitor loading performance and adjust as needed