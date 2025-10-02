/**
 * Athlete Background Manager
 * Manages dynamic athlete background images for collection sections
 */

class AthleteBackgrounds {
  constructor() {
    this.athleteImages = {
      hottest: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Basketball player
        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Runner in motion
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3'  // Fitness athlete
      ],
      trending: [
        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Dynamic runner
        'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Street athlete
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3'  // Basketball action
      ],
      upcoming: [
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Futuristic athlete
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // High-tech sports
        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3'  // Performance athlete
      ],
      shop: [
        'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Street style athlete
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3', // Urban athlete
        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3'  // Active lifestyle
      ]
    };
    
    this.currentImages = {};
    this.rotationInterval = 15000; // 15 seconds
    this.init();
  }

  /**
   * Initialize athlete backgrounds
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupBackgrounds());
    } else {
      this.setupBackgrounds();
    }
  }

  /**
   * Setup background images for all sections
   */
  setupBackgrounds() {
    const sections = document.querySelectorAll('.products[id]');
    
    sections.forEach(section => {
      const sectionId = section.id;
      if (this.athleteImages[sectionId]) {
        this.setupSectionBackground(section, sectionId);
      }
    });

    // Start rotation timer
    this.startRotation();
  }

  /**
   * Setup background for individual section
   * @param {HTMLElement} section - Section element
   * @param {string} sectionId - Section identifier
   */
  setupSectionBackground(section, sectionId) {
    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'athlete-background-container';
    bgContainer.setAttribute('aria-hidden', 'true');
    
    // Create multiple background layers for smooth transitions
    const images = this.athleteImages[sectionId];
    images.forEach((imageUrl, index) => {
      const bgLayer = document.createElement('div');
      bgLayer.className = `athlete-background-layer ${index === 0 ? 'active' : ''}`;
      bgLayer.style.backgroundImage = `url(${imageUrl})`;
      bgContainer.appendChild(bgLayer);
    });

    // Insert background container as first child
    section.insertBefore(bgContainer, section.firstChild);
    
    // Store current image index
    this.currentImages[sectionId] = 0;
  }

  /**
   * Start background rotation
   */
  startRotation() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setInterval(() => {
      this.rotateBackgrounds();
    }, this.rotationInterval);
  }

  /**
   * Rotate background images
   */
  rotateBackgrounds() {
    Object.keys(this.athleteImages).forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const container = section.querySelector('.athlete-background-container');
      if (!container) return;

      const layers = container.querySelectorAll('.athlete-background-layer');
      const currentIndex = this.currentImages[sectionId];
      const nextIndex = (currentIndex + 1) % layers.length;

      // Fade out current layer
      layers[currentIndex].classList.remove('active');
      
      // Fade in next layer
      setTimeout(() => {
        layers[nextIndex].classList.add('active');
        this.currentImages[sectionId] = nextIndex;
      }, 500);
    });
  }

  /**
   * Preload athlete images for better performance
   */
  preloadImages() {
    Object.values(this.athleteImages).flat().forEach(imageUrl => {
      const img = new Image();
      img.src = imageUrl;
    });
  }

  /**
   * Update background for specific section
   * @param {string} sectionId - Section identifier
   * @param {string} imageUrl - New image URL
   */
  updateSectionBackground(sectionId, imageUrl) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const container = section.querySelector('.athlete-background-container');
    if (!container) return;

    // Add new image to rotation
    if (!this.athleteImages[sectionId].includes(imageUrl)) {
      this.athleteImages[sectionId].push(imageUrl);
      
      // Create new layer
      const bgLayer = document.createElement('div');
      bgLayer.className = 'athlete-background-layer';
      bgLayer.style.backgroundImage = `url(${imageUrl})`;
      container.appendChild(bgLayer);
    }
  }
}

// Add CSS for athlete backgrounds
const athleteCSS = `
.athlete-background-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.athlete-background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  filter: grayscale(20%) blur(0.5px);
}

.athlete-background-layer.active {
  opacity: 0.08;
}

/* Enhanced styling for sections with athlete backgrounds */
.products {
  position: relative;
  overflow: hidden;
}

.products .section-header {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.products .product-grid {
  position: relative;
  z-index: 1;
}

/* Subtle overlay for better contrast */
.products::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.02) 100%);
  z-index: 0;
  pointer-events: none;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .athlete-background-layer.active {
    opacity: 0.05;
    filter: grayscale(30%) blur(0.5px) brightness(0.8);
  }
  
  .products .section-header {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .athlete-background-layer {
    transition: none;
  }
  
  .products .section-header {
    backdrop-filter: none;
    background: #fff;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .athlete-background-layer.active {
    opacity: 0.05;
  }
  
  .products .section-header {
    padding: 1.5rem;
    backdrop-filter: blur(5px);
  }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = athleteCSS;
document.head.appendChild(style);

// Initialize athlete backgrounds
const athleteBackgrounds = new AthleteBackgrounds();

// Preload images for better performance
athleteBackgrounds.preloadImages();

// Export for global access
window.AthleteBackgrounds = AthleteBackgrounds;
window.athleteBackgrounds = athleteBackgrounds;