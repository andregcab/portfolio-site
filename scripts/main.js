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

// Function to wrap each letter in a span
function wrapLetters(element) {
  const text = element.textContent;
  element.textContent = '';

  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.className = 'letter-spacing';
    span.style.animationDelay = `${index * 0.05}s`;
    element.appendChild(span);
  });
}

// Initialize hero animations
document.addEventListener('DOMContentLoaded', () => {
  // Wrap letters in the hero title lines
  document.querySelectorAll('.hero__title-line').forEach(wrapLetters);

  // Add hover effect to the entire name
  const nameLine = document.querySelector('.hero__title-line--name');
  if (nameLine) {
    nameLine.addEventListener('mouseenter', () => {
      nameLine
        .querySelectorAll('.letter-spacing')
        .forEach((letter) => {
          letter.style.letterSpacing = '0.1em';
        });
    });

    nameLine.addEventListener('mouseleave', () => {
      nameLine
        .querySelectorAll('.letter-spacing')
        .forEach((letter) => {
          letter.style.letterSpacing = '0';
        });
    });
  }
});
