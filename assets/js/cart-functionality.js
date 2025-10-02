/**
 * Shopping Cart Functionality
 * Handles add to cart interactions with animations and state management
 */

class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.cartCount = 0;
    this.init();
  }

  init() {
    this.updateCartCount();
    this.setupAddToCartButtons();
    this.updateCartBadge();
  }

  setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAddToCart(button);
      });
    });
  }

  async handleAddToCart(button) {
    const card = button.closest('.card');
    const productId = card.dataset.product;
    
    if (!productId) return;

    // Get product details
    const product = this.getProductDetails(card);
    
    // Add loading state
    this.setButtonState(button, 'loading');
    
    try {
      // Simulate API call
      await this.addToCart(product);
      
      // Success state
      this.setButtonState(button, 'success');
      
      // Update cart count
      this.updateCartCount();
      this.updateCartBadge();
      
      // Reset button after delay
      setTimeout(() => {
        this.setButtonState(button, 'default');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      this.setButtonState(button, 'error');
      
      setTimeout(() => {
        this.setButtonState(button, 'default');
      }, 2000);
    }
  }
}  getProd
uctDetails(card) {
    const productId = card.dataset.product;
    const title = card.querySelector('h3')?.textContent || 'Unknown Product';
    const price = card.querySelector('.price-current')?.textContent || '₦0';
    const image = card.querySelector('img')?.src || '';
    const sku = card.querySelector('.sku')?.textContent || '';
    
    // Get selected size
    const selectedSize = card.querySelector('.size.selected')?.dataset.size || '42';
    
    // Get selected colorway
    const selectedSwatch = card.querySelector('.swatch.selected');
    const colorway = selectedSwatch?.title || 'Default';

    return {
      id: productId,
      title,
      price,
      image,
      sku,
      size: selectedSize,
      colorway,
      quantity: 1,
      timestamp: Date.now()
    };
  }

  async addToCart(product) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if product already exists in cart
    const existingIndex = this.cart.findIndex(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.colorway === product.colorway
    );

    if (existingIndex > -1) {
      // Update quantity
      this.cart[existingIndex].quantity += 1;
    } else {
      // Add new item
      this.cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(this.cart));
    
    // Dispatch custom event
    this.dispatchCartEvent('itemAdded', product);
  }

  setButtonState(button, state) {
    // Remove all state classes
    button.classList.remove('loading', 'success', 'error');
    
    switch (state) {
      case 'loading':
        button.classList.add('loading');
        button.disabled = true;
        break;
      case 'success':
        button.classList.add('success');
        button.disabled = true;
        break;
      case 'error':
        button.classList.add('error');
        button.disabled = true;
        break;
      default:
        button.disabled = false;
        break;
    }
  }

  updateCartCount() {
    this.cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      cartBadge.textContent = this.cartCount;
      
      // Show/hide badge based on count
      if (this.cartCount > 0) {
        cartBadge.style.display = 'inline-flex';
        cartBadge.style.opacity = '1';
        cartBadge.style.transform = 'scale(1)';
      } else {
        cartBadge.style.opacity = '0.7';
        cartBadge.textContent = '0';
      }
      
      // Add pulse animation
      cartBadge.classList.remove('cart-pulse');
      setTimeout(() => {
        cartBadge.classList.add('cart-pulse');
      }, 10);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        cartBadge.classList.remove('cart-pulse');
      }, 300);
    } else {
      console.warn('Cart badge element not found');
    }
  }

  dispatchCartEvent(type, data) {
    const event = new CustomEvent(`cart${type}`, {
      detail: { product: data, cart: this.cart, count: this.cartCount }
    });
    document.dispatchEvent(event);
  }

  // Public methods for cart management
  getCart() {
    return this.cart;
  }

  getCartCount() {
    return this.cartCount;
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem('cart');
    this.updateCartCount();
    this.updateCartBadge();
  }
}

// Initialize cart functionality
const shoppingCart = new ShoppingCart();

// Export for global access
window.ShoppingCart = ShoppingCart;
window.shoppingCart = shoppingCart;