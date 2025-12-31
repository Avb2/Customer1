// Content Loader Utility
// This script loads content from content.js and populates HTML elements
// You can use data-content attributes in HTML to specify which content to load

(function() {
    'use strict';

    // Helper function to get nested object property by path string
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current && current[prop], obj);
    }

    // Helper function to set text content
    function setTextContent(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && text !== undefined && text !== null) {
                element.textContent = text;
            }
        });
    }

    // Helper function to set HTML content
    function setHTMLContent(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && html !== undefined && html !== null) {
                element.innerHTML = html;
            }
        });
    }

    // Helper function to set attribute
    function setAttribute(selector, attr, value) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && value !== undefined && value !== null) {
                element.setAttribute(attr, value);
            }
        });
    }

    // Populate elements with data-content attributes
    function populateDataAttributes() {
        const elements = document.querySelectorAll('[data-content]');
        elements.forEach(element => {
            const contentPath = element.getAttribute('data-content');
            const value = getNestedValue(SiteContent, contentPath);
            
            if (value !== undefined && value !== null) {
                if (element.hasAttribute('data-content-html')) {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    // Wait for content.js to load and DOM to be ready
    function initContentLoader() {
        if (typeof SiteContent === 'undefined') {
            console.warn('SiteContent not found. Make sure content.js is loaded before content-loader.js');
            return;
        }

        // First, populate elements with data-content attributes (most flexible)
        populateDataAttributes();

        // Then populate specific elements by selector (for backward compatibility)
        // Hero section
        setTextContent('.hero-tagline', SiteContent.hero.tagline);
        setTextContent('.hero-credibility', SiteContent.hero.credibility);
        setTextContent('.btn-hero-cta', SiteContent.hero.cta);

        // Services section
        setTextContent('#services h2', SiteContent.services.title);
        setTextContent('#services .section-description', SiteContent.services.description);
        
        // Service intro grid
        setTextContent('.service-intro-item:nth-child(1) h3', SiteContent.services.intro.mission.title);
        setTextContent('.service-intro-item:nth-child(1) p', SiteContent.services.intro.mission.description);
        setTextContent('.service-intro-item:nth-child(2) h3', SiteContent.services.intro.excellence.title);
        setTextContent('.service-intro-item:nth-child(2) p', SiteContent.services.intro.excellence.description);
        setTextContent('.service-intro-item:nth-child(3) h3', SiteContent.services.intro.trust.title);
        setTextContent('.service-intro-item:nth-child(3) p', SiteContent.services.intro.trust.description);

        // Populate service cards dynamically
        const serviceCards = document.querySelectorAll('.product-card');
        SiteContent.services.items.forEach((service, index) => {
            if (serviceCards[index]) {
                const card = serviceCards[index];
                const titleEl = card.querySelector('h3');
                const descEl = card.querySelector('.product-description');
                const linkEl = card.querySelector('a.btn-primary');
                
                if (titleEl) titleEl.textContent = service.title;
                if (descEl) descEl.textContent = service.description;
                if (linkEl) linkEl.href = service.link;
            }
        });

        // Affiliates section
        setTextContent('#affiliates h2', SiteContent.affiliates.title);
        setTextContent('#affiliates .section-description', SiteContent.affiliates.description);

        // Blog section
        setTextContent('#blog h2', SiteContent.blog.title);
        setTextContent('#blog .section-description', SiteContent.blog.description);
        setTextContent('a[href="insights.html"]', SiteContent.blog.viewAll);

        // Leadership section
        setTextContent('#leadership h2', SiteContent.leadership.title);
        setTextContent('#leadership .leadership-text p', SiteContent.leadership.description);
        setTextContent('.leadership-name', SiteContent.leadership.ceo.name);
        setTextContent('.leadership-position', SiteContent.leadership.ceo.position);
        setAttribute('.leadership-linkedin', 'href', SiteContent.leadership.ceo.linkedin);

        // Contact section
        setTextContent('#contact h2', SiteContent.contact.title);
        setHTMLContent('#contact .section-description', SiteContent.contact.description);

        // Footer
        setTextContent('.footer-company-name', SiteContent.footer.company.name);
        setTextContent('.footer-tagline', SiteContent.footer.company.tagline);
        setHTMLContent('.footer-contact-info p:first-child', SiteContent.footer.contact.address);
        const emailLink = document.querySelector('.footer-contact-info p:nth-child(2) a');
        if (emailLink) {
            emailLink.href = `mailto:${SiteContent.footer.contact.email}`;
            emailLink.textContent = SiteContent.footer.contact.email;
        }
        const phoneLink = document.querySelector('.footer-contact-info p:nth-child(3) a');
        if (phoneLink) {
            phoneLink.href = `tel:${SiteContent.footer.contact.phone.replace(/\D/g, '')}`;
            phoneLink.textContent = SiteContent.footer.contact.phone;
        }
        setTextContent('.footer-contact-info p:nth-child(4)', SiteContent.footer.contact.responseTime);
        setTextContent('.footer-disclaimer', SiteContent.footer.contact.disclaimer);
        setTextContent('.footer-bottom p', `© ${new Date().getFullYear()} ${SiteContent.footer.copyright}`);

        // Populate navbar company name
        setTextContent('.navbar-company-name', SiteContent.company.name.toUpperCase());
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContentLoader);
    } else {
        initContentLoader();
    }

    // Export for manual use if needed
    window.ContentLoader = {
        reload: initContentLoader,
        getContent: function(path) {
            return getNestedValue(SiteContent, path);
        }
    };
})();

