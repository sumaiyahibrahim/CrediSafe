// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    
    // Update toggle button icon
    darkModeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Handle navigation active states
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Why Choose CrediSafe Section
document.addEventListener('DOMContentLoaded', () => {
    const specialtyCards = document.querySelectorAll('.specialty-card');
    const parallaxBackground = document.querySelector('.parallax-background');

    // Intersection Observer for card animations
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Start icon animations
                const specialty = entry.target.getAttribute('data-specialty');
                startIconAnimation(entry.target, specialty);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    // Observe each specialty card
    specialtyCards.forEach(card => {
        cardObserver.observe(card);
        
        // Add mouse move effect
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    });

    // Mouse move handler for parallax effect
    function handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Update glow position
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        
        // Calculate tilt
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) * 0.01;
        const rotateY = (centerX - e.clientX) * 0.01;
        
        // Apply transform with smooth transition
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
            scale(1.02)
        `;
    }

    // Mouse leave handler
    function handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'none';
    }

    // Start icon animations based on specialty
    function startIconAnimation(card, specialty) {
        const iconContainer = card.querySelector('.icon-container');
        
        switch(specialty) {
            case 'ai':
                animateAIScan(iconContainer);
                break;
            case 'blockchain':
                animateBlockchain(iconContainer);
                break;
            case 'instant':
                animateInstantVerification(iconContainer);
                break;
            case 'privacy':
                animatePrivacy(iconContainer);
                break;
            case 'compliance':
                animateCompliance(iconContainer);
                break;
            case 'web3':
                animateWeb3(iconContainer);
                break;
        }
    }

    // Specialty-specific animations
    function animateAIScan(container) {
        const scanEffect = container.querySelector('.scan-effect');
        scanEffect.style.animation = 'scanMove 2s infinite';
    }

    function animateBlockchain(container) {
        const networkEffect = container.querySelector('.network-effect');
        networkEffect.style.opacity = '1';
        networkEffect.style.animation = 'pulse 2s infinite';
    }

    function animateInstantVerification(container) {
        const connectEffect = container.querySelector('.connect-effect');
        connectEffect.style.opacity = '1';
        connectEffect.style.animation = 'pulse 1.5s infinite';
    }

    function animatePrivacy(container) {
        const rippleEffect = container.querySelector('.ripple-effect');
        rippleEffect.style.opacity = '1';
        rippleEffect.style.animation = 'ripple 2s infinite';
    }

    function animateCompliance(container) {
        const rotateEffect = container.querySelector('.rotate-effect');
        rotateEffect.style.opacity = '1';
        rotateEffect.style.animation = 'rotate 10s linear infinite';
    }

    function animateWeb3(container) {
        const pulseEffect = container.querySelector('.pulse-effect');
        pulseEffect.style.opacity = '1';
        pulseEffect.style.animation = 'pulse 2s infinite';
    }

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxRate = scrolled * 0.4;
        
        if (parallaxBackground) {
            parallaxBackground.style.transform = `translateY(${parallaxRate}px)`;
        }
    });

    // Create floating nodes animation
    function createFloatingNodes() {
        const nodesContainer = document.querySelector('.floating-nodes');
        const nodeCount = 20;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = `${Math.random() * 100}%`;
            node.style.top = `${Math.random() * 100}%`;
            node.style.animationDelay = `${Math.random() * 5}s`;
            node.style.animationDuration = `${5 + Math.random() * 10}s`;
            nodesContainer.appendChild(node);
        }
    }

    // Initialize floating nodes
    createFloatingNodes();
});

// Live Demo Section
document.addEventListener('DOMContentLoaded', () => {
    const methodCards = document.querySelectorAll('.method-card');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const verificationStatus = document.querySelector('.verification-status');

    // Method card selection
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            methodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const method = card.getAttribute('data-method');
            updateVerificationInterface(method);
        });
    });

    // File upload handling
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    function handleFileUpload(file) {
        // Show verification process
        verificationStatus.innerHTML = `
            <div class="status-circle">
                <div class="scan-line"></div>
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="status-text">Verifying document...</div>
            <div class="blockchain-nodes">
                <div class="node"></div>
                <div class="node"></div>
                <div class="node"></div>
            </div>
        `;

        // Simulate verification process
        setTimeout(() => {
            verificationStatus.innerHTML = `
                <div class="status-circle verified">
                    <i class="fas fa-check"></i>
                </div>
                <div class="status-text">Document Verified!</div>
                <div class="blockchain-nodes verified">
                    <div class="node"></div>
                    <div class="node"></div>
                    <div class="node"></div>
                </div>
            `;
        }, 3000);
    }

    function updateVerificationInterface(method) {
        switch(method) {
            case 'upload':
                // Show upload interface
                break;
            case 'id':
                // Show credential ID input
                break;
            case 'qr':
                // Show QR scanner
                break;
        }
    }
});

// Security & Compliance Section
const securityCards = document.querySelectorAll('.security-card');
securityCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const feature = card.getAttribute('data-feature');
        animateFeature(card, feature);
    });
});

function animateFeature(card, feature) {
    const icon = card.querySelector('.feature-icon');
    icon.classList.add(`${feature}-animation`);
    
    setTimeout(() => {
        icon.classList.remove(`${feature}-animation`);
    }, 2000);
}

// Testimonials Section
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    
    metrics.forEach(metric => {
        const target = parseFloat(metric.getAttribute('data-value'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateValue = () => {
            current = Math.min(current + increment, target);
            metric.textContent = current.toFixed(1);
            
            if (current < target) {
                requestAnimationFrame(updateValue);
            }
        };
        
        updateValue();
    });
}

// Initialize animations when sections are in view
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('success-metrics')) {
                animateMetrics();
            }
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Automatic testimonial carousel
const testimonialCarousel = document.querySelector('.testimonials-carousel');
const testimonials = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function nextTestimonial() {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
}

setInterval(nextTestimonial, 5000);

// Partner logo scroll
const logoScroll = document.querySelector('.logo-scroll');
if (logoScroll) {
    logoScroll.innerHTML += logoScroll.innerHTML; // Duplicate logos for infinite scroll
}

// How It Works Section
document.addEventListener('DOMContentLoaded', () => {
    const flowSteps = document.querySelectorAll('.flow-step');
    const floatingElements = document.querySelector('.floating-elements');
    
    // Create blockchain nodes
    function createNodes() {
        const blockchainNodes = document.querySelector('.blockchain-nodes');
        for (let i = 0; i < 20; i++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = `${Math.random() * 100}%`;
            node.style.top = `${Math.random() * 100}%`;
            node.style.animationDelay = `${Math.random() * 3}s`;
            blockchainNodes.appendChild(node);
        }
    }

    // Create glow particles
    function createParticles() {
        const glowParticles = document.querySelector('.glow-particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            glowParticles.appendChild(particle);
        }
    }

    // Initialize floating elements
    createNodes();
    createParticles();

    // Intersection Observer for step animations
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe each step
    flowSteps.forEach(step => {
        stepObserver.observe(step);
    });

    // Mouse move parallax effect
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const nodes = document.querySelectorAll('.node');
        const particles = document.querySelectorAll('.particle');
        
        nodes.forEach(node => {
            const moveX = (clientX - centerX) * 0.01;
            const moveY = (clientY - centerY) * 0.01;
            node.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        particles.forEach(particle => {
            const moveX = (clientX - centerX) * 0.02;
            const moveY = (clientY - centerY) * 0.02;
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Step hover effects
    flowSteps.forEach(step => {
        const icon = step.querySelector('.step-icon');
        const content = step.querySelector('.step-content');
        
        step.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1)';
            content.style.transform = 'translateY(-5px)';
        });

        step.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            content.style.transform = 'translateY(0)';
        });
    });

    // Share button click effects
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });
});
