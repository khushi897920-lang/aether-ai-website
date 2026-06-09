/* ==========================================================================
   Aether AI - Animations and Scroll Entry JavaScript Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFaqAccordion();
});

/**
 * Implements subtle scroll entry animations using IntersectionObserver.
 * Adheres to prefers-reduced-motion.
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Define animation elements
    const animateElements = document.querySelectorAll('section, .capability-card, .service-card, .dark-feature-card, .leader-node, .location-card');
    
    // Add initial entry classes
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity var(--transition-slow), transform var(--transition-slow)';
    });

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Triggers when 10% of element is visible
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
                // Once animated, stop observing
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        animationObserver.observe(el);
    });
}

/**
 * Handles Services Page FAQ Accordion open/close transitions and accessibility.
 */
function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    
    faqTriggers.forEach(trigger => {
        const item = trigger.closest('.faq-item');
        const panel = item.querySelector('.faq-panel');
        
        // Setup initial accessibility states
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-active');
            
            // Close all other accordion items first (optional, but creates clean UX)
            const activeItems = document.querySelectorAll('.faq-item.is-active');
            activeItems.forEach(activeItem => {
                if (activeItem !== item) {
                    const activeTrigger = activeItem.querySelector('.faq-trigger');
                    const activePanel = activeItem.querySelector('.faq-panel');
                    activeItem.classList.remove('is-active');
                    activeTrigger.setAttribute('aria-expanded', 'false');
                    activePanel.setAttribute('aria-hidden', 'true');
                    activePanel.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('is-active');
                trigger.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.style.maxHeight = null;
            } else {
                item.classList.add('is-active');
                trigger.setAttribute('aria-expanded', 'true');
                panel.setAttribute('aria-hidden', 'false');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}
