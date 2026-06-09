/* ==========================================================================
   Aether AI - Navigation JavaScript Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initStickyNavigation();
    initMobileNavigation();
    highlightActivePage();
});

/**
 * Handles sticky navigation and announcement bar scrolling behaviors.
 */
function initStickyNavigation() {
    const nav = document.querySelector('.nav-container');
    const announcementBar = document.querySelector('.announcement-bar');
    
    if (!nav) return;

    // Check if announcement bar exists (Home Page)
    if (announcementBar) {
        // Position initial nav below announcement bar
        nav.style.top = '36px';
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 36) {
                // Pin nav to absolute top
                nav.style.top = '0';
                nav.classList.add('shadow-sm');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                // Restore nav position below announcement bar
                nav.style.top = '36px';
                nav.classList.remove('shadow-sm');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    } else {
        // Other pages: sticky immediately from the top
        nav.style.top = '0';
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                nav.classList.add('shadow-sm');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                nav.classList.remove('shadow-sm');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    }
}

/**
 * Handles mobile hamburger menu drawer triggers and ARIA accessibility updates.
 */
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    
    if (!hamburger || !drawer || !overlay) return;

    // Accessibility attributes setup
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-drawer');
    drawer.setAttribute('id', 'mobile-drawer');

    function toggleMenu() {
        const isOpen = drawer.classList.contains('is-open');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeMenu() {
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Release background scroll
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Escape key closes mobile menu
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            closeMenu();
            hamburger.focus();
        }
    });
}

/**
 * Highlights the active page link in the navigation bars.
 */
function highlightActivePage() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase();
        
        // Extract base names (e.g. "about" from "about.html" or "about/")
        const linkBase = linkPath.replace('.html', '').replace('index', '');
        
        let isActive = false;
        
        if (linkBase === '') {
            // Home page match
            isActive = (currentPath === '/' || currentPath === '/index' || currentPath.endsWith('index.html') || currentPath === '' || currentPath.endsWith('/'));
        } else {
            // For other pages, check if the current URL path ends with the name (e.g., /about or /about.html)
            isActive = currentPath.endsWith(linkBase) || currentPath.endsWith(linkBase + '.html');
        }

        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
