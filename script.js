// Configuration - Update these with your actual values
const CONFIG = {
    // Replace with your Lambda function URL for form submission
    FORM_API_URL: 'https://your-lambda-url.execute-api.region.amazonaws.com/prod/submit-form',
    // Replace with your Stripe publishable key
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_publishable_key_here',
    // Replace with your PayPal client ID
    PAYPAL_CLIENT_ID: 'your_paypal_client_id_here'
};

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Initialize Stripe (only if key is provided)
let stripe = null;
let cardElement = null;
if (CONFIG.STRIPE_PUBLISHABLE_KEY && CONFIG.STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_publishable_key_here') {
    stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
}

// Navbar visibility on scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 100) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    }
    
    // Subtle parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero && currentScroll < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.backgroundPosition = `center ${20 + currentScroll * parallaxSpeed}%`;
    }
    
    lastScroll = currentScroll;
});

// Navigation Dropdowns
const servicesDropdownTrigger = document.getElementById('servicesDropdownTrigger');
const servicesDropdown = document.getElementById('servicesDropdown');
const servicesDropdownItem = servicesDropdownTrigger?.closest('.nav-item-dropdown');
const partnersDropdownTrigger = document.getElementById('partnersDropdownTrigger');
const partnersDropdown = document.getElementById('partnersDropdown');
const partnersDropdownItem = partnersDropdownTrigger?.closest('.nav-item-dropdown');
let servicesDropdownTimeout = null;
let partnersDropdownTimeout = null;
let isServicesDropdownOpen = false;
let isPartnersDropdownOpen = false;

function openServicesDropdown() {
    if (servicesDropdown && servicesDropdownTrigger) {
        servicesDropdown.classList.add('active');
        servicesDropdownTrigger.setAttribute('aria-expanded', 'true');
        isServicesDropdownOpen = true;
    }
}

function closeServicesDropdown() {
    if (servicesDropdown && servicesDropdownTrigger) {
        servicesDropdown.classList.remove('active');
        servicesDropdownTrigger.setAttribute('aria-expanded', 'false');
        isServicesDropdownOpen = false;
    }
}

function toggleServicesDropdown() {
    if (isServicesDropdownOpen) {
        closeServicesDropdown();
    } else {
        openServicesDropdown();
    }
}

function openPartnersDropdown() {
    if (partnersDropdown && partnersDropdownTrigger) {
        partnersDropdown.classList.add('active');
        partnersDropdownTrigger.setAttribute('aria-expanded', 'true');
        isPartnersDropdownOpen = true;
    }
}

function closePartnersDropdown() {
    if (partnersDropdown && partnersDropdownTrigger) {
        partnersDropdown.classList.remove('active');
        partnersDropdownTrigger.setAttribute('aria-expanded', 'false');
        isPartnersDropdownOpen = false;
    }
}

function togglePartnersDropdown() {
    if (isPartnersDropdownOpen) {
        closePartnersDropdown();
    } else {
        openPartnersDropdown();
    }
}

// Services Dropdown - Hover functionality (desktop)
if (servicesDropdownItem) {
    servicesDropdownItem.addEventListener('mouseenter', function() {
        clearTimeout(servicesDropdownTimeout);
        openServicesDropdown();
    });

    servicesDropdownItem.addEventListener('mouseleave', function() {
        servicesDropdownTimeout = setTimeout(() => {
            closeServicesDropdown();
        }, 150);
    });
}

// Services Dropdown - Click functionality (mobile and desktop)
if (servicesDropdownTrigger) {
    servicesDropdownTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleServicesDropdown();
    });
}

// Partners Dropdown - Hover functionality (desktop)
if (partnersDropdownItem) {
    partnersDropdownItem.addEventListener('mouseenter', function() {
        clearTimeout(partnersDropdownTimeout);
        openPartnersDropdown();
    });

    partnersDropdownItem.addEventListener('mouseleave', function() {
        partnersDropdownTimeout = setTimeout(() => {
            closePartnersDropdown();
        }, 150);
    });
}

// Partners Dropdown - Click functionality (mobile and desktop)
if (partnersDropdownTrigger) {
    partnersDropdownTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        togglePartnersDropdown();
    });
}

// Close on outside click
document.addEventListener('click', function(e) {
    if (servicesDropdownItem && !servicesDropdownItem.contains(e.target)) {
        closeServicesDropdown();
    }
    if (partnersDropdownItem && !partnersDropdownItem.contains(e.target)) {
        closePartnersDropdown();
    }
});

// Services Dropdown - Keyboard accessibility
if (servicesDropdownTrigger) {
    servicesDropdownTrigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleServicesDropdown();
        } else if (e.key === 'Escape' && isServicesDropdownOpen) {
            closeServicesDropdown();
            servicesDropdownTrigger.focus();
        }
    });
}

// Partners Dropdown - Keyboard accessibility
if (partnersDropdownTrigger) {
    partnersDropdownTrigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePartnersDropdown();
        } else if (e.key === 'Escape' && isPartnersDropdownOpen) {
            closePartnersDropdown();
            partnersDropdownTrigger.focus();
        }
    });
}

