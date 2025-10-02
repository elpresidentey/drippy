/**
 * Centralized Product Image Configuration
 * Version: 1.0.0
 * 
 * This configuration object provides centralized management of all product images
 * with versioning support for cache management and easy maintenance.
 */

const IMAGE_CONFIG = {
  // Configuration metadata
  version: '1.0.0',
  lastUpdated: '2024-12-09',
  baseUrl: 'https://images.unsplash.com',
  
  // Default image parameters
  defaults: {
    quality: 75,
    format: 'auto',
    fit: 'crop',
    library: 'rb-4.0.3',
    loading: 'lazy',
    decoding: 'async',
    referrerpolicy: 'no-referrer'
  },

  // Responsive breakpoints
  breakpoints: {
    small: { width: 400, height: 300, descriptor: '400w' },
    medium: { width: 600, height: 450, descriptor: '600w' },
    large: { width: 800, height: 600, descriptor: '800w' }
  },

  // Product image mappings
  products: {
    'classic-white': {
      id: 'classic-white',
      unsplashId: 'photo-1549298916-b41d501d3772',
      alt: 'Classic white sneaker with premium leather upper and minimalist design',
      category: 'classic',
      colorway: 'white',
      fallbackText: 'White classic sneaker',
      priority: 'high', // Above-the-fold image
      tags: ['classic', 'white', 'leather', 'minimal']
    },

    'night-runner': {
      id: 'night-runner',
      unsplashId: 'photo-1542291026-7eec264c27ff',
      alt: 'Black running sneaker with breathable mesh and responsive sole',
      category: 'runner',
      colorway: 'black',
      fallbackText: 'Black running shoe',
      priority: 'high', // Above-the-fold image
      tags: ['running', 'black', 'mesh', 'performance']
    },

    'color-pop': {
      id: 'color-pop',
      unsplashId: 'photo-1560769629-975ec94e6a86',
      alt: 'Colorful sneaker with statement design and cushioned midsole',
      category: 'lifestyle',
      colorway: 'multicolor',
      fallbackText: 'Colorful lifestyle sneaker',
      priority: 'high', // Above-the-fold image
      tags: ['lifestyle', 'colorful', 'statement', 'comfort']
    },

    'retro-court': {
      id: 'retro-court',
      unsplashId: 'photo-1595950653106-6c9ebd614d3a',
      alt: 'Retro court sneaker with throwback styling and modern cushioning',
      category: 'classic',
      colorway: 'white',
      fallbackText: 'Retro court shoe',
      priority: 'medium',
      tags: ['retro', 'court', 'classic', 'vintage']
    },

    'runner-pro': {
      id: 'runner-pro',
      unsplashId: 'photo-1606107557195-0e29a4b5b4aa',
      alt: 'Professional running shoe with lightweight build and energy return',
      category: 'performance',
      colorway: 'grey',
      fallbackText: 'Professional running shoe',
      priority: 'medium',
      tags: ['performance', 'running', 'professional', 'lightweight']
    },

    'minimal-slip': {
      id: 'minimal-slip',
      unsplashId: 'photo-1525966222134-fcfa99b8ae77',
      alt: 'Minimalist slip-on sneaker with comfortable foam footbed',
      category: 'lifestyle',
      colorway: 'neutral',
      fallbackText: 'Minimalist slip-on',
      priority: 'medium',
      tags: ['lifestyle', 'slip-on', 'minimal', 'comfort']
    },

    'future-flex': {
      id: 'future-flex',
      unsplashId: 'photo-1551107696-a4b0c5a0d9a2',
      alt: 'Futuristic sneaker with next-generation knit upper and energy plate',
      category: 'performance',
      colorway: 'neon',
      fallbackText: 'Futuristic performance sneaker',
      priority: 'low',
      tags: ['futuristic', 'performance', 'knit', 'energy']
    },

    'street-proto': {
      id: 'street-proto',
      unsplashId: 'photo-1552346154-21d32810aba3',
      alt: 'Urban street sneaker with bounce foam and contemporary design',
      category: 'lifestyle',
      colorway: 'silver',
      fallbackText: 'Urban street sneaker',
      priority: 'low',
      tags: ['street', 'urban', 'contemporary', 'bounce']
    },

    'track-alpha': {
      id: 'track-alpha',
      unsplashId: 'photo-1600185365483-26d7a4cc7519',
      alt: 'Performance track shoe with tuned midsole for daily training',
      category: 'performance',
      colorway: 'smoke',
      fallbackText: 'Performance track shoe',
      priority: 'low',
      tags: ['track', 'performance', 'training', 'tuned']
    }
  },

  // Fallback configurations by category
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

/**
 * Get product configuration by ID
 * @param {string} productId - Product identifier
 * @returns {Object|null} Product configuration or null if not found
 */
function getProductConfig(productId) {
  return IMAGE_CONFIG.products[productId] || null;
}

/**
 * Get all products by category
 * @param {string} category - Product category
 * @returns {Array} Array of product configurations
 */
function getProductsByCategory(category) {
  return Object.values(IMAGE_CONFIG.products)
    .filter(product => product.category === category);
}

/**
 * Get high priority products for preloading
 * @returns {Array} Array of high priority product IDs
 */
function getHighPriorityProducts() {
  return Object.values(IMAGE_CONFIG.products)
    .filter(product => product.priority === 'high')
    .map(product => product.id);
}

/**
 * Build optimized image URL
 * @param {string} productId - Product identifier
 * @param {Object} options - Image options
 * @returns {string|null} Optimized image URL or null
 */
function buildImageUrl(productId, options = {}) {
  const product = getProductConfig(productId);
  if (!product) return null;

  const {
    width = IMAGE_CONFIG.breakpoints.large.width,
    height = IMAGE_CONFIG.breakpoints.large.height,
    quality = IMAGE_CONFIG.defaults.quality,
    format = IMAGE_CONFIG.defaults.format
  } = options;

  const params = new URLSearchParams({
    q: quality,
    w: width,
    h: height,
    auto: format,
    fit: IMAGE_CONFIG.defaults.fit,
    ixlib: IMAGE_CONFIG.defaults.library
  });

  // Add WebP format if specifically requested
  if (format === 'webp') {
    params.set('fm', 'webp');
  }

  return `${IMAGE_CONFIG.baseUrl}/${product.unsplashId}?${params.toString()}`;
}

/**
 * Build responsive srcset string
 * @param {string} productId - Product identifier
 * @param {Object} options - Format options
 * @returns {string|null} Srcset string or null
 */
function buildSrcSet(productId, options = {}) {
  const product = getProductConfig(productId);
  if (!product) return null;

  const { format = IMAGE_CONFIG.defaults.format } = options;

  return Object.values(IMAGE_CONFIG.breakpoints)
    .map(breakpoint => {
      const url = buildImageUrl(productId, {
        width: breakpoint.width,
        height: breakpoint.height,
        format
      });
      return `${url} ${breakpoint.descriptor}`;
    })
    .join(', ');
}

/**
 * Get fallback image path
 * @param {string} productId - Product identifier
 * @returns {string} Fallback image path
 */
function getFallbackImage(productId) {
  const product = getProductConfig(productId);
  
  if (product && IMAGE_CONFIG.fallbacks.byCategory[product.category]) {
    return IMAGE_CONFIG.fallbacks.byCategory[product.category];
  }
  
  return IMAGE_CONFIG.fallbacks.default;
}

/**
 * Get complete image attributes object
 * @param {string} productId - Product identifier
 * @param {Object} options - Configuration options
 * @returns {Object|null} Complete image attributes or null
 */
function getImageAttributes(productId, options = {}) {
  const product = getProductConfig(productId);
  if (!product) return null;

  const {
    responsive = true,
    webp = false,
    loading = IMAGE_CONFIG.defaults.loading,
    decoding = IMAGE_CONFIG.defaults.decoding
  } = options;

  const format = webp ? 'webp' : IMAGE_CONFIG.defaults.format;
  
  const attributes = {
    src: buildImageUrl(productId, { format }),
    alt: product.alt,
    loading,
    decoding,
    referrerpolicy: IMAGE_CONFIG.defaults.referrerpolicy,
    'data-product-id': productId,
    'data-category': product.category,
    'data-colorway': product.colorway,
    'data-version': IMAGE_CONFIG.version
  };

  // Add responsive attributes if requested
  if (responsive) {
    attributes.srcset = buildSrcSet(productId, { format });
    attributes.sizes = '(max-width: 480px) 400px, (max-width: 768px) 600px, 800px';
  }

  return attributes;
}

/**
 * Validate configuration integrity
 * @returns {Object} Validation results
 */
function validateConfig() {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    productCount: Object.keys(IMAGE_CONFIG.products).length
  };

  // Check for required fields
  Object.entries(IMAGE_CONFIG.products).forEach(([id, product]) => {
    if (!product.unsplashId) {
      results.errors.push(`Product ${id} missing unsplashId`);
      results.valid = false;
    }
    if (!product.alt) {
      results.errors.push(`Product ${id} missing alt text`);
      results.valid = false;
    }
    if (!product.category) {
      results.warnings.push(`Product ${id} missing category`);
    }
  });

  return results;
}

// Export configuration and utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IMAGE_CONFIG,
    getProductConfig,
    getProductsByCategory,
    getHighPriorityProducts,
    buildImageUrl,
    buildSrcSet,
    getFallbackImage,
    getImageAttributes,
    validateConfig
  };
}

// Global access for browser usage
if (typeof window !== 'undefined') {
  window.ImageConfig = {
    IMAGE_CONFIG,
    getProductConfig,
    getProductsByCategory,
    getHighPriorityProducts,
    buildImageUrl,
    buildSrcSet,
    getFallbackImage,
    getImageAttributes,
    validateConfig
  };
}