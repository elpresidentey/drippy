    if (!city) valid = false;
// Checkout Page JavaScript
class CheckoutManager {
  constructor() {
    this.cart = this.getCartFromStorage();
    this.formData = {
      contact: {},
      shipping: {},
      payment: { method: 'cod', codFee: 200 }
    };
    this.nigerianStates = this.getNigerianStates();
    
    this.init();
  }

  init() {
    this.populateStatesDropdown();
    this.displayCartItems();
    this.calculateTotals();
    this.setupEventListeners();
    this.setupFormValidation();
    
    // Check if cart is empty
    if (!this.cart || this.cart.length === 0) {
      this.handleEmptyCart();
    }
  }

  // Nigerian States Data with Shipping Costs
  getNigerianStates() {
    return [
      { code: 'AB', name: 'Abia', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'AD', name: 'Adamawa', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'AK', name: 'Akwa Ibom', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'AN', name: 'Anambra', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'BA', name: 'Bauchi', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'BY', name: 'Bayelsa', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'BE', name: 'Benue', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'BO', name: 'Borno', shippingCost: 4000, deliveryDays: '6-8' },
      { code: 'CR', name: 'Cross River', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'DE', name: 'Delta', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'EB', name: 'Ebonyi', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'ED', name: 'Edo', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'EK', name: 'Ekiti', shippingCost: 2000, deliveryDays: '2-4' },
      { code: 'EN', name: 'Enugu', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'FC', name: 'FCT - Abuja', shippingCost: 2000, deliveryDays: '2-4' },
      { code: 'GO', name: 'Gombe', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'IM', name: 'Imo', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'JI', name: 'Jigawa', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'KD', name: 'Kaduna', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'KN', name: 'Kano', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'KT', name: 'Katsina', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'KE', name: 'Kebbi', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'KO', name: 'Kogi', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'KW', name: 'Kwara', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'LA', name: 'Lagos', shippingCost: 1500, deliveryDays: '1-3' },
      { code: 'NA', name: 'Nasarawa', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'NI', name: 'Niger', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'OG', name: 'Ogun', shippingCost: 2000, deliveryDays: '2-4' },
      { code: 'ON', name: 'Ondo', shippingCost: 2500, deliveryDays: '3-5' },
      { code: 'OS', name: 'Osun', shippingCost: 2000, deliveryDays: '2-4' },
      { code: 'OY', name: 'Oyo', shippingCost: 2000, deliveryDays: '2-4' },
      { code: 'PL', name: 'Plateau', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'RI', name: 'Rivers', shippingCost: 3000, deliveryDays: '4-6' },
      { code: 'SO', name: 'Sokoto', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'TA', name: 'Taraba', shippingCost: 3500, deliveryDays: '5-7' },
      { code: 'YO', name: 'Yobe', shippingCost: 4000, deliveryDays: '6-8' },
      { code: 'ZA', name: 'Zamfara', shippingCost: 3500, deliveryDays: '5-7' }
    ];
  }

  // Get cart data from localStorage or URL parameters
  getCartFromStorage() {
    try {
      // First try to get from URL parameters (if navigated from cart)
      const urlParams = new URLSearchParams(window.location.search);
      const cartData = urlParams.get('cart');
      if (cartData) {
        return JSON.parse(decodeURIComponent(cartData));
      }
      
      // Fallback to localStorage
      const stored = localStorage.getItem('dripz_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart data:', error);
      return [];
    }
  }

