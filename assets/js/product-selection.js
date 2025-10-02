/**
 * Product Selection Enhancement
 * Handles size and colorway selection for products
 */

class ProductSelection {
  constructor() {
    this.init();
  }

  init() {
    this.setupSizeSelection();
    this.setupSwatchSelection();
  }

  setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size:not(.disabled)');
    
    sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectSize(button);
      });
    });
  }

  setupSwatchSelection() {
    const swatchButtons = document.querySelectorAll('.swatch');
    
    swatchButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectSwatch(button);
      });
    });
  }

  selectSize(selectedButton) {
    const card = selectedButton.closest('.card');
    const sizeButtons = card.querySelectorAll('.size');
    
    // Remove selected class from all sizes
    sizeButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked size
    selectedButton.classList.add('selected');
    
    // Add visual feedback
    selectedButton.style.animation = 'none';
    setTimeout(() => {
      selectedButton.style.animation = 'pulse 0.3s ease';
    }, 10);
    
    // Update add-to-cart button if needed
    this.updateAddToCartButton(card);
  }

  selectSwatch(selectedButton) {
    const card = selectedButton.closest('.card');
    const swatchButtons = card.querySelectorAll('.swatch');
    
    // Remove selected class from all swatches
    swatchButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked swatch
    selectedButton.classList.add('selected');
    
    // Add visual feedback
    selectedButton.style.animation = 'none';
    setTimeout(() => {
      selectedButton.style.animation = 'pulse 0.3s ease';
    }, 10);
    
    // Update add-to-cart button if needed
    this.updateAddToCartButton(card);
  }

  updateAddToCartButton(card) {
    const addToCartBtn = card.querySelector('.add-to-cart');
    const selectedSize = card.querySelector('.size.selected');
    const selectedSwatch = card.querySelector('.swatch.selected');
    
    if (addToCartBtn) {
      // Enable button if selections are made
      if (selectedSize || selectedSwatch) {
        addToCartBtn.style.opacity = '1';
        addToCartBtn.style.transform = 'scale(1)';
      }
      
      // Add subtle glow effect when ready
      if (selectedSize && selectedSwatch) {
        addToCartBtn.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.3)';
      }
    }
  }
}

// Initialize product selection
const productSelection = new ProductSelection();

// Export for global access
window.ProductSelection = ProductSelection;
window.productSelection = productSelection;