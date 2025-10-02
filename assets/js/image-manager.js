/**
 * Centralized Image Management System for Dripz & Kix
 * Handles product image configuration, fallbacks, and utility functions
 */

// Version for cache busting and system updates
const IMAGE_SYSTEM_VERSION = '1.0.0';

// Base configuration for image system
const IMAGE_CONFIG = {
  version: IMAGE_SYSTEM_VERSION,
  baseUrl: 'assets/images/products/',
  fallbacks: {
    default: 'assets/images/fallback-sneaker.svg',
    byCategory: {
      classic: 'assets/images/fallback-classic.svg',
      runner: 'assets/images/fallback-runner.svg',
      lifestyle: 'assets/images/fallback-lifestyle.svg',
      performance: 'assets/images/fallback-performance.svg'
    }
  }
};

// Product image configuration mapping
const PRODUCT_IMAGES = {
  'classic-white': {
    id: 'classic-white',
    src: 'classic-white-sneaker.svg',
    alt: 'Classic white sneaker with premium leather upper and minimalist design',
    category: 'classic',
    colorway: 'white',
    fallbackText: 'White classic sneaker',
    width: 800,
    height: 600
  },
  'night-runner': {
    id: 'night-runner',
    src: 'night-runner-sneaker.svg',
    alt: 'Black running sneaker with breathable mesh and responsive sole',
    category: 'runner',
    colorway: 'black',
    fallbackText: 'Black runner',
    width: 800,
    height: 600
  },
  'color-pop': {
    id: 'color-pop',
    src: 'color-pop-sneaker.svg',
    alt: 'Colorful sneaker with statement design and cushioned midsole',
    category: 'lifestyle',
    colorway: 'multicolor',
    fallbackText: 'Color pop sneaker',
    width: 800,
    height: 600
  },
  'retro-court': {
    id: 'retro-court',
    src: 'retro-court-sneaker.svg',
    alt: 'Retro court sneaker with throwback styling and modern cushioning',
    category: 'classic',
    colorway: 'white',
    fallbackText: 'Retro court sneaker',
    width: 800,
    height: 600
  },
  'runner-pro': {
    id: 'runner-pro',
    src: 'runner-pro-sneaker.svg',
    alt: 'Professional running shoe with lightweight build and energy return',
    category: 'performance',
    colorway: 'grey',
    fallbackText: 'Runner Pro in graphite grey',
    width: 800,
    height: 600
  },
  'minimal-slip': {
    id: 'minimal-slip',
    src: 'minimal-slip-sneaker.svg',
    alt: 'Minimalist slip-on sneaker with comfortable foam footbed',
    category: 'lifestyle',
    colorway: 'neutral',
    fallbackText: 'Minimalist slip-on',
    width: 800,
    height: 600
  },
  'future-flex': {
    id: 'future-flex',
    src: 'future-flex-sneaker.svg',
    alt: 'Futuristic sneaker with next-generation knit upper and energy plate',
    category: 'performance',
    colorway: 'neon',
    fallbackText: 'Futuristic sneaker',
    width: 800,
    height: 600
  },
  'street-proto': {
    id: 'street-proto',
    src: 'street-proto-sneaker.svg',
    alt: 'Urban street sneaker with bounce foam and contemporary design',
    category: 'lifestyle',
    colorway: 'silver',
    fallbackText: 'Concept street sneaker',
    width: 800,
    height: 600
  },
  'track-alpha': {
    id: 'track-alpha',
    src: 'track-alpha-sneaker.svg',
    alt: 'Performance track shoe with tuned midsole for daily training',
    category: 'performance',
    colorway: 'smoke',
    fallbackText: 'Performance runner concept',
    width: 800,
    height: 600
  }
};

/**
 * Get product image configuration with fallback handling
 * @param {string} productId - Unique product identifier
 * @param {Object} options - Additional options for image loading
 * @returns {Object} Image configuration object
 */
function getProductImage(productId, options = {}) {
  const config = PRODUCT_IMAGES[productId];
  
  if (!config) {
    console.warn(`Product image not found for ID: ${productId}`);
    return getDefaultFallback(options);
  }
  
  return {
    src: IMAGE_CONFIG.baseUrl + config.src,
    alt: config.alt,
    loading: options.loading || 'lazy',
    decoding: options.decoding || 'async',
    referrerpolicy: options.referrerpolicy || 'no-referrer',
    'data-product-id': config.id,
    'data-category': config.category,
    'data-colorway': config.colorway,
    width: config.width,
    height: config.height,
    fallbackText: config.fallbackText
  };
}

