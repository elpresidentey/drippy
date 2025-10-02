// Basic interactivity and UX enhancements
const shopBtn = document.getElementById("shopNowBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const viewCollectionsBtn = document.getElementById("viewCollectionsBtn");
const productGrid = document.querySelector(".product-grid");
const productGrids = Array.from(document.querySelectorAll('.product-grid'));
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const toast = document.getElementById("toast");
const cartBtn = document.querySelector(".cart-btn");
const cartBadge = document.querySelector(".cart-badge");
const searchBtn = document.querySelector(".search-btn");
let cart = [];
let cartCount = 0;
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// --- Cart Persistence Helpers ---
function saveCartToStorage() {
  localStorage.setItem('dripz_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  try {
    const data = localStorage.getItem('dripz_cart');
    cart = Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
  } catch {
    cart = [];
  }
  cartCount = cart.length;
}

// On page load, load cart from storage
loadCartFromStorage();

// New Navbar functionality
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 50) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
  }

  lastScrollY = currentScrollY;
}

// Mobile menu toggle
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const sections = ['home', 'shop', 'collections', 'contact'];
  const scrollPos = window.scrollY + 100;

  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const navLink = document.querySelector(`[href="#${sectionId}"]`);

    if (section && navLink) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to current link
        navLink.classList.add('active');
      }
    }
  });
}

// Add scroll listener with throttling for performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleNavbarScroll();
      updateActiveNavLink();
      ticking = false;
    });
    ticking = true;
  }
});

// Enhanced product image fallback system with image management integration
function setupImageFallbacks() {
  productGrids.forEach((grid) => {
    grid.querySelectorAll("img").forEach((img) => {
      // Ensure proper attributes
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
      if (!img.hasAttribute("referrerpolicy")) img.setAttribute("referrerpolicy", "no-referrer");

      // Enhanced error handling with category-specific fallbacks
      img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied === "true") return;
        img.dataset.fallbackApplied = "true";

        // Try to use category-specific fallback if available
        const category = img.dataset.category;
        let fallbackSrc;

        if (category && window.ImageManager) {
          const categoryFallback = window.ImageManager.getCategoryFallback(category);
          fallbackSrc = categoryFallback.src;
          img.alt = categoryFallback.alt;
        } else {
          // Use default fallback
          fallbackSrc = window.ImageManager ?
            window.ImageManager.getDefaultFallback().src :
            'assets/images/fallback-sneaker.svg';
        }

        img.src = fallbackSrc;
        img.classList.add("fallback");
        console.warn(`Replaced failed product image with ${category || 'default'} fallback:`, img);
      });

      // Success handler
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    });
  });
}

// Initialize fallback system
setupImageFallbacks();

// CTA: Shop Now button adds default product to cart and opens cart drawer (no duplicates)
if (shopBtn) {
  shopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Add Cloud Walker, size 42, color Triple White to cart if not already present
    loadCartFromStorage();
    const product = {
      title: "Cloud Walker",
      price: 42500,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=75&w=800&h=600&auto=format&fit=crop&ixlib=rb-4.0.3",
      color: "Triple White",
      size: "42"
    };
    const exists = cart.some(item => item.title === product.title && item.size === product.size && item.color === product.color);
    if (!exists) {
      cart.push(product);
      saveCartToStorage();
      updateCartUI();
      showToast("Added to cart");
    } else {
      showToast("Already in cart");
    }
    toggleCart(true);
  });
}

// Secondary CTA -> Collections
if (viewCollectionsBtn) {
  viewCollectionsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector("#collections");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Toast helper
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1400);
}

// Update cart badge and count
function updateCartBadge() {
  cartCount = cart.length;
  if (cartBadge) {
    cartBadge.textContent = String(cartCount);
    cartBadge.setAttribute('data-count', cartCount);
    
    // Show/hide badge based on cart count
    if (cartCount > 0) {
      cartBadge.style.opacity = '1';
      cartBadge.style.transform = 'scale(1)';
    } else {
      cartBadge.style.opacity = '0';
      cartBadge.style.transform = 'scale(0.8)';
    }
  }
}

// Hero section is now static - no slider needed
console.log('Hero section loaded with Solebox-style layout');

