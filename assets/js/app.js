document.addEventListener('DOMContentLoaded', function () {
    // Form handling
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const consentCheckbox = document.getElementById('consent');

    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // IntersectionObserver to reveal sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade sections for reveal animation
    document.querySelectorAll('.fade-section').forEach(section => {
        revealObserver.observe(section);
    });

    // Form validation and submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const consent = consentCheckbox.checked;

        // Clear previous error states
        clearFormErrors();

        // Validate form
        let isValid = true;

        if (!name) {
            showFieldError(nameInput, 'Name is required');
            isValid = false;
        }

        if (!email) {
            showFieldError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!phone) {
            showFieldError(phoneInput, 'Phone number is required');
            isValid = false;
        }

        if (!consent) {
            showFieldError(consentCheckbox, 'You must agree to be contacted');
            isValid = false;
        }

        if (isValid) {
            // Create mailto link
            const subject = 'Frupical Fruit Delivery Inquiry';
            const body = createEmailBody(name, email, phone);
            const mailtoLink = `mailto:contact@frupical.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Show success message
            showSuccessMessage();

            // Open email client
            window.location.href = mailtoLink;

            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
                hideSuccessMessage();
            }, 3000);
        }
    });

    // Real-time validation
    nameInput.addEventListener('blur', function () {
        if (!this.value.trim()) {
            showFieldError(this, 'Name is required');
        } else {
            clearFieldError(this);
        }
    });

    emailInput.addEventListener('blur', function () {
        const email = this.value.trim();
        if (!email) {
            showFieldError(this, 'Email is required');
        } else if (!isValidEmail(email)) {
            showFieldError(this, 'Please enter a valid email address');
        } else {
            clearFieldError(this);
        }
    });

    phoneInput.addEventListener('blur', function () {
        if (!this.value.trim()) {
            showFieldError(this, 'Phone number is required');
        } else {
            clearFieldError(this);
        }
    });

    consentCheckbox.addEventListener('change', function () {
        if (!this.checked) {
            showFieldError(this, 'You must agree to be contacted');
        } else {
            clearFieldError(this);
        }
    });

    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);

        // Add error class to field
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-4)';
        errorElement.style.animation = 'fadeIn 0.3s ease';

        // Insert error message after the field or checkbox label
        if (field.type === 'checkbox') {
            const checkboxLabel = field.closest('.checkbox-label');
            checkboxLabel.parentNode.insertBefore(errorElement, checkboxLabel.nextSibling);
        } else {
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message') ||
            (field.type === 'checkbox' ? field.closest('.checkbox-label').parentNode.querySelector('.error-message') : null);
        if (errorElement) {
            errorElement.remove();
        }
    }

    function clearFormErrors() {
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());

        const errorFields = contactForm.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    function createEmailBody(name, email, phone) {
        return `Hello Frupical Team,

I am interested in your premium fruit delivery service and would like to learn more about your offerings.

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

I have consented to be contacted regarding Frupical's fruit delivery services.

Please reach out to me to discuss:
- Available fruit selections
- Delivery schedules and areas
- Pricing and subscription options
- Any current promotions or offers

Thank you for your time, and I look forward to hearing from you soon!

Best regards,
${name}

---
This inquiry was submitted through the Frupical website contact form.`;
    }

    function showSuccessMessage() {
        // Create success message
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `
            <div style="
                background: rgba(33, 128, 141, 0.1);
                border: 1px solid var(--color-success);
                color: var(--color-success);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin-top: var(--space-16);
                text-align: center;
                font-weight: var(--font-weight-medium);
                animation: slideUp 0.5s ease;
            ">
                ✓ Success! Your default email client will open with your inquiry pre-filled.
            </div>
        `;

        contactForm.appendChild(successElement);
    }

    function hideSuccessMessage() {
        const successMessage = contactForm.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }
    }

    // Add error styles to form controls
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error,
        .checkbox-label input[type="checkbox"].error + .checkbox-custom {
            border-color: var(--color-error) !important;
            box-shadow: 0 0 0 3px rgba(192, 21, 47, 0.1) !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Add loading state to submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    contactForm.addEventListener('submit', function () {
        submitButton.textContent = 'Opening Email Client...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    });

    // Remove unused hover and parallax effects from the previous design
});