// Prevent scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Force scroll to top only on initial page load
window.addEventListener('load', () => {
  if (window.scrollY === 0) {
    window.scrollTo(0, 0);
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  });
});

// Optimize scroll performance with Intersection Observer
const observerOptions = {
  threshold: Array.from({ length: 20 }, (_, i) => i / 20), // More granular thresholds
  rootMargin: '-10% 0px',
};

// Track scroll position for smooth border updates
let scrollTimeout;
let lastScrollY = window.scrollY;

// Simple scroll handler for border animations
function handleScroll() {
  const sections = document.querySelectorAll('section:not(#home)');
  const viewportHeight = window.innerHeight;
  const shrinkStartDistance = 100; // Increased for smoother transition
  const triggerPoint = viewportHeight * 0.6; // Start animation when section is 60% up the viewport

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Calculate distance from trigger point to bottom of section
    const distanceFromTrigger = triggerPoint - rect.bottom;

    // Simple progress calculation
    let progress = 0;
    if (distanceFromTrigger >= 0) {
      // Section is at or below trigger point
      progress = 1;
    } else if (distanceFromTrigger >= -shrinkStartDistance) {
      // Section is within shrink zone
      progress =
        1 - Math.abs(distanceFromTrigger) / shrinkStartDistance;
    }

    // Debug logging
    console.log(
      'Section:',
      section.id,
      'Progress:',
      progress.toFixed(2),
      'Distance from trigger:',
      distanceFromTrigger.toFixed(2),
      'Trigger point:',
      triggerPoint.toFixed(2)
    );

    // Direct style update
    section.style.setProperty('--border-width', progress);

    // Handle fade-in
    if (rect.top < viewportHeight * 0.8) {
      section.classList.add('fade-in');
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';

      // Handle experience cards fade-in
      if (section.id === 'experience') {
        const experienceCards = section.querySelectorAll(
          '.experience-card'
        );
        experienceCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('fade-in');
          }, index * 200); // Stagger the animations
        });
      }
    } else if (rect.top > viewportHeight) {
      section.classList.remove('fade-in');
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';

      // Remove fade-in from experience cards when section is out of view
      if (section.id === 'experience') {
        const experienceCards = section.querySelectorAll(
          '.experience-card'
        );
        experienceCards.forEach((card) => {
          card.classList.remove('fade-in');
        });
      }
    }
  });
}

// Add scroll listener with throttling
let isScrolling;
window.addEventListener(
  'scroll',
  () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  },
  { passive: true }
);

// Initial call
handleScroll();

// Update on resize
window.addEventListener('resize', handleScroll, { passive: true });

// Update on load
window.addEventListener('load', handleScroll);

// Cache DOM queries
const sections = document.querySelectorAll('section:not(#home)');

// Mobile menu functionality
const createMobileMenu = () => {
  const nav = document.querySelector('.nav');
  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.classList.add('mobile-menu-button');
  mobileMenuButton.setAttribute('aria-label', 'Toggle mobile menu');
  mobileMenuButton.innerHTML = `<span class="mobile-menu-icon"></span>`;

  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu');
  mobileMenu.innerHTML = nav.querySelector('.nav__links').outerHTML;

  nav.appendChild(mobileMenuButton);
  document.body.appendChild(mobileMenu);

  // Use event delegation for better performance
  document.body.addEventListener('click', (e) => {
    if (
      e.target === mobileMenuButton ||
      mobileMenuButton.contains(e.target)
    ) {
      mobileMenu.classList.toggle('active');
      mobileMenuButton.classList.toggle('active');
    } else if (!mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
      mobileMenuButton.classList.remove('active');
    }
  });
};

// Initialize mobile menu if needed
if (window.innerWidth <= 768) {
  createMobileMenu();
}

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth <= 768 && !mobileMenuInitialized) {
      createMobileMenu();
      mobileMenuInitialized = true;
    } else if (window.innerWidth > 768 && mobileMenuInitialized) {
      const mobileMenu = document.querySelector('.mobile-menu');
      const mobileMenuButton = document.querySelector(
        '.mobile-menu-button'
      );
      if (mobileMenu) mobileMenu.remove();
      if (mobileMenuButton) mobileMenuButton.remove();
      mobileMenuInitialized = false;
    }
  }, 100);
});

// Handle hero animations
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');

  // Ensure hero animations play smoothly
  requestAnimationFrame(() => {
    hero.style.opacity = '0';
    hero.style.animation = 'none';
    hero.offsetHeight; // Trigger reflow
    hero.style.animation = null;
  });
});