// Secondary CTA -> Collections
if (viewCollectionsBtn) {
  viewCollectionsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector("#collections");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Additional mobile menu handling (if primaryNav exists)
const primaryNav = document.querySelector('.nav-menu');
if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when a link is clicked (mobile)
  primaryNav.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth-scroll for in-page anchors
document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Reset menu state on resize up from mobile
window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && primaryNav && menuToggle) {
    primaryNav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Product card interactions: size & swatch selection
// (productGrid is now defined at the top)
document.addEventListener("click", (e) => {
  const target = e.target;

  // Size selection
  if (target.classList.contains("size")) {
    if (target.hasAttribute("disabled") || target.classList.contains("disabled")) {
      return; // ignore disabled sizes
    }
    const sizesContainer = target.closest(".sizes");
    if (sizesContainer) {
      sizesContainer.querySelectorAll(".size").forEach((btn) => btn.classList.remove("selected"));
      target.classList.add("selected");
    }
  }

  // Swatch selection
  if (target.classList.contains("swatch")) {
    const swatchesContainer = target.closest(".swatches");
    if (swatchesContainer) {
      swatchesContainer.querySelectorAll(".swatch").forEach((btn) => btn.classList.remove("selected"));
      target.classList.add("selected");
    }
  }

  // Add to Cart
  if (target.classList.contains("add-to-cart")) {
    const card = target.closest(".card");
    if (!card) return;
    const sizeBtn = card.querySelector(".sizes .size.selected");
    const swatchBtn = card.querySelector(".swatches .swatch.selected");
    if (!sizeBtn || !swatchBtn) {
      target.textContent = "Select size & color";
      setTimeout(() => (target.textContent = "Add to Cart"), 1500);
      return;
    }
    // For now, just show confirmation text briefly
    target.textContent = `Added • EU ${sizeBtn.dataset.size}`;
    setTimeout(() => (target.textContent = "Add to Cart"), 1200);
    // Build cart item
    const title = card.querySelector("h3")?.textContent?.trim() || "Sneaker";
    const priceText = card.querySelector(".price-current")?.textContent?.replace(/[^0-9]/g, "");
    const price = Number(priceText) || 0;
    const image = card.querySelector("img")?.src || "";
    const color = swatchBtn.getAttribute("title") || "Color";
    const size = sizeBtn.dataset.size || "";
    cart.push({ title, price, image, color, size });
    saveCartToStorage();
    updateCartUI();
    showToast("Added to cart");
    // Open cart drawer after adding
    toggleCart(true);
  }
});

// Cart button interaction
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    updateCartUI();
    toggleCart(true);
  });
}

// Active link highlighting on scroll
const sectionsForNav = ["#home", "#shop", "#collections", "#contact"];
function setActiveLink() {
  let currentId = "#home";
  const scrollPos = window.scrollY + 120;
  sectionsForNav.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && el.offsetTop <= scrollPos) currentId = sel;
  });
  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    const isActive = href === currentId;
    a.setAttribute("aria-current", isActive ? "page" : "false");
  });
}
window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);

// Cart drawer logic
function toggleCart(open) {
  if (!cartDrawer || !cartOverlay) return;
  const shouldOpen = open ?? cartDrawer.classList.contains("open") === false;
  cartDrawer.hidden = !shouldOpen;
  cartOverlay.hidden = !shouldOpen;
  cartDrawer.classList.toggle("open", shouldOpen);
  cartOverlay.classList.toggle("open", shouldOpen);
  if (shouldOpen) {
    cartDrawer.focus?.();
  }
}

function renderCart() {
  if (!cartItemsEl || !cartTotalEl) return;
  loadCartFromStorage();
  updateCartBadge();
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalEl.textContent = 'Total: ₦0';
    return;
  }
  let total = 0;
  cartItemsEl.innerHTML = cart.map((item, idx) => {
    total += item.price;
    return `
      <div class="cart-item" data-idx="${idx}">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">EU ${item.size} • ${item.color} • ${formatCurrency(item.price)}</div>
        </div>
        <button class="btn-close" type="button" aria-label="Remove">✕</button>
      </div>
    `;
  }).join("");
  cartTotalEl.textContent = `Total: ${formatCurrency(total)}`;
}

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `₦${Math.round(n).toLocaleString()}`;
  }
}