// Services Dropdown - Keyboard navigation and handle link clicks
if (servicesDropdown) {
    const servicesDropdownLinks = servicesDropdown.querySelectorAll('a');
    
    servicesDropdownLinks.forEach((link, index) => {
        // Handle keyboard navigation
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeServicesDropdown();
                servicesDropdownTrigger.focus();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = servicesDropdownLinks[index + 1] || servicesDropdownLinks[0];
                nextLink.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = servicesDropdownLinks[index - 1] || servicesDropdownLinks[servicesDropdownLinks.length - 1];
                prevLink.focus();
            }
        });
        
        // Handle click on "All Services" link
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#services') {
                e.preventDefault();
                closeServicesDropdown();
                setTimeout(() => {
                    const target = document.querySelector('#services');
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    });
}

// Partners Dropdown - Keyboard navigation and handle link clicks
if (partnersDropdown) {
    const partnersDropdownLinks = partnersDropdown.querySelectorAll('a');
    
    partnersDropdownLinks.forEach((link, index) => {
        // Handle keyboard navigation
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePartnersDropdown();
                partnersDropdownTrigger.focus();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = partnersDropdownLinks[index + 1] || partnersDropdownLinks[0];
                nextLink.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = partnersDropdownLinks[index - 1] || partnersDropdownLinks[partnersDropdownLinks.length - 1];
                prevLink.focus();
            }
        });
        
        // Handle click on "All Strategic Partners" link
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#affiliates') {
                e.preventDefault();
                closePartnersDropdown();
                setTimeout(() => {
                    const target = document.querySelector('#affiliates');
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip dropdown triggers
    if ((anchor.getAttribute('href') === '#affiliates' && anchor.id === 'partnersDropdownTrigger') ||
        (anchor.getAttribute('href') === '#services' && anchor.id === 'servicesDropdownTrigger')) {
        return;
    }
    
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

// Payment Modal Handling
const paymentModal = document.getElementById('paymentModal');
const buyButtons = document.querySelectorAll('.buy-btn');
const closeModal = document.querySelector('.close');
let currentProduct = null;
let currentPrice = null;

buyButtons.forEach(button => {
    button.addEventListener('click', function() {
        currentProduct = this.getAttribute('data-product');
        currentPrice = this.getAttribute('data-price');
        
        document.getElementById('selectedProduct').textContent = currentProduct;
        
        // Show/hide price info based on whether it's a paid service
        const priceInfo = document.getElementById('priceInfo');
        if (currentPrice && parseInt(currentPrice) > 0) {
            document.getElementById('selectedPrice').textContent = `$${(parseInt(currentPrice) / 100).toFixed(2)}`;
            priceInfo.style.display = 'block';
        } else {
            priceInfo.style.display = 'none';
        }
        
        paymentModal.style.display = 'block';
        document.getElementById('stripeForm').style.display = 'none';
    });
});

closeModal.addEventListener('click', function() {
    paymentModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Stripe Payment Handling
const stripeBtn = document.getElementById('stripeBtn');
const paypalBtn = document.getElementById('paypalBtn');
const stripeForm = document.getElementById('stripeForm');
const paymentForm = document.getElementById('payment-form');

stripeBtn.addEventListener('click', function() {
    if (!stripe) {
        alert('Stripe is not configured. Please add your Stripe publishable key.');
        return;
    }
    
    stripeForm.style.display = 'block';
    
    // Initialize Stripe Elements if not already done
    if (!cardElement) {
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        });
        cardElement.mount('#card-element');
        
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
});

paymentForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    if (!stripe || !cardElement) {
        alert('Stripe is not properly configured.');
        return;
    }
    
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        // Create payment intent on your backend (you'll need to create this endpoint)
        // For now, this is a placeholder - you'll need a backend endpoint to create payment intents
        const { error, paymentIntent } = await stripe.confirmCardPayment('client_secret_here', {
            payment_method: {
                card: cardElement,
            }
        });
        
        if (error) {
            document.getElementById('card-errors').textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            alert('Payment successful! Thank you for your purchase.');
            paymentModal.style.display = 'none';
            // Reset form
            paymentForm.reset();
        }
    } catch (err) {
        console.error('Payment error:', err);
        document.getElementById('card-errors').textContent = 'An error occurred. Please try again.';
        submitButton.disabled = false;
        submitButton.textContent = 'Pay Now';
    }
});

// PayPal Payment Handling
paypalBtn.addEventListener('click', function() {
    // Note: For full PayPal integration, you'll need to implement PayPal SDK
    // This is a placeholder - you'll need to integrate PayPal Checkout SDK
    alert('PayPal integration requires PayPal SDK setup. Please configure PayPal Checkout.');
    
    // Example PayPal integration would look like:
    // paypal.Buttons({
    //     createOrder: function(data, actions) {
    //         return actions.order.create({
    //             purchase_units: [{
    //                 amount: {
    //                     value: (parseInt(currentPrice) / 100).toFixed(2)
    //                 }
    //             }]
    //         });
    //     },
    //     onApprove: function(data, actions) {
    //         return actions.order.capture().then(function(details) {
    //             alert('Payment successful!');
    //             paymentModal.style.display = 'none';
    //         });
    //     }
    // }).render('#paypal-button-container');
});

// Enquiry Form Handling
const enquiryForm = document.getElementById('enquiryForm');
const formMessage = document.getElementById('formMessage');

enquiryForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const submitButton = enquiryForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Hide previous messages
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch(CONFIG.FORM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            formMessage.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            enquiryForm.reset();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Affiliate link tracking (optional - for analytics)
document.querySelectorAll('.affiliate-link').forEach(link => {
    link.addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('Affiliate link clicked:', this.href);
    });
});