  // Populate states dropdown
  populateStatesDropdown() {
    const stateSelect = document.getElementById('state');
    if (!stateSelect) return;

    this.nigerianStates.forEach(state => {
      const option = document.createElement('option');
      option.value = state.code;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
  }

  // Display cart items in checkout
  displayCartItems() {
    const cartItemsContainer = document.getElementById('checkoutCartItems');
    if (!cartItemsContainer || !this.cart.length) return;

    cartItemsContainer.innerHTML = this.cart.map(item => `
      <div class="checkout-cart-item" data-product-id="${item.id || ''}">
        <img 
          src="${item.image || 'assets/images/fallback-sneaker.svg'}" 
          alt="${item.title || 'Sneaker'}"
          class="checkout-item-image"
        >
        <div class="checkout-item-details">
          <div class="checkout-item-name">${item.title || 'Sneaker'}</div>
          <div class="checkout-item-meta">
            Size: EU ${item.size || 'N/A'} • Color: ${item.color || 'N/A'}
          </div>
          <div class="checkout-item-price">${this.formatCurrency(item.price || 0)}</div>
        </div>
      </div>
    `).join('');
  }

  // Calculate and display totals
  calculateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const selectedState = document.getElementById('state')?.value;
    const stateData = this.nigerianStates.find(s => s.code === selectedState);
    const shipping = stateData ? stateData.shippingCost : 0;
    const codFee = this.formData.payment.method === 'cod' ? this.formData.payment.codFee : 0;
    const total = subtotal + shipping + codFee;

    // Update display
    document.getElementById('subtotalAmount').textContent = this.formatCurrency(subtotal);
    
    const shippingEl = document.getElementById('shippingAmount');
    if (shipping > 0) {
      shippingEl.textContent = this.formatCurrency(shipping);
    } else {
      shippingEl.textContent = selectedState ? 'Free' : 'Calculate at next step';
    }
    
    const codFeeRow = document.getElementById('codFeeRow');
    if (this.formData.payment.method === 'cod') {
      codFeeRow.style.display = 'flex';
      document.getElementById('codFeeAmount').textContent = this.formatCurrency(codFee);
    } else {
      codFeeRow.style.display = 'none';
    }
    
    document.getElementById('totalAmount').textContent = this.formatCurrency(total);

    // Update delivery estimate
    this.updateDeliveryEstimate(stateData);
  }

  // Update delivery estimate
  updateDeliveryEstimate(stateData) {
    const estimateEl = document.getElementById('estimatedDelivery');
    if (!estimateEl) return;

    if (stateData) {
      const today = new Date();
      const minDays = parseInt(stateData.deliveryDays.split('-')[0]);
      const maxDays = parseInt(stateData.deliveryDays.split('-')[1]);
      
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + minDays);
      
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + maxDays);
      
      const formatDate = (date) => date.toLocaleDateString('en-NG', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      estimateEl.textContent = `${formatDate(minDate)} - ${formatDate(maxDate)}`;
    } else {
      estimateEl.textContent = 'Select state for estimate';
    }
  }

  // Format currency in Nigerian Naira
  formatCurrency(amount) {
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `₦${Math.round(amount).toLocaleString()}`;
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // State selection change
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
      stateSelect.addEventListener('change', () => {
        this.calculateTotals();
      });
    }

