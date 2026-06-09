/* ==========================================================================
   Aether AI - Form Validation and State Handler JavaScript Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initContactFormValidation();
    initNewsletterValidation();
});

/**
 * Validates the contact form on submission and keyup events.
 */
function initContactFormValidation() {
    const form = document.querySelector('form:not(.footer-newsletter-form)');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');

    // Attach real-time validation listeners
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            // If the field has error, validate dynamically to remove it as user types
            const parent = input.closest('.form-group');
            if (parent && parent.classList.contains('has-error')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formIsValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                formIsValid = false;
            }
        });

        if (formIsValid) {
            handleFormSubmitSuccess(form);
        }
    });
}

/**
 * Validates the footer newsletter subscription form.
 */
function initNewsletterValidation() {
    const form = document.querySelector('.footer-newsletter-form');
    if (!form) return;

    const emailInput = form.querySelector('.footer-newsletter-input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showSnackbar('Email address is required.', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showSnackbar('Please enter a valid email address.', 'error');
            return;
        }

        // Simulating success
        const btn = form.querySelector('.footer-newsletter-btn');
        const icon = btn.querySelector('.material-symbols-outlined');
        const originalIcon = icon.textContent;
        
        icon.textContent = 'progress_activity';
        icon.classList.add('animate-spin');
        btn.disabled = true;

        setTimeout(() => {
            icon.classList.remove('animate-spin');
            icon.textContent = 'check';
            showSnackbar('Thank you for subscribing!', 'success');
            form.reset();

            setTimeout(() => {
                icon.textContent = originalIcon;
                btn.disabled = false;
            }, 3000);
        }, 1200);
    });
}

/**
 * Validates an individual form field.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field 
 * @returns {boolean} Whether the field is valid or not.
 */
function validateField(field) {
    const parent = field.closest('.form-group');
    if (!parent) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // 1. Required Check
    // If the field is not a standard phone or optional field
    const label = parent.querySelector('.form-label');
    const labelText = label ? label.textContent.toLowerCase() : '';
    
    // We treat Phone Number as optional for validation unless explicitly required
    const isOptional = labelText.includes('phone') || labelText.includes('company');

    if (value === '' && !isOptional) {
        isValid = false;
        errorMessage = `${label ? label.textContent : 'Field'} is required.`;
    }

    // 2. Email Specific Check
    if (isValid && field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Toggle styling and messages
    if (!isValid) {
        parent.classList.add('has-error');
        let errorEl = parent.querySelector('.form-error-msg');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error-msg';
            parent.appendChild(errorEl);
        }
        errorEl.textContent = errorMessage;
    } else {
        parent.classList.remove('has-error');
        const errorEl = parent.querySelector('.form-error-msg');
        if (errorEl) {
            errorEl.remove();
        }
    }

    return isValid;
}

/**
 * Handles simulated successful submission for the contact form.
 * @param {HTMLFormElement} form 
 */
function handleFormSubmitSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const originalText = btn.innerHTML;
    
    // Loading State
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin" style="margin-right:8px;">progress_activity</span> Sending Request...';
    btn.disabled = true;

    // Simulate Network Request
    setTimeout(() => {
        // Success State
        btn.innerHTML = '<span class="material-symbols-outlined" style="margin-right:8px;">check_circle</span> Request Received';
        btn.style.backgroundColor = 'var(--color-deep-green)';
        
        showSnackbar('Request submitted successfully. Our units will contact you shortly.', 'success');
        form.reset();

        setTimeout(() => {
            // Restore Original Button
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = '';
        }, 3000);
    }, 1500);
}

/**
 * Creates and shows a temporary snackbar message for user actions.
 * @param {string} msg 
 * @param {'success'|'error'} type 
 */
function showSnackbar(msg, type) {
    // Check if a snackbar already exists
    let snack = document.querySelector('.snackbar');
    if (snack) snack.remove();

    snack = document.createElement('div');
    snack.className = `snackbar snackbar-${type}`;
    snack.style.position = 'fixed';
    snack.style.bottom = '24px';
    snack.style.left = '50%';
    snack.style.transform = 'translateX(-50%) translateY(100px)';
    snack.style.backgroundColor = type === 'success' ? 'var(--color-deep-green)' : 'var(--color-error)';
    snack.style.color = '#ffffff';
    snack.style.padding = '12px 24px';
    snack.style.borderRadius = 'var(--radius-pill)';
    snack.style.zIndex = '9999';
    snack.style.fontFamily = 'var(--font-body)';
    snack.style.fontSize = '14px';
    snack.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    snack.style.transition = 'transform var(--transition-normal)';
    
    const icon = type === 'success' ? 'check_circle' : 'error';
    snack.innerHTML = `<span class="material-symbols-outlined" style="margin-right:8px; font-size:18px;">${icon}</span> ${msg}`;
    
    document.body.appendChild(snack);
    
    // Animate In
    setTimeout(() => {
        snack.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    // Animate Out
    setTimeout(() => {
        snack.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            snack.remove();
        }, 300);
    }, 4000);
}
