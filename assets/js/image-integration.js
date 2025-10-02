/**
 * Image Integration Helper
 * Provides utilities to integrate the image management system with existing HTML
 */

/**
 * Initialize image management system
 * Should be called after DOM is loaded and image-manager.js is available
 */
function initializeImageSystem() {
  if (typeof window.ImageManager === 'undefined') {
    console.error('ImageManager not found. Make sure image-manager.js is loaded first.');
    return false;
  }
  
  // Validate image configuration
  const validation = window.ImageManager.validateImageConfig();
  if (!validation.valid) {
    console.error('Image configuration validation failed:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Image configuration warnings:', validation.warnings);
  }
  
  // Preload critical images (first few products)
  const criticalProducts = ['classic-white', 'night-runner', 'color-pop'];
  window.ImageManager.preloadProductImages(criticalProducts);
  
  console.log('Image management system initialized successfully');
  return true;
}

/**
 * Update a single product card image
 * @param {HTMLElement} cardElement - The card element containing the image
 * @param {string} productId - Product identifier
 */
function updateCardImage(cardElement, productId) {
  const imgElement = cardElement.querySelector('img');
  if (!imgElement) {
    console.warn('No image element found in card');
    return;
  }
  
  const imageConfig = window.ImageManager.getProductImage(productId);
  
  // Update image attributes
  imgElement.src = imageConfig.src;
  imgElement.alt = imageConfig.alt;
  imgElement.setAttribute('data-product-id', imageConfig['data-product-id']);
  imgElement.setAttribute('data-category', imageConfig['data-category']);
  imgElement.setAttribute('data-colorway', imageConfig['data-colorway']);
  
  // Add loading state management
  imgElement.classList.add('loading');
  
  imgElement.onload = function() {
    this.classList.remove('loading');
    this.classList.add('loaded');
  };
  
  imgElement.onerror = function() {
    console.warn(`Failed to load image for product: ${productId}`);
    const fallbackConfig = window.ImageManager.getCategoryFallback(imageConfig['data-category']);
    this.src = fallbackConfig.src;
    this.alt = fallbackConfig.alt;
    this.classList.remove('loading');
    this.classList.add('fallback');
  };
}

/**
 * Update all product cards in a section
 * @param {string} sectionSelector - CSS selector for the section
 * @param {Array} productMapping - Array of objects with {cardIndex, productId}
 */
function updateSectionImages(sectionSelector, productMapping) {
  const section = document.querySelector(sectionSelector);
  if (!section) {
    console.warn(`Section not found: ${sectionSelector}`);
    return;
  }
  
  const cards = section.querySelectorAll('.card');
  
  productMapping.forEach(mapping => {
    if (mapping.cardIndex < cards.length) {
      updateCardImage(cards[mapping.cardIndex], mapping.productId);
    }
  });
}

/**
 * Get product mapping for different sections
 * This maps the current card positions to product IDs
 */
function getProductMappings() {
  return {
    hottest: [
      { cardIndex: 0, productId: 'classic-white' },
      { cardIndex: 1, productId: 'night-runner' },
      { cardIndex: 2, productId: 'color-pop' }
    ],
    trending: [
      { cardIndex: 0, productId: 'retro-court' },
      { cardIndex: 1, productId: 'runner-pro' },
      { cardIndex: 2, productId: 'minimal-slip' }
    ],
    upcoming: [
      { cardIndex: 0, productId: 'future-flex' },
      { cardIndex: 1, productId: 'street-proto' },
      { cardIndex: 2, productId: 'track-alpha' }
    ],
    shop: [
      { cardIndex: 0, productId: 'classic-white' },
      { cardIndex: 1, productId: 'night-runner' },
      { cardIndex: 2, productId: 'color-pop' },
      { cardIndex: 3, productId: 'retro-court' },
      { cardIndex: 4, productId: 'runner-pro' }
    ]
  };
}

/**
 * Apply new image system to all product sections
 * This function will replace all Unsplash images with the new system
 */
function applyNewImageSystem() {
  if (!initializeImageSystem()) {
    return;
  }
  
  const mappings = getProductMappings();
  
  // Update each section
  updateSectionImages('#hottest', mappings.hottest);
  updateSectionImages('#trending', mappings.trending);
  updateSectionImages('#upcoming', mappings.upcoming);
  updateSectionImages('#shop', mappings.shop);
  
  console.log('New image system applied to all sections');
}

/**
 * Create a test function to verify image loading
 */
function testImageSystem() {
  console.log('Testing image system...');
  
  // Test each product image configuration
  Object.keys(window.ImageManager.PRODUCT_IMAGES).forEach(productId => {
    const config = window.ImageManager.getProductImage(productId);
    console.log(`Product ${productId}:`, config);
  });
  
  // Test fallback system
  const fallback = window.ImageManager.getDefaultFallback();
  console.log('Default fallback:', fallback);
  
  // Test category fallbacks
  ['classic', 'runner', 'lifestyle', 'performance'].forEach(category => {
    const categoryFallback = window.ImageManager.getCategoryFallback(category);
    console.log(`${category} fallback:`, categoryFallback);
  });
}

// Export functions for use
if (typeof window !== 'undefined') {
  window.ImageIntegration = {
    initializeImageSystem,
    updateCardImage,
    updateSectionImages,
    getProductMappings,
    applyNewImageSystem,
    testImageSystem
  };
}

// Auto-initialize when DOM is ready (if not already initialized)
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Wait a bit for other scripts to load
      setTimeout(() => {
        if (typeof window.ImageManager !== 'undefined') {
          initializeImageSystem();
        }
      }, 100);
    });
  } else if (typeof window.ImageManager !== 'undefined') {
    initializeImageSystem();
  }
}