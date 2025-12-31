// Centralized Content Configuration
// All website text content is stored here for easy management

const SiteContent = {
    // Company Information
    company: {
        name: "Allied Strategic Operations",
        tagline: "DELIVERING THE ADVANTAGE",
        description: "Mission-focused capabilities in training, cybersecurity, acquisition, and logistics for government and defense operations.",
        fullDescription: "Mission-focused services for government and commercial clients."
    },

    // Navigation
    nav: {
        home: "Home",
        services: "Services",
        partners: "Partners",
        contact: "Contact"
    },

    // Hero Section
    hero: {
        tagline: "DELIVERING THE ADVANTAGE",
        credibility: "Mission-focused capabilities in training, cybersecurity, acquisition, and logistics for government and defense operations.",
        cta: "Request Consultation"
    },

    // Services Section
    services: {
        title: "Capabilities",
        description: "Mission-aligned services supporting government agencies, prime contractors, and defense operations across critical domains.",
        intro: {
            mission: {
                title: "MISSION ALIGNMENT",
                description: "Solutions built around real operational needs."
            },
            excellence: {
                title: "OPERATIONAL EXCELLENCE",
                description: "Training, cybersecurity, and acquisition executed with precision."
            },
            trust: {
                title: "TRUST & ACCOUNTABILITY",
                description: "Clear communication, secure handling, and dependable delivery."
            }
        },
        items: [
            {
                title: "Training Services",
                description: "Operational readiness training for military and government personnel. Customized programs aligned with mission requirements.",
                link: "com/services/training-services.html"
            },
            {
                title: "Cybersecurity Solutions",
                description: "Defense infrastructure protection through risk assessment, threat analysis, security audits, and incident response capabilities.",
                link: "com/services/cybersecurity-solutions.html"
            },
            {
                title: "Acquisition Services",
                description: "Federal contracting support from proposal development through contract management and compliance oversight.",
                link: "com/services/acquisition-services.html"
            },
            {
                title: "Logistics & Supply Chain",
                description: "End-to-end logistics support for supply chain management, warehousing, distribution, and mission-critical transportation.",
                link: "com/services/logistics-supply-chain.html"
            },
            {
                title: "Government Contracts",
                description: "Federal contracting expertise in proposal development, regulatory compliance, and contract administration for defense and civilian agencies.",
                link: "com/services/government-contracts.html"
            },
            {
                title: "Clinical Lab Services & Setup",
                description: "Comprehensive laboratory setup, management, and testing services for government and defense healthcare operations.",
                link: "com/services/clinical-lab-services.html"
            }
        ]
    },

    // Affiliates/Partners Section
    affiliates: {
        title: "Strategic Partners",
        description: "Vetted technology, security, and professional services partners supporting mission requirements.",
        items: [
            {
                title: "Technology Solutions",
                description: "Technology solutions for enterprise and government applications.",
                link: "com/partners/technology-solutions.html"
            },
            {
                title: "Security Products",
                description: "Security products and services for critical infrastructure protection.",
                link: "com/partners/security-products.html"
            },
            {
                title: "Professional Services",
                description: "Professional services to complement your operational needs.",
                link: "com/partners/professional-services.html"
            }
        ]
    },

    // Blog/Insights Section
    blog: {
        title: "Insights & Updates",
        description: "Operational insights, industry analysis, and strategic perspectives on defense and government contracting.",
        viewAll: "View All Insights",
        items: [
            {
                date: "2024-01-15",
                category: "Cybersecurity",
                title: "Emerging Threats in Defense Infrastructure",
                excerpt: "Analysis of current cybersecurity threats facing defense contractors and government agencies, with recommendations for enhanced protection protocols."
            },
            {
                date: "2024-01-08",
                category: "Training",
                title: "Best Practices in Operational Training",
                excerpt: "Effective training methodologies for military and government personnel, focusing on mission-critical skill development and readiness standards."
            },
            {
                date: "2023-12-20",
                category: "Acquisition",
                title: "Navigating Federal Contract Requirements",
                excerpt: "Guidance on compliance, proposal development, and contract management for government contracting opportunities."
            }
        ]
    },

    // Leadership Section
    leadership: {
        title: "Leadership",
        description: "Our executive team brings extensive defense industry expertise and operational leadership. We deliver mission-critical solutions for government and commercial clients.",
        ceo: {
            name: "John Mitchell",
            position: "Chief Executive Officer",
            linkedin: "https://www.linkedin.com/in/john-mitchell"
        }
    },

    // Contact Section
    contact: {
        title: "Get Started",
        description: "Allied Strategic Operations supports government agencies, prime contractors, and commercial partners across training, cybersecurity, acquisition, and logistics functions. Use the form below to request information, initiate a discussion, or coordinate next steps with our team. Inquiries are reviewed by the appropriate subject-matter personnel to ensure accurate and timely response.",
        responseTime: "Response time: Within one business day.",
        urgent: "Urgent matters: Please contact our main line and request immediate assistance.",
        social: {
            title: "Official Channels",
            description: "External communication channels for official updates and professional networking."
        }
    },

    // Footer
    footer: {
        company: {
            name: "Allied Strategic Operations",
            tagline: "Mission-focused services for government and commercial clients."
        },
        quickLinks: {
            title: "Quick Links",
            items: [
                { text: "Home", link: "index.html#home" },
                { text: "Services", link: "index.html#services" },
                { text: "Partners", link: "index.html#affiliates" },
                { text: "Contact", link: "contact.html" }
            ]
        },
        services: {
            title: "Services",
            items: [
                { text: "Training", link: "com/services/training-services.html" },
                { text: "Cybersecurity", link: "com/services/cybersecurity-solutions.html" },
                { text: "Acquisition Support", link: "com/services/acquisition-services.html" },
                { text: "Logistics", link: "com/services/logistics-supply-chain.html" }
            ]
        },
        contact: {
            title: "Contact / Compliance",
            address: "1234 Defense Boulevard<br>Suite 500<br>Arlington, VA 22201",
            email: "info@alliedstrategicops.com",
            phone: "(703) 555-1234",
            responseTime: "Response time: within one business day.",
            disclaimer: "Capability information available upon request."
        },
        copyright: "Allied Strategic Operations. All rights reserved."
    },

    // Service Pages Content
    servicesPages: {
        training: {
            title: "Training Services",
            heroDescription: "Professional training programs to enhance operational readiness. Customized curriculum for government and commercial clients.",
            overview: "Allied Strategic Operations delivers training solutions that prepare organizations for mission-critical operations.",
            overviewDetail: "Our training programs combine real-world experience with proven methodologies to ensure operational readiness."
        },
        cybersecurity: {
            title: "Cybersecurity Solutions",
            heroDescription: "Comprehensive cybersecurity services protecting critical infrastructure and sensitive data.",
            overview: "Allied Strategic Operations provides advanced cybersecurity solutions for government and defense operations.",
            overviewDetail: "Our cybersecurity services protect critical infrastructure and sensitive data from evolving threats."
        },
        acquisition: {
            title: "Acquisition Services",
            heroDescription: "Expert support for federal contracting, proposal development, and contract management.",
            overview: "Allied Strategic Operations provides comprehensive acquisition support for government contractors.",
            overviewDetail: "Our acquisition services help organizations navigate complex federal contracting requirements."
        },
        logistics: {
            title: "Logistics & Supply Chain",
            heroDescription: "End-to-end logistics solutions for supply chain management and mission-critical transportation.",
            overview: "Allied Strategic Operations delivers comprehensive logistics and supply chain solutions.",
            overviewDetail: "Our logistics services ensure reliable supply chain operations for mission-critical requirements."
        },
        governmentContracts: {
            title: "Government Contracts",
            heroDescription: "Government contracting support including proposal writing, compliance management, and contract administration.",
            overview: "Allied Strategic Operations provides expert government contracting services.",
            overviewDetail: "Our government contracting expertise helps organizations succeed in federal procurement."
        },
        clinicalLab: {
            title: "Clinical Lab Services & Setup",
            heroDescription: "Comprehensive laboratory setup, management, and testing services for government and defense healthcare operations.",
            overview: "Allied Strategic Operations provides end-to-end clinical laboratory services, from facility design and setup to ongoing operations and compliance management.",
            overviewDetail: "Our clinical lab services support government healthcare facilities, military medical operations, and defense health programs. We deliver turnkey laboratory solutions that meet regulatory standards and operational requirements."
        }
    },

    // Partner Pages Content
    partnersPages: {
        technology: {
            title: "Technology Solutions",
            description: "Technology solutions for enterprise and government applications."
        },
        security: {
            title: "Security Products",
            description: "Security products and services for critical infrastructure protection."
        },
        professional: {
            title: "Professional Services",
            description: "Professional services to complement your operational needs."
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteContent;
}

