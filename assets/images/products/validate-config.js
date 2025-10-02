/**
 * Configuration Validation Script
 * Validates the integrity of the image configuration data structure
 */

// Import the configuration (adjust path as needed)
// const { IMAGE_CONFIG, validateConfig } = require('./image-config.js');

/**
 * Comprehensive validation of image configuration
 * @param {Object} config - Image configuration object
 * @returns {Object} Detailed validation results
 */
function validateImageConfig(config = IMAGE_CONFIG) {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    info: {
      productCount: 0,
      categoryBreakdown: {},
      priorityBreakdown: {},
      missingFallbacks: []
    }
  };

  // Validate main configuration structure
  if (!config.version) {
    results.errors.push('Missing version number');
    results.valid = false;
  }

  if (!config.baseUrl) {
    results.errors.push('Missing baseUrl');
    results.valid = false;
  }

  if (!config.products || typeof config.products !== 'object') {
    results.errors.push('Missing or invalid products object');
    results.valid = false;
    return results;
  }

  // Count products
  results.info.productCount = Object.keys(config.products).length;

  // Validate each product
  Object.entries(config.products).forEach(([productId, product]) => {
    validateProduct(productId, product, results);
  });

  // Validate fallback system
  validateFallbacks(config.fallbacks, results);

  // Generate summary statistics
  generateSummaryStats(config.products, results);

  return results;
}

/**
 * Validate individual product configuration
 * @param {string} productId - Product identifier
 * @param {Object} product - Product configuration
 * @param {Object} results - Results object to update
 */
function validateProduct(productId, product, results) {
  // Required fields validation
  const requiredFields = ['id', 'unsplashId', 'alt', 'category', 'colorway'];
  
  requiredFields.forEach(field => {
    if (!product[field]) {
      results.errors.push(`Product ${productId}: Missing required field '${field}'`);
      results.valid = false;
    }
  });

  // ID consistency check
  if (product.id && product.id !== productId) {
    results.errors.push(`Product ${productId}: ID mismatch (${product.id} !== ${productId})`);
    results.valid = false;
  }

  // Unsplash ID format validation
  if (product.unsplashId && !product.unsplashId.startsWith('photo-')) {
    results.warnings.push(`Product ${productId}: Unsplash ID should start with 'photo-'`);
  }

  // Alt text validation
  if (product.alt) {
    if (product.alt.length < 10) {
      results.warnings.push(`Product ${productId}: Alt text is very short (${product.alt.length} chars)`);
    }
    if (product.alt.length > 150) {
      results.warnings.push(`Product ${productId}: Alt text is very long (${product.alt.length} chars)`);
    }
  }

  // Category validation
  const validCategories = ['classic', 'runner', 'lifestyle', 'performance'];
  if (product.category && !validCategories.includes(product.category)) {
    results.errors.push(`Product ${productId}: Invalid category '${product.category}'`);
    results.valid = false;
  }

  // Priority validation
  const validPriorities = ['high', 'medium', 'low'];
  if (product.priority && !validPriorities.includes(product.priority)) {
    results.warnings.push(`Product ${productId}: Invalid priority '${product.priority}'`);
  }

  // Tags validation
  if (product.tags && !Array.isArray(product.tags)) {
    results.warnings.push(`Product ${productId}: Tags should be an array`);
  }

  // Fallback text validation
  if (!product.fallbackText) {
    results.warnings.push(`Product ${productId}: Missing fallbackText`);
  }
}

/**
 * Validate fallback configuration
 * @param {Object} fallbacks - Fallback configuration
 * @param {Object} results - Results object to update
 */
function validateFallbacks(fallbacks, results) {
  if (!fallbacks) {
    results.errors.push('Missing fallbacks configuration');
    results.valid = false;
    return;
  }

  if (!fallbacks.default) {
    results.errors.push('Missing default fallback image');
    results.valid = false;
  }

  if (!fallbacks.byCategory) {
    results.warnings.push('Missing category-specific fallbacks');
    return;
  }

  // Check for missing category fallbacks
  const requiredCategories = ['classic', 'runner', 'lifestyle', 'performance'];
  requiredCategories.forEach(category => {
    if (!fallbacks.byCategory[category]) {
      results.info.missingFallbacks.push(category);
      results.warnings.push(`Missing fallback for category: ${category}`);
    }
  });
}

/**
 * Generate summary statistics
 * @param {Object} products - Products configuration
 * @param {Object} results - Results object to update
 */
function generateSummaryStats(products, results) {
  // Category breakdown
  Object.values(products).forEach(product => {
    if (product.category) {
      results.info.categoryBreakdown[product.category] = 
        (results.info.categoryBreakdown[product.category] || 0) + 1;
    }
  });

  // Priority breakdown
  Object.values(products).forEach(product => {
    const priority = product.priority || 'unspecified';
    results.info.priorityBreakdown[priority] = 
      (results.info.priorityBreakdown[priority] || 0) + 1;
  });
}

/**
 * Format validation results for display
 * @param {Object} results - Validation results
 * @returns {string} Formatted report
 */
function formatValidationReport(results) {
  let report = '\n=== IMAGE CONFIGURATION VALIDATION REPORT ===\n\n';
  
  // Overall status
  report += `Status: ${results.valid ? '✅ VALID' : '❌ INVALID'}\n`;
  report += `Products: ${results.info.productCount}\n\n`;

  // Errors
  if (results.errors.length > 0) {
    report += '🚨 ERRORS:\n';
    results.errors.forEach(error => {
      report += `  - ${error}\n`;
    });
    report += '\n';
  }

  // Warnings
  if (results.warnings.length > 0) {
    report += '⚠️  WARNINGS:\n';
    results.warnings.forEach(warning => {
      report += `  - ${warning}\n`;
    });
    report += '\n';
  }

  // Statistics
  report += '📊 STATISTICS:\n';
  report += `  Total Products: ${results.info.productCount}\n`;
  
  report += '  Categories:\n';
  Object.entries(results.info.categoryBreakdown).forEach(([category, count]) => {
    report += `    - ${category}: ${count}\n`;
  });

  report += '  Priorities:\n';
  Object.entries(results.info.priorityBreakdown).forEach(([priority, count]) => {
    report += `    - ${priority}: ${count}\n`;
  });

  if (results.info.missingFallbacks.length > 0) {
    report += '  Missing Fallbacks:\n';
    results.info.missingFallbacks.forEach(category => {
      report += `    - ${category}\n`;
    });
  }

  report += '\n=== END REPORT ===\n';
  return report;
}

/**
 * Run validation and display results
 */
function runValidation() {
  console.log('Running image configuration validation...');
  
  try {
    const results = validateImageConfig();
    const report = formatValidationReport(results);
    
    console.log(report);
    
    if (!results.valid) {
      console.error('❌ Configuration validation failed!');
      process.exit(1);
    } else {
      console.log('✅ Configuration validation passed!');
    }
    
    return results;
  } catch (error) {
    console.error('💥 Validation error:', error.message);
    process.exit(1);
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateImageConfig,
    validateProduct,
    validateFallbacks,
    formatValidationReport,
    runValidation
  };
}

// Run validation if called directly
if (typeof require !== 'undefined' && require.main === module) {
  runValidation();
}