/**
 * Enhanced Image Loading Manager
 * Manages loading states, error handling, and performance optimization for product images
 */

class ImageLoader {
  constructor() {
    this.loadedImages = new Set();
    this.failedImages = new Set();
    this.retryAttempts = new Map();
    this.maxRetries = 2;
    this.init();
  }

  /**
   * Initialize the image loader
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupImageLoading());
    } else {
      this.setupImageLoading();
    }
  }

  /**
   * Setup image loading for all product images
   */
  setupImageLoading() {
    const productImages = document.querySelectorAll('.card img[data-product-id]');
    
    productImages.forEach(img => {
      this.setupImageElement(img);
    });

    // Setup intersection observer for lazy loading optimization
    this.setupIntersectionObserver();
  }

  /**
   * Setup individual image element with loading states
   * @param {HTMLImageElement} img - Image element
   */
  setupImageElement(img) {
    // Add initial loading state
    img.classList.add('loading');
    
    // Set up event listeners
    img.addEventListener('load', () => this.handleImageLoad(img));
    img.addEventListener('error', () => this.handleImageError(img));
    
    // Add loading indicator if not present
    this.addLoadingIndicator(img);
    
    // Start loading timer for performance tracking
    img.dataset.loadStart = Date.now();
  }

  /**
   * Handle successful image load
   * @param {HTMLImageElement} img - Image element
   */
  handleImageLoad(img) {
    const productId = img.dataset.productId;
    
    // Remove loading state and add loaded state
    img.classList.remove('loading', 'error');
    img.classList.add('loaded');
    
    // Track successful load
    this.loadedImages.add(productId);
    
    // Remove loading indicator
    this.removeLoadingIndicator(img);
    
    // Track loading performance
    this.trackLoadingPerformance(img);
    
    // Trigger custom event
    this.dispatchImageEvent(img, 'imageLoaded');
  }

  /**
   * Handle image loading error
   * @param {HTMLImageElement} img - Image element
   */
  handleImageError(img) {
    const productId = img.dataset.productId;
    const currentAttempts = this.retryAttempts.get(productId) || 0;
    
    if (currentAttempts < this.maxRetries) {
      // Retry loading
      this.retryAttempts.set(productId, currentAttempts + 1);
      setTimeout(() => this.retryImageLoad(img), 1000 * (currentAttempts + 1));
    } else {
      // Max retries reached, show fallback
      this.showFallbackImage(img);
    }
  }

  /**
   * Retry image loading
   * @param {HTMLImageElement} img - Image element
   */
  retryImageLoad(img) {
    const originalSrc = img.src;
    img.src = '';
    setTimeout(() => {
      img.src = originalSrc;
    }, 100);
  }

  /**
   * Show fallback image
   * @param {HTMLImageElement} img - Image element
   */
  showFallbackImage(img) {
    const productId = img.dataset.productId;
    const category = img.dataset.category || 'default';
    
    // Remove loading state and add fallback state
    img.classList.remove('loading');
    img.classList.add('fallback', 'error');
    
    // Set fallback image source
    const fallbackSrc = this.getFallbackImageSrc(category);
    img.src = fallbackSrc;
    
    // Track failed load
    this.failedImages.add(productId);
    
    // Remove loading indicator
    this.removeLoadingIndicator(img);
    
    // Trigger custom event
    this.dispatchImageEvent(img, 'imageFallback');
    
    console.warn(`Image failed to load for product: ${productId}, using fallback`);
  }

  /**
   * Get fallback image source based on category
   * @param {string} category - Product category
   * @returns {string} Fallback image source
   */
  getFallbackImageSrc(category) {
    const fallbacks = {
      classic: 'assets/images/fallback-classic.svg',
      runner: 'assets/images/fallback-runner.svg',
      lifestyle: 'assets/images/fallback-lifestyle.svg',
      performance: 'assets/images/fallback-performance.svg',
      default: 'assets/images/fallback-sneaker.svg'
    };
    
    return fallbacks[category] || fallbacks.default;
  }

  /**
   * Add loading indicator to image container
   * @param {HTMLImageElement} img - Image element
   */
  addLoadingIndicator(img) {
    const container = img.closest('.card');
    if (!container || container.querySelector('.loading-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    
    // Insert after the image
    img.parentNode.insertBefore(indicator, img.nextSibling);
  }

  /**
   * Remove loading indicator
   * @param {HTMLImageElement} img - Image element
   */
  removeLoadingIndicator(img) {
    const container = img.closest('.card');
    if (!container) return;
    
    const indicator = container.querySelector('.loading-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Track loading performance
   * @param {HTMLImageElement} img - Image element
   */
  trackLoadingPerformance(img) {
    const loadStart = parseInt(img.dataset.loadStart);
    const loadTime = Date.now() - loadStart;
    const productId = img.dataset.productId;
    
    // Store performance data
    if (window.imagePerformance) {
      window.imagePerformance[productId] = loadTime;
    } else {
      window.imagePerformance = { [productId]: loadTime };
    }
    
    // Log slow loading images
    if (loadTime > 3000) {
      console.warn(`Slow image load detected: ${productId} took ${loadTime}ms`);
    }
  }

  /**
   * Setup intersection observer for advanced lazy loading
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.preloadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    // Observe images that are not in the initial viewport
    const images = document.querySelectorAll('.card img[data-product-id]');
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        observer.observe(img);
      }
    });
  }

  /**
   * Preload image for better performance
   * @param {HTMLImageElement} img - Image element
   */
  preloadImage(img) {
    if (img.complete || this.loadedImages.has(img.dataset.productId)) return;
    
    const preloader = new Image();
    preloader.onload = () => {
      img.src = preloader.src;
    };
    preloader.src = img.src;
  }

  /**
   * Dispatch custom image event
   * @param {HTMLImageElement} img - Image element
   * @param {string} eventType - Event type
   */
  dispatchImageEvent(img, eventType) {
    const event = new CustomEvent(eventType, {
      detail: {
        productId: img.dataset.productId,
        category: img.dataset.category,
        element: img
      }
    });
    
    img.dispatchEvent(event);
    document.dispatchEvent(event);
  }

  /**
   * Get loading statistics
   * @returns {Object} Loading statistics
   */
  getStats() {
    return {
      loaded: this.loadedImages.size,
      failed: this.failedImages.size,
      retries: Array.from(this.retryAttempts.values()).reduce((a, b) => a + b, 0),
      performance: window.imagePerformance || {}
    };
  }
}

// Initialize image loader when script loads
const imageLoader = new ImageLoader();

// Export for global access
window.ImageLoader = ImageLoader;
window.imageLoader = imageLoader;

// Add utility functions to global scope
window.getImageStats = () => imageLoader.getStats();