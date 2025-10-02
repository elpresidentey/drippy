/**
 * Image System Test Suite
 * Comprehensive testing for the Dripz & Kix image management system
 */

class ImageSystemTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  /**
   * Run all image system tests
   */
  async runAllTests() {
    console.log('🧪 Starting Image System Test Suite...');
    
    // Core system tests
    this.testImageManagerAvailability();
    this.testProductImageConfigurations();
    this.testFallbackSystem();
    this.testUtilityFunctions();
    
    // DOM integration tests
    this.testHTMLIntegration();
    this.testImageAttributes();
    this.testLoadingStates();
    
    // Performance tests
    await this.testImageLoading();
    this.testLazyLoading();
    
    // Accessibility tests
    this.testAccessibility();
    
    // Cross-browser compatibility
    this.testBrowserCompatibility();
    
    this.displayResults();
    return this.testResults;
  }

  /**
   * Test if ImageManager is properly loaded and available
   */
  testImageManagerAvailability() {
    const testName = 'ImageManager Availability';
    
    try {
      if (typeof window.ImageManager === 'undefined') {
        this.addTest(testName, false, 'ImageManager not found in global scope');
        return;
      }
      
      const requiredMethods = [
        'getProductImage',
        'getDefaultFallback', 
        'getCategoryFallback',
        'preloadProductImages',
        'validateImageConfig'
      ];
      
      for (const method of requiredMethods) {
        if (typeof window.ImageManager[method] !== 'function') {
          this.addTest(testName, false, `Missing method: ${method}`);
          return;
        }
      }
      
      this.addTest(testName, true, 'All required methods available');
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test product image configurations
   */
  testProductImageConfigurations() {
    const testName = 'Product Image Configurations';
    
    try {
      const expectedProducts = [
        'classic-white', 'night-runner', 'color-pop',
        'retro-court', 'runner-pro', 'minimal-slip',
        'future-flex', 'street-proto', 'track-alpha'
      ];
      
      const availableProducts = Object.keys(window.ImageManager.PRODUCT_IMAGES);
      
      // Check if all expected products are configured
      const missingProducts = expectedProducts.filter(id => !availableProducts.includes(id));
      if (missingProducts.length > 0) {
        this.addTest(testName, false, `Missing products: ${missingProducts.join(', ')}`);
        return;
      }
      
      // Validate each product configuration
      for (const productId of expectedProducts) {
        const config = window.ImageManager.PRODUCT_IMAGES[productId];
        
        if (!config.src) {
          this.addTest(testName, false, `Missing src for ${productId}`);
          return;
        }
        
        if (!config.alt) {
          this.addTest(testName, false, `Missing alt text for ${productId}`);
          return;
        }
        
        if (!config.category) {
          this.addWarning(testName, `Missing category for ${productId}`);
        }
      }
      
      this.addTest(testName, true, `All ${expectedProducts.length} products properly configured`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test fallback system functionality
   */
  testFallbackSystem() {
    const testName = 'Fallback System';
    
    try {
      // Test default fallback
      const defaultFallback = window.ImageManager.getDefaultFallback();
      if (!defaultFallback.src || !defaultFallback.alt) {
        this.addTest(testName, false, 'Default fallback missing required properties');
        return;
      }
      
      // Test category fallbacks
      const categories = ['classic', 'runner', 'lifestyle', 'performance'];
      for (const category of categories) {
        const categoryFallback = window.ImageManager.getCategoryFallback(category);
        if (!categoryFallback.src || !categoryFallback.alt) {
          this.addTest(testName, false, `Category fallback for ${category} missing properties`);
          return;
        }
      }
      
      // Test invalid product ID fallback
      const invalidProduct = window.ImageManager.getProductImage('non-existent-product');
      if (!invalidProduct.src) {
        this.addTest(testName, false, 'Invalid product ID should return fallback');
        return;
      }
      
      this.addTest(testName, true, 'All fallback mechanisms working correctly');
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test utility functions
   */
  testUtilityFunctions() {
    const testName = 'Utility Functions';
    
    try {
      // Test configuration validation
      const validation = window.ImageManager.validateImageConfig();
      if (!validation.hasOwnProperty('valid')) {
        this.addTest(testName, false, 'validateImageConfig should return validation object');
        return;
      }
      
      // Test product filtering by category
      const classicProducts = window.ImageManager.getProductsByCategory('classic');
      if (!Array.isArray(classicProducts)) {
        this.addTest(testName, false, 'getProductsByCategory should return array');
        return;
      }
      
      // Test optimized URL generation
      const optimizedUrl = window.ImageManager.getOptimizedImageUrl('classic-white', { width: 400 });
      if (!optimizedUrl || typeof optimizedUrl !== 'string') {
        this.addTest(testName, false, 'getOptimizedImageUrl should return string URL');
        return;
      }
      
      this.addTest(testName, true, 'All utility functions working correctly');
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test HTML integration
   */
  testHTMLIntegration() {
    const testName = 'HTML Integration';
    
    try {
      // Check if product cards exist
      const productCards = document.querySelectorAll('.card[data-product]');
      if (productCards.length === 0) {
        this.addTest(testName, false, 'No product cards with data-product attributes found');
        return;
      }
      
      // Check if images have proper attributes
      let validCards = 0;
      productCards.forEach(card => {
        const img = card.querySelector('img');
        if (img && img.dataset.productId && img.dataset.category) {
          validCards++;
        }
      });
      
      if (validCards === 0) {
        this.addTest(testName, false, 'No cards have properly configured images');
        return;
      }
      
      this.addTest(testName, true, `${validCards} cards properly integrated with image system`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test image attributes
   */
  testImageAttributes() {
    const testName = 'Image Attributes';
    
    try {
      const images = document.querySelectorAll('.card img[data-product-id]');
      let validImages = 0;
      
      images.forEach(img => {
        const requiredAttrs = ['loading', 'decoding', 'referrerpolicy', 'alt'];
        const hasAllAttrs = requiredAttrs.every(attr => img.hasAttribute(attr));
        
        if (hasAllAttrs) {
          validImages++;
        }
      });
      
      if (validImages === 0) {
        this.addTest(testName, false, 'No images have all required attributes');
        return;
      }
      
      this.addTest(testName, true, `${validImages} images have proper attributes`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test loading states
   */
  testLoadingStates() {
    const testName = 'Loading States';
    
    try {
      // Check if CSS classes are defined
      const testElement = document.createElement('img');
      testElement.className = 'loading loaded fallback';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const hasLoadingStyles = computedStyle.opacity !== '' || computedStyle.animation !== '';
      
      document.body.removeChild(testElement);
      
      if (!hasLoadingStyles) {
        this.addWarning(testName, 'Loading state styles may not be properly defined');
      }
      
      this.addTest(testName, true, 'Loading state system available');
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test image loading performance
   */
  async testImageLoading() {
    const testName = 'Image Loading Performance';
    
    try {
      const startTime = performance.now();
      const testImage = new Image();
      
      const loadPromise = new Promise((resolve, reject) => {
        testImage.onload = () => {
          const loadTime = performance.now() - startTime;
          resolve(loadTime);
        };
        testImage.onerror = () => reject(new Error('Failed to load test image'));
        
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error('Image load timeout')), 5000);
      });
      
      testImage.src = 'assets/images/products/classic-white-sneaker.svg';
      
      try {
        const loadTime = await loadPromise;
        if (loadTime > 3000) {
          this.addWarning(testName, `Image load time: ${loadTime.toFixed(2)}ms (consider optimization)`);
        } else {
          this.addTest(testName, true, `Image loaded in ${loadTime.toFixed(2)}ms`);
        }
      } catch (loadError) {
        this.addTest(testName, false, `Image loading failed: ${loadError.message}`);
      }
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test lazy loading implementation
   */
  testLazyLoading() {
    const testName = 'Lazy Loading';
    
    try {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      if (lazyImages.length === 0) {
        this.addTest(testName, false, 'No images configured for lazy loading');
        return;
      }
      
      // Check if Intersection Observer is supported
      if (!('IntersectionObserver' in window)) {
        this.addWarning(testName, 'IntersectionObserver not supported in this browser');
      }
      
      this.addTest(testName, true, `${lazyImages.length} images configured for lazy loading`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test accessibility features
   */
  testAccessibility() {
    const testName = 'Accessibility';
    
    try {
      const images = document.querySelectorAll('.card img');
      let accessibleImages = 0;
      
      images.forEach(img => {
        if (img.alt && img.alt.trim().length > 0) {
          accessibleImages++;
        }
      });
      
      if (accessibleImages === 0) {
        this.addTest(testName, false, 'No images have proper alt text');
        return;
      }
      
      // Check for ARIA attributes
      const cardsWithAria = document.querySelectorAll('.card a[aria-label]').length;
      
      this.addTest(testName, true, `${accessibleImages} images with alt text, ${cardsWithAria} cards with ARIA labels`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Test browser compatibility
   */
  testBrowserCompatibility() {
    const testName = 'Browser Compatibility';
    
    try {
      const features = {
        'ES6 Support': () => typeof Symbol !== 'undefined',
        'Fetch API': () => typeof fetch !== 'undefined',
        'CSS Grid': () => CSS.supports('display', 'grid'),
        'CSS Object-fit': () => CSS.supports('object-fit', 'cover'),
        'Intersection Observer': () => 'IntersectionObserver' in window
      };
      
      const supportedFeatures = [];
      const unsupportedFeatures = [];
      
      for (const [feature, test] of Object.entries(features)) {
        if (test()) {
          supportedFeatures.push(feature);
        } else {
          unsupportedFeatures.push(feature);
        }
      }
      
      if (unsupportedFeatures.length > 0) {
        this.addWarning(testName, `Unsupported features: ${unsupportedFeatures.join(', ')}`);
      }
      
      this.addTest(testName, true, `${supportedFeatures.length}/${Object.keys(features).length} features supported`);
    } catch (error) {
      this.addTest(testName, false, `Error: ${error.message}`);
    }
  }

  /**
   * Add test result
   */
  addTest(name, passed, message) {
    this.testResults.tests.push({ name, passed, message, type: 'test' });
    if (passed) {
      this.testResults.passed++;
    } else {
      this.testResults.failed++;
    }
  }

  /**
   * Add warning
   */
  addWarning(name, message) {
    this.testResults.tests.push({ name, passed: null, message, type: 'warning' });
    this.testResults.warnings++;
  }

  /**
   * Display test results
   */
  displayResults() {
    console.log('\n📊 Image System Test Results:');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
    
    console.log('\n📋 Detailed Results:');
    this.testResults.tests.forEach(test => {
      const icon = test.type === 'warning' ? '⚠️' : (test.passed ? '✅' : '❌');
      console.log(`${icon} ${test.name}: ${test.message}`);
    });
    
    const successRate = (this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100;
    console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (this.testResults.failed === 0) {
      console.log('🎉 All tests passed! Image system is working correctly.');
    } else {
      console.log('🔧 Some tests failed. Please review the issues above.');
    }
  }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const tester = new ImageSystemTester();
      tester.runAllTests();
    }, 1000); // Wait for other scripts to load
  });
} else {
  // DOM already loaded
  setTimeout(() => {
    const tester = new ImageSystemTester();
    tester.runAllTests();
  }, 1000);
}

// Make tester available globally for manual testing
window.ImageSystemTester = ImageSystemTester;