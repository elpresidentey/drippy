/**
 * Image Optimizer Utility
 * Simple utility for implementing optimized images in HTML
 */

class ImageOptimizer {
  constructor() {
    this.webpSupport = this.detectWebPSupport();
    this.images = this.loadImageConfig();
  }

  /**
   * Detect WebP support
   * @returns {boolean}
   */
  detectWebPSupport() {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Load optimized image configuration
   * @returns {Object}
   */
  loadImageConfig() {
    return {
      'classic-white': {
        base: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        alt: 'Classic white sneaker with premium leather upper and minimalist design'
      },
      'night-runner': {
        base: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        alt: 'Black running sneaker with breathable mesh and responsive sole'
      },
      'color-pop': {
        base: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
        alt: 'Colorful sneaker with statement design and cushioned midsole'
      },
      'retro-court': {
        base: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
        alt: 'Retro court sneaker with throwback styling and modern cushioning'
      },
      'runner-pro': {
        base: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
        alt: 'Professional running shoe with lightweight build and energy return'
      },
      'minimal-slip': {
        base: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
        alt: 'Minimalist slip-on sneaker with comfortable foam footbed'
      },
      'future-flex': {
        base: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
        alt: 'Futuristic sneaker with next-generation knit upper and energy plate'
      },
      'street-proto': {
        base: 'https://images.unsplash.com/photo-1552346154-21d32810aba3',
        alt: 'Urban street sneaker with bounce foam and contemporary design'
      },
      'track-alpha': {
        base: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
        alt: 'Performance track shoe with tuned midsole for daily training'
      }
    };
  }

  /**
   * Generate optimized image URL
   * @param {string} productId - Product identifier
   * @param {Object} options - Image options
   * @returns {string} Optimized image URL
   */
  getImageUrl(productId, options = {}) {
    const config = this.images[productId];
    if (!config) return null;

    const {
      width = 800,
      height = 600,
      quality = 75,
      format = this.webpSupport ? 'webp' : 'jpg'
    } = options;

    const params = new URLSearchParams({
      q: quality,
      w: width,
      h: height,
      auto: 'format',
      fit: 'crop',
      ixlib: 'rb-4.0.3'
    });

    if (format === 'webp') {
      params.set('fm', 'webp');
    }

    return `${config.base}?${params.toString()}`;
  }

  /**
   * Generate responsive srcset
   * @param {string} productId - Product identifier
   * @returns {string} Srcset string
   */
  getSrcSet(productId) {
    const sizes = [
      { width: 400, height: 300, descriptor: '400w' },
      { width: 600, height: 450, descriptor: '600w' },
      { width: 800, height: 600, descriptor: '800w' }
    ];

    return sizes.map(size => {
      const url = this.getImageUrl(productId, {
        width: size.width,
        height: size.height
      });
      return `${url} ${size.descriptor}`;
    }).join(', ');
  }

  /**
   * Get complete image attributes
   * @param {string} productId - Product identifier
   * @returns {Object} Image attributes
   */
  getImageAttributes(productId) {
    const config = this.images[productId];
    if (!config) return null;

    return {
      src: this.getImageUrl(productId),
      srcset: this.getSrcSet(productId),
      sizes: '(max-width: 480px) 400px, (max-width: 768px) 600px, 800px',
      alt: config.alt,
      loading: 'lazy',
      decoding: 'async',
      referrerpolicy: 'no-referrer',
      'data-product-id': productId,
      'data-optimized': 'true'
    };
  }

  /**
   * Update existing image element
   * @param {HTMLImageElement} imgElement - Image element to update
   * @param {string} productId - Product identifier
   */
  updateImageElement(imgElement, productId) {
    const attributes = this.getImageAttributes(productId);
    if (!attributes) return;

    Object.entries(attributes).forEach(([key, value]) => {
      imgElement.setAttribute(key, value);
    });
  }

  /**
   * Update all product images on page
   */
  updateAllImages() {
    const productImages = document.querySelectorAll('[data-product-id]');
    
    productImages.forEach(img => {
      const productId = img.getAttribute('data-product-id');
      if (productId && this.images[productId]) {
        this.updateImageElement(img, productId);
      }
    });
  }

  /**
   * Preload critical images
   * @param {Array} productIds - Products to preload
   */
  preloadImages(productIds = []) {
    productIds.forEach(productId => {
      const url = this.getImageUrl(productId, { width: 800, height: 600 });
      if (url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }
}

// Initialize optimizer when DOM is ready
if (typeof window !== 'undefined') {
  window.imageOptimizer = new ImageOptimizer();
  
  // Auto-update images when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.imageOptimizer.updateAllImages();
    });
  } else {
    window.imageOptimizer.updateAllImages();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}