/**
 * Get default fallback configuration
 * @param {Object} options - Additional options
 * @returns {Object} Fallback image configuration
 */
function getDefaultFallback(options = {}) {
  return {
    src: IMAGE_CONFIG.fallbacks.default,
    alt: 'Product image unavailable',
    loading: options.loading || 'lazy',
    decoding: options.decoding || 'async',
    referrerpolicy: options.referrerpolicy || 'no-referrer',
    'data-fallback': 'true',
    fallbackText: 'Product image'
  };
}

/**
 * Get category-specific fallback
 * @param {string} category - Product category
 * @param {Object} options - Additional options
 * @returns {Object} Category fallback configuration
 */
function getCategoryFallback(category, options = {}) {
  const fallbackSrc = IMAGE_CONFIG.fallbacks.byCategory[category] || IMAGE_CONFIG.fallbacks.default;
  
  return {
    src: fallbackSrc,
    alt: `${category} sneaker image unavailable`,
    loading: options.loading || 'lazy',
    decoding: options.decoding || 'async',
    referrerpolicy: options.referrerpolicy || 'no-referrer',
    'data-fallback': 'true',
    'data-category': category,
    fallbackText: `${category} sneaker`
  };
}

/**
 * Preload critical product images for performance
 * @param {Array} productIds - Array of product IDs to preload
 */
function preloadProductImages(productIds = []) {
  productIds.forEach(productId => {
    const config = PRODUCT_IMAGES[productId];
    if (config) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = IMAGE_CONFIG.baseUrl + config.src;
      document.head.appendChild(link);
    }
  });
}

/**
 * Get all product IDs for a specific category
 * @param {string} category - Product category to filter by
 * @returns {Array} Array of product IDs in the category
 */
function getProductsByCategory(category) {
  return Object.keys(PRODUCT_IMAGES).filter(
    productId => PRODUCT_IMAGES[productId].category === category
  );
}

/**
 * Validate image configuration integrity
 * @returns {Object} Validation results
 */
function validateImageConfig() {
  const results = {
    valid: true,
    errors: [],
    warnings: []
  };
  
  Object.entries(PRODUCT_IMAGES).forEach(([productId, config]) => {
    // Check required fields
    if (!config.src) {
      results.errors.push(`Missing src for product: ${productId}`);
      results.valid = false;
    }
    
    if (!config.alt) {
      results.errors.push(`Missing alt text for product: ${productId}`);
      results.valid = false;
    }
    
    if (!config.category) {
      results.warnings.push(`Missing category for product: ${productId}`);
    }
    
    // Check ID consistency
    if (config.id !== productId) {
      results.warnings.push(`ID mismatch for product: ${productId}`);
    }
  });
  
  return results;
}

/**
 * Generate optimized image URL with parameters
 * @param {string} productId - Product identifier
 * @param {Object} params - URL parameters (width, height, quality, format)
 * @returns {string} Optimized image URL
 */
function getOptimizedImageUrl(productId, params = {}) {
  const config = PRODUCT_IMAGES[productId];
  if (!config) return null;
  
  let url = IMAGE_CONFIG.baseUrl + config.src;
  
  // Add version for cache busting
  const urlParams = new URLSearchParams();
  urlParams.set('v', IMAGE_CONFIG.version);
  
  // Add optimization parameters if provided
  if (params.width) urlParams.set('w', params.width);
  if (params.height) urlParams.set('h', params.height);
  if (params.quality) urlParams.set('q', params.quality);
  if (params.format) urlParams.set('f', params.format);
  
  return `${url}?${urlParams.toString()}`;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IMAGE_CONFIG,
    PRODUCT_IMAGES,
    getProductImage,
    getDefaultFallback,
    getCategoryFallback,
    preloadProductImages,
    getProductsByCategory,
    validateImageConfig,
    getOptimizedImageUrl
  };
}

// Global availability for browser usage
if (typeof window !== 'undefined') {
  window.ImageManager = {
    IMAGE_CONFIG,
    PRODUCT_IMAGES,
    getProductImage,
    getDefaultFallback,
    getCategoryFallback,
    preloadProductImages,
    getProductsByCategory,
    validateImageConfig,
    getOptimizedImageUrl
  };
}