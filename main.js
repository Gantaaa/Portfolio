/**
 * Gantamir Gankhuyag Portfolio
 * Main JavaScript file
 */

// ==========================================================================
// DOM Elements
// ==========================================================================

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// ==========================================================================
// Mobile Navigation
// ==========================================================================

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = navLinks.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    navLinks.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

// Event Listeners for mobile menu
mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

// ==========================================================================
// Scroll Effects
// ==========================================================================

/**
 * Handle navbar background on scroll
 */
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(handleNavbarScroll);
});

// ==========================================================================
// Scroll Animations (Intersection Observer)
// ==========================================================================

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
// Smooth Scrolling
// ==========================================================================

/**
 * Initialize smooth scrolling for anchor links
 * Provides fallback for browsers that don't support CSS scroll-behavior
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// Active Navigation Link
// ==========================================================================

/**
 * Highlight active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = navbar.offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll listener for active nav
let activeNavTimeout;
window.addEventListener('scroll', () => {
    if (activeNavTimeout) {
        window.cancelAnimationFrame(activeNavTimeout);
    }
    activeNavTimeout = window.requestAnimationFrame(updateActiveNavLink);
});

// ==========================================================================
// Typing Effect (Optional Enhancement)
// ==========================================================================

/**
 * Simple typing effect for hero text
 * Uncomment to enable
 */
/*
function initTypingEffect() {
    const text = "Building intelligent systems";
    const element = document.querySelector('.hero-subtitle');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    
    element.textContent = '';
    type();
}
*/

// ==========================================================================
// Performance: Prefers Reduced Motion
// ==========================================================================

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Disable animations for users who prefer reduced motion
 */
function handleReducedMotion() {
    if (prefersReducedMotion()) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }
}

// ==========================================================================
// Initialize
// ==========================================================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    handleNavbarScroll(); // Set initial state
    initScrollAnimations();
    initSmoothScrolling();
    updateActiveNavLink();
    handleReducedMotion();
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Log initialization complete (remove in production)
console.log('Portfolio initialized successfully! 🚀');