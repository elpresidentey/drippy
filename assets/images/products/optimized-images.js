/**
 * Optimized Product Images Configuration
 * Performance-optimized image URLs with multiple format support and responsive sizing
 */

const OPTIMIZED_PRODUCT_IMAGES = {
  'classic-white': {
    // Primary optimized image (800x600px, <150KB target)
    src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    // WebP version for modern browsers
    srcWebP: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    // Responsive sizes
    srcSet: {
      small: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Classic white sneaker with premium leather upper and minimalist design',
    category: 'classic',
    colorway: 'white'
  },
  
  'night-runner': {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Black running sneaker with breathable mesh and responsive sole',
    category: 'runner',
    colorway: 'black'
  },
  
  'color-pop': {
    src: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Colorful sneaker with statement design and cushioned midsole',
    category: 'lifestyle',
    colorway: 'multicolor'
  },
  
  'retro-court': {
    src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Retro court sneaker with throwback styling and modern cushioning',
    category: 'classic',
    colorway: 'white'
  },
  
  'runner-pro': {
    src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Professional running shoe with lightweight build and energy return',
    category: 'performance',
    colorway: 'grey'
  },
  
  'minimal-slip': {
    src: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Minimalist slip-on sneaker with comfortable foam footbed',
    category: 'lifestyle',
    colorway: 'neutral'
  },
  
  'future-flex': {
    src: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Futuristic sneaker with next-generation knit upper and energy plate',
    category: 'performance',
    colorway: 'neon'
  },
  
  'street-proto': {
    src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Urban street sneaker with bounce foam and contemporary design',
    category: 'lifestyle',
    colorway: 'silver'
  },
  
  'track-alpha': {
    src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3',
    srcWebP: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=75&w=800&h=600&auto=format&fit=crop&fm=webp&ixlib=rb-4.0.3',
    srcSet: {
      small: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=75&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.0.3',
      medium: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=75&w=600&h=450&auto=format&fit=crop&ixlib=rb-4.0.3',
      large: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    alt: 'Performance track shoe with tuned midsole for daily training',
    category: 'performance',
    colorway: 'smoke'
  }
};

/**
 * Generate optimized image element with responsive srcset and WebP support
 * @param {string} productId - Product identifier
 * @param {Object} options - Configuration options
 * @returns {Object} Optimized image configuration
 */
function getOptimizedImage(productId, options = {}) {
  const config = OPTIMIZED_PRODUCT_IMAGES[productId];
  
  if (!config) {
    console.warn(`No optimized image found for product: ${productId}`);
    return getImageFallback(productId);
  }

  const {
    useWebP = true,
    responsive = true,
    loading = 'lazy',
    decoding = 'async'
  } = options;

  // Build srcset for responsive images
  const srcSet = responsive ? [
    `${config.srcSet.small} 400w`,
    `${config.srcSet.medium} 600w`, 
    `${config.srcSet.large} 800w`
  ].join(', ') : null;

  // Use WebP if supported and requested
  const imageSrc = useWebP && supportsWebP() ? config.srcWebP : config.src;

  return {
    src: imageSrc,
    srcset: srcSet,
    sizes: responsive ? '(max-width: 480px) 400px, (max-width: 768px) 600px, 800px' : null,
    alt: config.alt,
    loading,
    decoding,
    referrerpolicy: 'no-referrer',
    'data-product-id': productId,
    'data-category': config.category,
    'data-colorway': config.colorway,
    'data-optimized': 'true'
  };
}

/**
 * Check WebP support
 * @returns {boolean} True if WebP is supported
 */
function supportsWebP() {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Get fallback image configuration
 * @param {string} productId - Product identifier
 * @returns {Object} Fallback configuration
 */
function getImageFallback(productId) {
  return {
    src: 'assets/images/fallback-sneaker.svg',
    alt: `Sneaker product image for ${productId}`,
    loading: 'lazy',
    decoding: 'async',
    referrerpolicy: 'no-referrer',
    'data-product-id': productId,
    'data-fallback': 'true'
  };
}

/**
 * Preload critical images with performance optimization
 * @param {Array} productIds - Products to preload
 * @param {Object} options - Preload options
 */
function preloadOptimizedImages(productIds = [], options = {}) {
  const { format = 'webp', priority = 'high' } = options;
  
  productIds.forEach(productId => {
    const config = OPTIMIZED_PRODUCT_IMAGES[productId];
    if (!config) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = format === 'webp' && supportsWebP() ? config.srcWebP : config.src;
    
    if (priority === 'high') {
      link.fetchpriority = 'high';
    }
    
    document.head.appendChild(link);
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OPTIMIZED_PRODUCT_IMAGES,
    getOptimizedImage,
    getImageFallback,
    preloadOptimizedImages,
    supportsWebP
  };
}