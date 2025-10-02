/**
 * Product Image Configuration
 * Centralized mapping of product IDs to high-quality sneaker images
 * All images sourced from Unsplash with consistent styling and optimization
 */

const PRODUCT_IMAGES = {
  'classic-white': {
    src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Classic white sneaker with premium leather upper and minimalist design',
    category: 'classic',
    colorway: 'white',
    fallback: 'White classic sneaker'
  },
  
  'night-runner': {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Black running sneaker with breathable mesh and responsive sole',
    category: 'runner', 
    colorway: 'black',
    fallback: 'Black running shoe'
  },
  
  'color-pop': {
    src: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Colorful sneaker with statement design and cushioned midsole',
    category: 'lifestyle',
    colorway: 'multicolor', 
    fallback: 'Colorful lifestyle sneaker'
  },
  
  'retro-court': {
    src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Retro court sneaker with throwback styling and modern cushioning',
    category: 'classic',
    colorway: 'white',
    fallback: 'Retro court shoe'
  },
  
  'runner-pro': {
    src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Professional running shoe with lightweight build and energy return',
    category: 'performance',
    colorway: 'grey',
    fallback: 'Professional running shoe'
  },
  
  'minimal-slip': {
    src: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Minimalist slip-on sneaker with comfortable foam footbed',
    category: 'lifestyle',
    colorway: 'neutral',
    fallback: 'Minimalist slip-on'
  },
  
  'future-flex': {
    src: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Futuristic sneaker with next-generation knit upper and energy plate',
    category: 'performance',
    colorway: 'neon',
    fallback: 'Futuristic performance sneaker'
  },
  
  'street-proto': {
    src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Urban street sneaker with bounce foam and contemporary design',
    category: 'lifestyle',
    colorway: 'silver',
    fallback: 'Urban street sneaker'
  },
  
  'track-alpha': {
    src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Performance track shoe with tuned midsole for daily training',
    category: 'performance',
    colorway: 'smoke',
    fallback: 'Performance track shoe'
  }
};

/**
 * Get product image configuration
 * @param {string} productId - The product identifier
 * @param {Object} options - Additional options for image loading
 * @returns {Object} Image configuration object
 */
function getProductImage(productId, options = {}) {
  const config = PRODUCT_IMAGES[productId];
  
  if (!config) {
    console.warn(`No image configuration found for product: ${productId}`);
    return getDefaultFallback(productId);
  }
  
  return {
    src: config.src,
    alt: config.alt,
    loading: options.loading || 'lazy',
    decoding: options.decoding || 'async',
    referrerpolicy: 'no-referrer',
    'data-product-id': productId,
    'data-category': config.category,
    'data-colorway': config.colorway
  };
}

/**
 * Get default fallback configuration
 * @param {string} productId - The product identifier
 * @returns {Object} Fallback configuration
 */
function getDefaultFallback(productId) {
  return {
    src: `assets/images/fallback-sneaker.svg`,
    alt: `Sneaker product image for ${productId}`,
    loading: 'lazy',
    decoding: 'async',
    referrerpolicy: 'no-referrer',
    'data-product-id': productId,
    'data-fallback': 'true'
  };
}

/**
 * Preload critical product images
 * @param {Array} productIds - Array of product IDs to preload
 */
function preloadProductImages(productIds = []) {
  productIds.forEach(productId => {
    const config = PRODUCT_IMAGES[productId];
    if (config) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.src;
      document.head.appendChild(link);
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCT_IMAGES,
    getProductImage,
    getDefaultFallback,
    preloadProductImages
  };
}