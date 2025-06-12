// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80; // Height of fixed header
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

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target); // Stop observing once animation is triggered
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach((section) => {
  observer.observe(section);
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Add mobile menu functionality
const createMobileMenu = () => {
  const nav = document.querySelector('.nav');
  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.classList.add('mobile-menu-button');
  mobileMenuButton.setAttribute('aria-label', 'Toggle mobile menu');
  mobileMenuButton.innerHTML = `
        <span class="mobile-menu-icon"></span>
    `;

  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu');
  mobileMenu.innerHTML = nav.querySelector('.nav__links').outerHTML;

  nav.appendChild(mobileMenuButton);
  document.body.appendChild(mobileMenu);

  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuButton.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target)
    ) {
      mobileMenu.classList.remove('active');
      mobileMenuButton.classList.remove('active');
    }
  });
};

// Initialize mobile menu if screen width is small
if (window.innerWidth <= 768) {
  createMobileMenu();
}

// Update mobile menu on window resize
let mobileMenuInitialized = false;
window.addEventListener('resize', () => {
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
});

// Dynamic navigation
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav__links a');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;

    // Add/remove background based on scroll position
    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Update active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (
        currentScrollY >= sectionTop &&
        currentScrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Hide/show nav based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // Initial nav state
  updateNav();
});