    // Payment method change
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.formData.payment.method = e.target.value;
        this.calculateTotals();
      });
    });

    // Back to cart button
    const backToCartBtn = document.getElementById('backToCart');
    if (backToCartBtn) {
      backToCartBtn.addEventListener('click', () => {
        window.location.href = 'index.html#shop';
      });
    }

    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }
  }

  // Setup form validation
  setupFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'fullName':
        if (!value) {
          errorMessage = 'Full name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
          errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
          isValid = false;
        }
        break;

      case 'email':
        if (!value) {
          errorMessage = 'Email address is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;

      case 'phone':
        if (!value) {
          errorMessage = 'Phone number is required';
          isValid = false;
        } else if (!/^(\+234|0)[789]\d{9}$/.test(value.replace(/\s/g, ''))) {
          errorMessage = 'Please enter a valid Nigerian phone number';
          isValid = false;
        }
        break;

      case 'streetAddress':
        if (!value) {
          errorMessage = 'Street address is required';
          isValid = false;
        } else if (value.length < 5) {
          errorMessage = 'Please enter a complete address';
          isValid = false;
        }
        break;

      case 'city':
        if (!value) {
          errorMessage = 'City is required';
          isValid = false;
        }
        break;

      case 'state':
        if (!value) {
          errorMessage = 'Please select a state';
          isValid = false;
        }
        break;
    }

    this.displayFieldError(field, errorMessage);
    return isValid;
  }

  // Display field error
  displayFieldError(field, message) {
    const errorEl = document.getElementById(`${field.id}-error`);
    if (errorEl) {
      if (message) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        field.classList.add('error');
      } else {
        errorEl.classList.remove('show');
        field.classList.remove('error');
      }
    }
  }

  // Clear field error
  clearFieldError(field) {
    const errorEl = document.getElementById(`${field.id}-error`);
    if (errorEl) {
      errorEl.classList.remove('show');
      field.classList.remove('error');
    }
  }

  // Handle form submission
  async handleFormSubmission() {
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('placeOrderBtn');
    
    // Validate all fields
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormError('Please correct the errors above before proceeding.');
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Collect form data
      const orderData = this.collectFormData();
      
      // Simulate order processing (replace with actual API call)
      await this.processOrder(orderData);
      
      // Redirect to confirmation page
      this.redirectToConfirmation(orderData);
      
    } catch (error) {
      console.error('Order processing error:', error);
      this.showFormError('There was an error processing your order. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  // Collect form data
  collectFormData() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const selectedState = this.nigerianStates.find(s => s.code === formData.get('state'));
    
    const orderData = {
      orderId: this.generateOrderId(),
      items: this.cart,
      customer: {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone')
      },
      shipping: {
        streetAddress: formData.get('streetAddress'),
        city: formData.get('city'),
        state: selectedState ? selectedState.name : '',
        stateCode: formData.get('state'),
        postalCode: formData.get('postalCode') || '',
        deliveryInstructions: formData.get('deliveryInstructions') || ''
      },
      payment: {
        method: formData.get('paymentMethod'),
        codFee: formData.get('paymentMethod') === 'cod' ? 200 : 0
      },
      pricing: {
        subtotal: this.cart.reduce((sum, item) => sum + (item.price || 0), 0),
        shipping: selectedState ? selectedState.shippingCost : 0,
        codFee: formData.get('paymentMethod') === 'cod' ? 200 : 0,
        total: 0 // Will be calculated
      },
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery(selectedState)
    };

    // Calculate total
    orderData.pricing.total = orderData.pricing.subtotal + orderData.pricing.shipping + orderData.pricing.codFee;

    return orderData;
  }

  // Generate order ID
  generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `DK-${timestamp}-${random}`.toUpperCase();
  }

  // Calculate estimated delivery date
  calculateEstimatedDelivery(stateData) {
    if (!stateData) return null;
    
    const today = new Date();
    const maxDays = parseInt(stateData.deliveryDays.split('-')[1]);
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + maxDays);
    
    return deliveryDate;
  }

  // Process order (simulate API call)
  async processOrder(orderData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store order data for confirmation page
    localStorage.setItem('dripz_current_order', JSON.stringify(orderData));
    
    // Clear cart
    localStorage.removeItem('dripz_cart');
    
    return { success: true, orderId: orderData.orderId };
  }

  // Redirect to confirmation page
  redirectToConfirmation(orderData) {
    window.location.href = `confirmation.html?order=${orderData.orderId}`;
  }

  // Show form error
  showFormError(message) {
    // Create or update error message at top of form
    let errorContainer = document.getElementById('form-error-summary');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'form-error-summary';
      errorContainer.className = 'form-error-summary';
      errorContainer.setAttribute('role', 'alert');
      errorContainer.setAttribute('aria-live', 'polite');
      
      const form = document.getElementById('checkoutForm');
      form.insertBefore(errorContainer, form.firstChild);
    }
    
    errorContainer.innerHTML = `
      <div class="error-icon">⚠️</div>
      <div class="error-message">${message}</div>
    `;
    errorContainer.style.display = 'flex';
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Handle empty cart
  handleEmptyCart() {
    const checkoutContainer = document.querySelector('.checkout-container');
    if (checkoutContainer) {
      checkoutContainer.innerHTML = `
        <div class="empty-cart-message">
          <div class="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some sneakers to your cart before proceeding to checkout.</p>
          <a href="index.html#shop" class="btn-primary">Continue Shopping</a>
        </div>
      `;
    }
  }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CheckoutManager();
});

// Add CSS for error summary
const errorSummaryStyles = `
  .form-error-summary {
    display: none;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    color: #721c24;
    margin-bottom: 1.5rem;
  }
  
  .error-icon {
    font-size: 1.2rem;
  }
  
  .error-message {
    flex: 1;
    font-weight: 500;
  }
  
  .empty-cart-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    background: var(--bg);
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
  
  .empty-cart-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .empty-cart-message h2 {
    margin-bottom: 0.5rem;
    color: var(--text);
  }
  
  .empty-cart-message p {
    color: var(--muted);
    margin-bottom: 2rem;
  }
`;

// Inject error summary styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorSummaryStyles;
document.head.appendChild(styleSheet);