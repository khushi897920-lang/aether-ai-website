/* ==========================================================================
   Aether AI - Form Validation and State Handler JavaScript Module
   ========================================================================== */

const WEB3FORMS_ACCESS_KEY = 'b447b4be-743a-4c6d-bf28-a9cc1f01115a';
const DESTINATION_EMAIL = 'aiaether92@gmail.com';

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

        // Simulating success & sending to destination email
        const btn = form.querySelector('.footer-newsletter-btn');
        const icon = btn.querySelector('.material-symbols-outlined');
        const originalIcon = icon.textContent;
        
        icon.textContent = 'progress_activity';
        icon.classList.add('animate-spin');
        btn.disabled = true;

        // Send newsletter subscriber to Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: 'New Newsletter Subscription - Aether AI',
                from_name: 'Aether AI Website',
                email: email,
                timestamp: new Date().toLocaleString()
            })
        }).catch(() => {
            // Silently handle if offline or blocked
        }).finally(() => {
            icon.classList.remove('animate-spin');
            icon.textContent = 'check';
            showSnackbar('Thank you for subscribing!', 'success');
            form.reset();

            setTimeout(() => {
                icon.textContent = originalIcon;
                btn.disabled = false;
            }, 3000);
        });
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
 * Handles submission for the contact form, sending data to the destination email via Web3Forms.
 * @param {HTMLFormElement} form 
 */
function handleFormSubmitSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const originalText = btn.innerHTML;
    
    // Loading State
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin" style="margin-right:8px;">progress_activity</span> Sending Request...';
    btn.disabled = true;

    // Gather form payload
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
        payload[key] = value;
    });

    payload['access_key'] = WEB3FORMS_ACCESS_KEY;
    payload['from_name'] = 'Aether AI Enterprise Portal';
    payload['subject'] = `New Customer Inquiry: ${payload.subject || 'Enterprise'} (${payload.name || 'Anonymous'})`;
    payload['timestamp'] = new Date().toLocaleString();

    // Send to destination email via Web3Forms API
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        const data = await response.json();
        if (response.status === 200 && data.success) {
            // Success State
            btn.innerHTML = '<span class="material-symbols-outlined" style="margin-right:8px;">check_circle</span> Request Received';
            btn.style.backgroundColor = 'var(--color-deep-green)';
            
            showSnackbar('Inquiry sent successfully! Our team will contact you shortly.', 'success');
            form.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
            }, 3500);
        } else {
            throw new Error(data.message || 'Web3Forms submission failed');
        }
    })
    .catch(err => {
        console.warn('Web3Forms submission issue, activating mailto fallback:', err);
        
        // Graceful fallback to mailto dispatch so customer message is never lost
        const subjectEnc = encodeURIComponent(`[Aether AI Contact] ${payload.subject || 'Enterprise Implementation'}`);
        const bodyEnc = encodeURIComponent(
            `Name: ${payload.name || 'N/A'}\n` +
            `Company: ${payload.company || 'N/A'}\n` +
            `Email: ${payload.email || 'N/A'}\n` +
            `Phone: ${payload.phone || 'N/A'}\n\n` +
            `Message:\n${payload.message || ''}\n`
        );
        
        window.location.href = `mailto:${DESTINATION_EMAIL}?subject=${subjectEnc}&body=${bodyEnc}`;

        btn.innerHTML = '<span class="material-symbols-outlined" style="margin-right:8px;">check_circle</span> Mail Client Opened';
        btn.style.backgroundColor = 'var(--color-deep-green)';
        showSnackbar(`Opening email client to reach ${DESTINATION_EMAIL}`, 'success');
        form.reset();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = '';
        }, 3500);
    });
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