// Remove item from cart
if (cartItemsEl) {
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-close');
    if (!btn) return;
    const itemEl = btn.closest('.cart-item');
    const idx = Number(itemEl?.dataset.idx);
    if (!Number.isFinite(idx)) return;
    cart.splice(idx, 1);
    saveCartToStorage();
    updateCartUI();
  });
}

// Overlay and close button
if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));
if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    console.log('Checkout button clicked');
    loadCartFromStorage();
    console.log('Cart contents:', cart);
    
    if (cart.length === 0) {
      showToast('Your cart is empty');
      console.log('Cart is empty, showing toast');
      return;
    }
    
    saveCartToStorage();
    console.log('Navigating to checkout page...');
    
    // Navigate to checkout page
    window.location.href = 'checkout.html';
  });
} else {
  console.log('Checkout button not found');
}

// Unified cart UI update
function updateCartUI() {
  loadCartFromStorage();
  updateCartBadge();
  renderCart();
}

// On page load and DOMContentLoaded, always update cart UI
window.addEventListener('DOMContentLoaded', updateCartUI);
updateCartUI();

// Search functionality
function performSearch(query) {
  if (!query || query.trim() === '') {
    showAllProducts();
    return;
  }

  const searchTerm = query.toLowerCase().trim();
  const allProductCards = document.querySelectorAll('.card');
  let visibleCount = 0;

  allProductCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
    const description = card.querySelector('.desc')?.textContent?.toLowerCase() || '';
    const sku = card.querySelector('.sku')?.textContent?.toLowerCase() || '';
    
    const matches = title.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   sku.includes(searchTerm);
    
    if (matches) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.3s ease';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show search results message
  showSearchResults(searchTerm, visibleCount);
}

function showAllProducts() {
  const allProductCards = document.querySelectorAll('.card');
  allProductCards.forEach(card => {
    card.style.display = 'block';
  });
  hideSearchResults();
}

function showSearchResults(searchTerm, count) {
  // Remove existing search message
  const existingMessage = document.querySelector('.search-results-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Add search results message
  const firstProductSection = document.querySelector('.products');
  if (firstProductSection) {
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.innerHTML = `
      <p>Search results for "<strong>${searchTerm}</strong>": ${count} product${count !== 1 ? 's' : ''} found</p>
      <button class="clear-search-btn" onclick="clearSearch()">Clear Search</button>
    `;
    firstProductSection.insertBefore(message, firstProductSection.firstChild);
  }
}

function hideSearchResults() {
  const existingMessage = document.querySelector('.search-results-message');
  if (existingMessage) {
    existingMessage.remove();
  }
}

function clearSearch() {
  showAllProducts();
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.value = '';
  }
}

