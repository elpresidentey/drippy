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
let cartCount = 0;
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
let cart = [];

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

// Ensure product images have graceful fallbacks (runs regardless of CTA presence)
const fallbackSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
      <rect width='100%' height='100%' fill='#e9e9e9'/>
      <rect x='60' y='200' width='680' height='200' rx='16' ry='16' fill='#d5d5d5'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Cabin, Arial, sans-serif' font-size='22' fill='#7a7a7a'>Image unavailable</text>
    </svg>`
  );
const fallbackSrc = `data:image/svg+xml;charset=utf-8,${fallbackSvg}`;

productGrids.forEach((grid) => {
  grid.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    if (!img.hasAttribute("referrerpolicy")) img.setAttribute("referrerpolicy", "no-referrer");

    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";
      img.src = fallbackSrc;
      img.classList.add("fallback");
      console.warn("Replaced failed product image with placeholder:", img);
    });
  });
});

// CTA scrolls smoothly to Shop section
if (shopBtn) {
  shopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector("#shop");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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

// Update cart count
function updateCart(delta) {
  cartCount = Math.max(0, cartCount + delta);
  if (cartBadge) cartBadge.textContent = String(cartCount);
}

// Hero slider: autoplay fade and change on hover
(function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;
  if (prefersReduced) return;
  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  if (slides.length < 2) return;

  let current = slides.findIndex((s) => s.classList.contains("active"));
  if (current < 0) current = 0;
  let timer = null;
  const intervalMs = 4000;

  const show = (idx) => {
    slides.forEach((s, i) => s.classList.toggle("active", i === idx));
    current = idx;
  };
  const next = () => show((current + 1) % slides.length);

  const start = () => {
    if (timer) return;
    timer = setInterval(next, intervalMs);
  };
  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  // Autoplay
  start();

  // Pause and change on hover
  slider.addEventListener("mouseenter", () => {
    stop();
    next();
  });
  slider.addEventListener("mouseleave", () => {
    start();
  });
})();

// Secondary CTA -> Collections
if (viewCollectionsBtn) {
  viewCollectionsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector("#collections");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Mobile menu toggle
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
      updateCart(1);
      showToast("Added to cart");
      // Build cart item
      const title = card.querySelector("h3")?.textContent?.trim() || "Sneaker";
      const priceText = card.querySelector(".price-current")?.textContent?.replace(/[^0-9]/g, "");
      const price = Number(priceText) || 0;
      const image = card.querySelector("img")?.src || "";
      const color = swatchBtn.getAttribute("title") || "Color";
      const size = sizeBtn.dataset.size || "";
      cart.push({ title, price, image, color, size });
      renderCart();
    }
});

// Cart button interaction
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    toggleCart(true);
  });
}

// Active link highlighting on scroll
const sections = ["#home", "#shop", "#collections", "#contact"]; 
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
function setActiveLink() {
  let currentId = "#home";
  const scrollPos = window.scrollY + 120;
  sections.forEach((sel) => {
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
    updateCart(-1);
    renderCart();
  });
}

// Overlay and close button
if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));
if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) { showToast('Your cart is empty'); return; }
  showToast('Checkout coming soon');
});

