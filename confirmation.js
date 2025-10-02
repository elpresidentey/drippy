// Order Confirmation Page JavaScript
class OrderConfirmation {
  constructor() {
    this.orderData = this.getOrderData();
    this.init();
  }

  init() {
    if (!this.orderData) {
      this.handleMissingOrder();
      return;
    }

    this.displayOrderDetails();
    this.setupEventListeners();
  }

  // Get order data from localStorage
  getOrderData() {
    try {
      const stored = localStorage.getItem('dripz_current_order');
      if (stored) {
        // Parse the data first to ensure it's valid before removing it.
        const orderData = JSON.parse(stored);
        localStorage.removeItem('dripz_current_order');
        return orderData;
      }
      return null;
    } catch (error) {
      console.error('Error loading order data:', error);
      return null;
    }
  }

  // Display order details
  displayOrderDetails() {
    this.displayOrderInfo();
    this.displayOrderedItems();
    this.displayShippingInfo();
    this.displayOrderTotal();
  }

  // Display basic order information
  displayOrderInfo() {
    const orderNumberEl = document.getElementById('orderNumber');
    const orderDateEl = document.getElementById('orderDate');
    const estimatedDeliveryEl = document.getElementById('estimatedDelivery');
    const paymentMethodEl = document.getElementById('paymentMethod');

    if (orderNumberEl) {
      orderNumberEl.textContent = this.orderData.orderId;
    }

    if (orderDateEl) {
      const orderDate = new Date(this.orderData.createdAt);
      orderDateEl.textContent = orderDate.toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (estimatedDeliveryEl && this.orderData.estimatedDelivery) {
      const deliveryDate = new Date(this.orderData.estimatedDelivery);
      estimatedDeliveryEl.textContent = deliveryDate.toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (paymentMethodEl) {
      const paymentText = this.orderData.payment.method === 'cod' 
        ? 'Pay on Delivery (COD)' 
        : 'Card Payment';
      paymentMethodEl.textContent = paymentText;
    }
  }

  // Display ordered items
  displayOrderedItems() {
    const orderedItemsEl = document.getElementById('orderedItems');
    if (!orderedItemsEl || !this.orderData.items) return;

    orderedItemsEl.innerHTML = this.orderData.items.map(item => `
      <div class="ordered-item">
        <img 
          src="${item.image || 'assets/images/fallback-sneaker.svg'}" 
          alt="${item.title || 'Sneaker'}"
          class="ordered-item-image"
        >
        <div class="ordered-item-details">
          <div class="ordered-item-name">${item.title || 'Sneaker'}</div>
          <div class="ordered-item-meta">
            Size: EU ${item.size || 'N/A'} • Color: ${item.color || 'N/A'}
          </div>
        </div>
        <div class="ordered-item-price">${this.formatCurrency(item.price || 0)}</div>
      </div>
    `).join('');
  }

  // Display shipping information
  displayShippingInfo() {
    const shippingDetailsEl = document.getElementById('shippingDetails');
    if (!shippingDetailsEl || !this.orderData.shipping) return;

    const shipping = this.orderData.shipping;
    const customer = this.orderData.customer;

    shippingDetailsEl.innerHTML = `
      <div class="shipping-address">
        <div class="address-line"><strong>${customer.fullName}</strong></div>
        <div class="address-line">${shipping.streetAddress}</div>
        <div class="address-line">${shipping.city}, ${shipping.state}</div>
        ${shipping.postalCode ? `<div class="address-line">${shipping.postalCode}</div>` : ''}
        <div class="address-line">${customer.phone}</div>
        ${shipping.deliveryInstructions ? `
          <div class="delivery-instructions">
            <strong>Delivery Instructions:</strong> ${shipping.deliveryInstructions}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Display order total breakdown
  displayOrderTotal() {
    const totalBreakdownEl = document.getElementById('totalBreakdown');
    if (!totalBreakdownEl || !this.orderData.pricing) return;

    const pricing = this.orderData.pricing;

    totalBreakdownEl.innerHTML = `
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-value">${this.formatCurrency(pricing.subtotal)}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Shipping:</span>
        <span class="total-value">${this.formatCurrency(pricing.shipping)}</span>
      </div>
      ${pricing.codFee > 0 ? `
        <div class="total-row cod-fee">
          <span class="total-label">COD Fee:</span>
          <span class="total-value">${this.formatCurrency(pricing.codFee)}</span>
        </div>
      ` : ''}
      <div class="total-row final-total">
        <span class="total-label">Total:</span>
        <span class="total-value">${this.formatCurrency(pricing.total)}</span>
      </div>
    `;
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
    const printBtn = document.getElementById('printOrderBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this.printOrderDetails();
      });
    }
  }

  // Print order details
  printOrderDetails() {
    // Create a print-friendly version of the order details
    const printContent = this.generatePrintContent();
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

  // Generate print-friendly content
  generatePrintContent() {
    const orderDate = new Date(this.orderData.createdAt).toLocaleDateString('en-NG');
    const deliveryDate = this.orderData.estimatedDelivery 
      ? new Date(this.orderData.estimatedDelivery).toLocaleDateString('en-NG')
      : 'TBD';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${this.orderData.orderId} - Dripz & Kix</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .order-info { margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .final-total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👟 Dripz & Kix</h1>
          <h2>Order Confirmation</h2>
        </div>
        
        <div class="order-info">
          <p><strong>Order Number:</strong> ${this.orderData.orderId}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Estimated Delivery:</strong> ${deliveryDate}</p>
          <p><strong>Payment Method:</strong> ${this.orderData.payment.method === 'cod' ? 'Pay on Delivery (COD)' : 'Card Payment'}</p>
        </div>

        <div class="section">
          <h3>Items Ordered</h3>
          ${this.orderData.items.map(item => `
            <div class="item">
              <div>
                <strong>${item.title}</strong><br>
                Size: EU ${item.size} • Color: ${item.color}
              </div>
              <div>${this.formatCurrency(item.price)}</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>Shipping Address</h3>
          <p>
            ${this.orderData.customer.fullName}<br>
            ${this.orderData.shipping.streetAddress}<br>
            ${this.orderData.shipping.city}, ${this.orderData.shipping.state}<br>
            ${this.orderData.shipping.postalCode || ''}<br>
            ${this.orderData.customer.phone}
          </p>
          ${this.orderData.shipping.deliveryInstructions ? `
            <p><strong>Delivery Instructions:</strong> ${this.orderData.shipping.deliveryInstructions}</p>
          ` : ''}
        </div>

        <div class="section">
          <h3>Order Total</h3>
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${this.formatCurrency(this.orderData.pricing.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>${this.formatCurrency(this.orderData.pricing.shipping)}</span>
          </div>
          ${this.orderData.pricing.codFee > 0 ? `
            <div class="total-row">
              <span>COD Fee:</span>
              <span>${this.formatCurrency(this.orderData.pricing.codFee)}</span>
            </div>
          ` : ''}
          <div class="total-row final-total">
            <span>Total:</span>
            <span>${this.formatCurrency(this.orderData.pricing.total)}</span>
          </div>
        </div>

        <div class="section">
          <p><strong>Customer Support:</strong></p>
          <p>Phone: +234 801 234 5678</p>
          <p>Email: support@dripzkix.com</p>
        </div>
      </body>
      </html>
    `;
  }

  // Handle missing order data
  handleMissingOrder() {
    const confirmationContainer = document.querySelector('.confirmation-container');
    if (confirmationContainer) {
      confirmationContainer.innerHTML = `
        <div class="error-message">
          <div class="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>We couldn't find your order details. This might happen if:</p>
          <ul>
            <li>You navigated directly to this page</li>
            <li>Your session has expired</li>
            <li>There was an error processing your order</li>
          </ul>
          <div class="error-actions">
            <a href="index.html#shop" class="btn-primary">Continue Shopping</a>
            <a href="mailto:support@dripzkix.com" class="btn-secondary">Contact Support</a>
          </div>
        </div>
      `;
    }
  }
}

// Initialize confirmation page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OrderConfirmation();
});

// Add CSS for confirmation page elements
const confirmationStyles = `
  .confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .confirmation-content {
    background: var(--bg);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border);
  }
  
  .confirmation-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }
  
  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .confirmation-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #28a745;
    margin-bottom: 0.5rem;
  }
  
  .confirmation-subtitle {
    font-size: 1.1rem;
    color: var(--muted);
    margin: 0;
  }
  
  .order-details {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .order-summary-card,
  .ordered-items-card,
  .shipping-info-card,
  .order-total-card {
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #fafafa;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .order-info {
    display: grid;
    gap: 0.75rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .info-label {
    color: var(--muted);
    font-weight: 500;
  }
  
  .info-value {
    color: var(--text);
    font-weight: 600;
  }
  
  .order-number {
    font-family: monospace;
    background: rgba(43, 43, 43, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  .ordered-items {
    display: grid;
    gap: 1rem;
  }
  
  .ordered-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg);
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  
  .ordered-item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    background: #f0f0f0;
  }
  
  .ordered-item-details {
    flex: 1;
  }
  
  .ordered-item-name {
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.25rem;
  }
  
  .ordered-item-meta {
    font-size: 0.9rem;
    color: var(--muted);
  }
  
  .ordered-item-price {
    font-weight: 600;
    color: var(--text);
  }
  
  .shipping-address {
    line-height: 1.6;
  }
  
  .address-line {
    margin-bottom: 0.25rem;
  }
  
  .delivery-instructions {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(40, 167, 69, 0.05);
    border-radius: 6px;
    border: 1px solid rgba(40, 167, 69, 0.2);
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }
  
  .total-row.final-total {
    font-weight: 700;
    font-size: 1.1rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    margin-top: 0.5rem;
  }
  
  .cod-fee .total-label,
  .cod-fee .total-value {
    color: #dc3545;
    font-size: 0.9rem;
  }
  
  .next-steps {
    margin-bottom: 2rem;
  }
  
  .steps-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1rem;
  }
  
  .steps-list {
    display: grid;
    gap: 1rem;
  }
  
  .step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: rgba(40, 167, 69, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(40, 167, 69, 0.2);
  }
  
  .step-icon {
    font-size: 1.5rem;
    margin-top: 0.25rem;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-title {
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.25rem;
  }
  
  .step-description {
    color: var(--muted);
    font-size: 0.9rem;
  }
  
  .confirmation-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  .support-info {
    text-align: center;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  
  .support-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.5rem;
  }
  
  .support-text {
    color: var(--muted);
    margin-bottom: 1rem;
  }
  
  .support-contacts {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .support-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--brand);
    text-decoration: none;
    font-weight: 500;
  }
  
  .support-contact:hover {
    text-decoration: underline;
  }
  
  .contact-icon {
    font-size: 1.1rem;
  }
  
  .error-message {
    text-align: center;
    padding: 3rem;
    background: var(--bg);
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
  
  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .error-message h2 {
    color: #dc3545;
    margin-bottom: 1rem;
  }
  
  .error-message ul {
    text-align: left;
    max-width: 400px;
    margin: 1rem auto 2rem;
    color: var(--muted);
  }
  
  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  @media (max-width: 768px) {
    .confirmation-container {
      padding: 0 1rem;
    }
    
    .confirmation-content {
      padding: 1.5rem;
    }
    
    .confirmation-title {
      font-size: 2rem;
    }
    
    .confirmation-actions {
      flex-direction: column;
    }
    
    .support-contacts {
      flex-direction: column;
      gap: 1rem;
    }
    
    .ordered-item {
      flex-direction: column;
      text-align: center;
    }
    
    .info-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
`;

// Inject confirmation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = confirmationStyles;
document.head.appendChild(styleSheet);