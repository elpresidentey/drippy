# Product Image Data Structure

## Overview

This document describes the centralized data structure for managing product images across the Dripz & Kix website. The structure provides versioning, cache management, and easy maintenance capabilities.

## Configuration Structure

### Main Configuration Object

```javascript
const IMAGE_CONFIG = {
  version: '1.0.0',           // Version for cache busting
  lastUpdated: '2024-12-09',  // Last modification date
  baseUrl: 'https://images.unsplash.com',  // CDN base URL
  defaults: { ... },          // Default image parameters
  breakpoints: { ... },       // Responsive breakpoints
  products: { ... },          // Product image mappings
  fallbacks: { ... }          // Fallback image configurations
}
```

### Product Data Schema

Each product follows this standardized schema:

```javascript
{
  id: 'product-identifier',           // Unique product ID
  unsplashId: 'photo-1234567890',     // Unsplash photo identifier
  alt: 'Descriptive alt text',        // Accessibility description
  category: 'classic|runner|lifestyle|performance',  // Product category
  colorway: 'color-description',      // Primary color
  fallbackText: 'Short description', // Fallback alt text
  priority: 'high|medium|low',        // Loading priority
  tags: ['tag1', 'tag2', 'tag3']     // Searchable tags
}
```

## Product Categories

### Classic Sneakers
- **classic-white**: Premium white leather minimalist design
- **retro-court**: Vintage-inspired court shoe with modern comfort

### Running Shoes  
- **night-runner**: Sleek black running shoe with mesh upper

### Performance Sneakers
- **runner-pro**: High-performance grey running shoe
- **future-flex**: Modern performance sneaker with innovative design
- **track-alpha**: Athletic track shoe optimized for training

### Lifestyle Sneakers
- **color-pop**: Vibrant lifestyle sneaker with bold colors
- **minimal-slip**: Clean slip-on design in neutral tones
- **street-proto**: Modern street-style sneaker with metallic accents

## Priority System

### High Priority (Above-the-fold)
Products that appear in the initial viewport and should be preloaded:
- `classic-white`
- `night-runner` 
- `color-pop`

### Medium Priority (Second fold)
Products visible after initial scroll:
- `retro-court`
- `runner-pro`
- `minimal-slip`

### Low Priority (Below fold)
Products in later sections, loaded on demand:
- `future-flex`
- `street-proto`
- `track-alpha`

## Responsive Breakpoints

### Small Devices (400w)
- **Dimensions**: 400x300px
- **Target**: Mobile phones, small screens
- **Descriptor**: `400w`

### Medium Devices (600w)  
- **Dimensions**: 600x450px
- **Target**: Tablets, medium screens
- **Descriptor**: `600w`

### Large Devices (800w)
- **Dimensions**: 800x600px  
- **Target**: Desktop, large screens
- **Descriptor**: `800w`

## Fallback System

### Default Fallback
- **Path**: `assets/images/fallback-sneaker.svg`
- **Usage**: When no category-specific fallback exists

### Category-Specific Fallbacks
- **Classic**: `assets/images/fallback-classic.svg`
- **Runner**: `assets/images/fallback-runner.svg`
- **Lifestyle**: `assets/images/fallback-lifestyle.svg`
- **Performance**: `assets/images/fallback-performance.svg`

## Utility Functions

### Core Functions

#### `getProductConfig(productId)`
Retrieves complete product configuration by ID.

```javascript
const config = getProductConfig('classic-white');
// Returns: { id: 'classic-white', unsplashId: '...', alt: '...', ... }
```

#### `buildImageUrl(productId, options)`
Generates optimized image URL with custom parameters.

```javascript
const url = buildImageUrl('classic-white', { 
  width: 600, 
  height: 450, 
  format: 'webp' 
});
```

#### `getImageAttributes(productId, options)`
Returns complete HTML image attributes object.

```javascript
const attrs = getImageAttributes('classic-white', { 
  responsive: true, 
  webp: true 
});
// Returns: { src: '...', srcset: '...', alt: '...', loading: 'lazy', ... }
```

### Query Functions

#### `getProductsByCategory(category)`
Returns all products in a specific category.

```javascript
const classicProducts = getProductsByCategory('classic');
// Returns: [{ id: 'classic-white', ... }, { id: 'retro-court', ... }]
```

#### `getHighPriorityProducts()`
Returns product IDs marked as high priority for preloading.

```javascript
const priorityProducts = getHighPriorityProducts();
// Returns: ['classic-white', 'night-runner', 'color-pop']
```

## Version Management

### Cache Busting
The version number is included in data attributes to enable cache invalidation:

```html
<img data-version="1.0.0" ... />
```

### Update Process
1. Modify product configurations
2. Increment version number
3. Update lastUpdated timestamp
4. Deploy changes

### Backward Compatibility
- Maintain consistent function signatures
- Add new fields without removing existing ones
- Provide migration guides for breaking changes

## Integration Examples

### Basic Usage
```javascript
// Get image attributes for a product
const attrs = getImageAttributes('classic-white');

// Apply to image element
Object.entries(attrs).forEach(([key, value]) => {
  imgElement.setAttribute(key, value);
});
```

### Responsive Implementation
```javascript
// Get responsive image with WebP support
const attrs = getImageAttributes('night-runner', {
  responsive: true,
  webp: true,
  loading: 'eager' // For above-the-fold images
});
```

### Preloading Critical Images
```javascript
// Preload high priority images
const criticalProducts = getHighPriorityProducts();
criticalProducts.forEach(productId => {
  const url = buildImageUrl(productId);
  preloadImage(url);
});
```

## Validation & Testing

### Configuration Validation
```javascript
const validation = validateConfig();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

### Test Coverage
- ✅ All products have required fields
- ✅ Unsplash IDs are valid format
- ✅ Alt text is descriptive and accessible
- ✅ Categories match defined types
- ✅ Priority levels are assigned
- ✅ Fallback images exist

## Maintenance Guidelines

### Adding New Products
1. Add product entry to `IMAGE_CONFIG.products`
2. Include all required schema fields
3. Assign appropriate priority level
4. Update version number
5. Test image loading and fallbacks

### Updating Existing Products
1. Modify product configuration
2. Increment version number
3. Update lastUpdated timestamp
4. Clear relevant caches
5. Validate changes

### Performance Monitoring
- Track image load times by product
- Monitor fallback usage rates
- Analyze priority effectiveness
- Review cache hit rates

This centralized data structure provides a robust foundation for managing product images with consistency, performance, and maintainability.