function createSearchModal() {
  // Create search modal HTML
  const searchModal = document.createElement('div');
  searchModal.className = 'search-modal';
  searchModal.innerHTML = `
    <div class="search-modal-overlay"></div>
    <div class="search-modal-content">
      <div class="search-modal-header">
        <input type="text" class="search-input" placeholder="Search sneakers..." autocomplete="off">
        <button class="search-close-btn" aria-label="Close search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="search-suggestions">
        <p>Popular searches:</p>
        <div class="search-tags">
          <button class="search-tag" data-search="nike">Nike</button>
          <button class="search-tag" data-search="adidas">Adidas</button>
          <button class="search-tag" data-search="running">Running</button>
          <button class="search-tag" data-search="white">White</button>
          <button class="search-tag" data-search="black">Black</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(searchModal);
  return searchModal;
}

// Search button event listener
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    let searchModal = document.querySelector('.search-modal');
    
    if (!searchModal) {
      searchModal = createSearchModal();
      
      // Add event listeners
      const searchInput = searchModal.querySelector('.search-input');
      const closeBtn = searchModal.querySelector('.search-close-btn');
      const overlay = searchModal.querySelector('.search-modal-overlay');
      const searchTags = searchModal.querySelectorAll('.search-tag');
      
      // Search input functionality
      searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });
      
      // Enter key to search
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          searchModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      // Close modal
      const closeModal = () => {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      };
      
      closeBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);
      
      // Search tags
      searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
          const searchTerm = tag.getAttribute('data-search');
          searchInput.value = searchTerm;
          performSearch(searchTerm);
          closeModal();
        });
      });
      
      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
          closeModal();
        }
      });
    }
    
    // Show modal
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on input
    setTimeout(() => {
      const searchInput = searchModal.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  });
}

// Product Detail Modal Functionality
function createProductModal() {
  console.log('Creating product modal');
  
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div class="product-modal-content" style="
      background: white;
      border-radius: 12px;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    ">
      <button class="product-modal-close" style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #f5f5f5;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 10;
      ">×</button>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 400px;">
        <div style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; padding: 2rem;">
          <img id="modalProductImage" style="width: 100%; height: auto; max-height: 300px; object-fit: cover; border-radius: 8px;">
        </div>
        
        <div style="padding: 2rem;">
          <h2 id="modalProductTitle" style="margin-bottom: 1rem;"></h2>
          <div id="modalRating" style="margin-bottom: 1rem;"></div>
          <div id="modalPriceGroup" style="margin-bottom: 1rem;"></div>
          <div id="modalBadges" style="margin-bottom: 1rem;"></div>
          <p id="modalSku" style="color: #666; margin-bottom: 1rem;"></p>
          <p id="modalDescription" style="margin-bottom: 2rem;"></p>
          
          <div style="margin-bottom: 2rem;">
            <h4>Size</h4>
            <div id="modalSizes" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;"></div>
            
            <h4>Color</h4>
            <div id="modalColors" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;"></div>
          </div>
          
          <button id="modalAddToCart" style="
            width: 100%;
            padding: 1rem;
            background: #333;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
          ">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  console.log('Modal created and added to body:', modal);
  return modal;
}

function showProductModal(productCard) {
  console.log('showProductModal called with:', productCard);
  
  // Extract product data from the card
  const productData = {
    id: productCard.getAttribute('data-product'),
    title: productCard.querySelector('h3').textContent.trim(),
    image: productCard.querySelector('img').src,
    alt: productCard.querySelector('img').alt,
    rating: productCard.querySelector('.rating').innerHTML,
    priceGroup: productCard.querySelector('.price-group').innerHTML,
    badges: productCard.querySelector('.badges')?.innerHTML || '',
    sku: productCard.querySelector('.sku').textContent,
    description: productCard.querySelector('.desc').textContent,
    sizes: Array.from(productCard.querySelectorAll('.size')).map(size => ({
      value: size.getAttribute('data-size'),
      text: size.textContent,
      disabled: size.disabled
    })),
    colors: Array.from(productCard.querySelectorAll('.swatch')).map(swatch => ({
      title: swatch.getAttribute('title'),
      color: swatch.style.getPropertyValue('--sw')
    }))
  };

  // Create or get existing modal
  let modal = document.querySelector('.product-modal');
  if (!modal) {
    modal = createProductModal();
    
    // Add event listeners
    const closeBtn = modal.querySelector('.product-modal-close');
    const overlay = modal.querySelector('.product-modal-overlay');
    
    const closeModal = () => {
      modal.style.opacity = '0';
      document.body.style.overflow = '';
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Populate modal with product data
  modal.querySelector('#modalProductImage').src = productData.image;
  modal.querySelector('#modalProductImage').alt = productData.alt;
  modal.querySelector('#modalProductTitle').textContent = productData.title;
  modal.querySelector('#modalRating').innerHTML = productData.rating;
  modal.querySelector('#modalPriceGroup').innerHTML = productData.priceGroup;
  modal.querySelector('#modalBadges').innerHTML = productData.badges;
  modal.querySelector('#modalSku').textContent = productData.sku;
  modal.querySelector('#modalDescription').textContent = productData.description;

  // Populate sizes
  const sizesContainer = modal.querySelector('#modalSizes');
  sizesContainer.innerHTML = '';
  productData.sizes.forEach(size => {
    const sizeBtn = document.createElement('button');
    sizeBtn.className = 'modal-size-btn';
    sizeBtn.textContent = size.text;
    sizeBtn.setAttribute('data-size', size.value);
    if (size.disabled) sizeBtn.disabled = true;
    
    sizeBtn.addEventListener('click', () => {
      // Remove active class from all size buttons
      sizesContainer.querySelectorAll('.modal-size-btn').forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      sizeBtn.classList.add('active');
    });
    
    sizesContainer.appendChild(sizeBtn);
  });

  // Populate colors
  const colorsContainer = modal.querySelector('#modalColors');
  colorsContainer.innerHTML = '';
  productData.colors.forEach(color => {
    const colorBtn = document.createElement('button');
    colorBtn.className = 'modal-color-btn';
    colorBtn.setAttribute('title', color.title);
    colorBtn.style.setProperty('--color', color.color);
    
    colorBtn.addEventListener('click', () => {
      // Remove active class from all color buttons
      colorsContainer.querySelectorAll('.modal-color-btn').forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      colorBtn.classList.add('active');
    });
    
    colorsContainer.appendChild(colorBtn);
  });

  // Add to cart functionality
  const addToCartBtn = modal.querySelector('#modalAddToCart');
  addToCartBtn.onclick = () => {
    const selectedSize = sizesContainer.querySelector('.modal-size-btn.active')?.getAttribute('data-size');
    const selectedColor = colorsContainer.querySelector('.modal-color-btn.active')?.getAttribute('title');
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Add to cart with selected options
    const product = {
      id: productData.id,
      title: productData.title,
      price: productCard.querySelector('.price-current').textContent,
      image: productData.image,
      size: selectedSize,
      color: selectedColor || 'Default'
    };
    
    cart.push(product);
    saveCartToStorage();
    updateCartUI();
    showToast(`${product.title} added to cart`);
    
    // Close modal
    modal.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  };

  // Show modal
  console.log('Showing modal:', modal);
  modal.style.opacity = '1';
  document.body.style.overflow = 'hidden';
  console.log('Modal should now be visible');
}

// Add click event listeners to all product cards using event delegation
function initProductCardListeners() {
  console.log('Initializing product card listeners with event delegation');
  
  // Use event delegation to handle clicks on product cards
  document.addEventListener('click', (e) => {
    console.log('Document click detected:', e.target);
    
    // Check if clicked element is within a product card
    const card = e.target.closest('.card');
    if (!card) {
      console.log('Click not on a card');
      return;
    }
    
    console.log('Click detected on card:', card);
    
    // Don't trigger if clicking on buttons or interactive elements
    if (e.target.closest('button') || 
        e.target.closest('.size') || 
        e.target.closest('.swatch') ||
        e.target.closest('.add-to-cart')) {
      console.log('Clicked on interactive element, ignoring');
      return;
    }
    
    // Prevent default link behavior
    if (e.target.closest('.card-link')) {
      e.preventDefault();
      console.log('Prevented default link behavior');
    }
    
    console.log('Card clicked, showing modal for:', card);
    showProductModal(card);
  });
  
  console.log('Event delegation set up for product cards');
}

// Initialize product card listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', initProductCardListeners);

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductCardListeners);
} else {
  initProductCardListeners();
}

// Simple test modal function
window.testSimpleModal = function() {
  console.log('Creating simple test modal');
  
  // Create a simple modal for testing
  const testModal = document.createElement('div');
  testModal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 400px;">
        <h2>Test Modal</h2>
        <p>This is a test modal to check if modals work at all.</p>
        <button onclick="this.closest('div').parentElement.remove()">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(testModal);
  console.log('Test modal created and added to body');
};

// Test function for debugging modal
window.testProductModal = function() {
  const firstCard = document.querySelector('.card');
  if (firstCard) {
    console.log('Testing modal with first card:', firstCard);
    showProductModal(firstCard);
  } else {
    console.log('No product cards found');
  }
};

// Debug: Add a test item to cart for testing checkout (remove this in production)
console.log('Cart system initialized. Current cart:', cart);
console.log('To test checkout: Add items to cart first, then click the cart icon and checkout button.');
console.log('To test product modal, run: testProductModal() in console');
