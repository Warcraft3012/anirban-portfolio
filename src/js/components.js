// src/js/components.js

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadExperience();
    initializeComponents();
    setupInteractiveElements();
    handleWindowResize();
});

function loadProjects() {
    fetch('../assets/data.json')
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.getElementById('projects-gallery');
            data.projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error loading projects:', error));
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project</a>
    `;
    return card;
}

function loadExperience() {
    fetch('../assets/data.json')
        .then(response => response.json())
        .then(data => {
            const experienceContainer = document.getElementById('experience-timeline');
            data.experience.forEach(job => {
                const jobEntry = createExperienceEntry(job);
                experienceContainer.appendChild(jobEntry);
            });
        })
        .catch(error => console.error('Error loading experience:', error));
}

function createExperienceEntry(job) {
    const entry = document.createElement('div');
    entry.className = 'experience-entry';
    entry.innerHTML = `
        <h4>${job.position} at ${job.company}</h4>
        <p>${job.duration}</p>
        <p>${job.description}</p>
    `;
    return entry;
}

// Component Management & Interactions

function initializeComponents() {
    setupProjectCards();
    setupSkillCards();
    setupEducationCards();
    setupTimelineItems();
    setupContactButtons();
}

function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('animate-glow');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('animate-glow');
        });
        
        // Create ripple effect on click
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

function setupSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Skill bar animation on view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillFill = entry.target.querySelector('.skill-fill');
                    if (skillFill) {
                        const width = skillFill.style.width;
                        skillFill.style.width = '0';
                        setTimeout(() => {
                            skillFill.style.animation = 'none';
                            skillFill.offsetHeight; // Trigger reflow
                            skillFill.style.animation = null;
                            skillFill.style.width = width;
                        }, 50);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
}

function setupEducationCards() {
    const eduCards = document.querySelectorAll('.edu-card');
    
    eduCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.12}s`;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('animate-pop-in');
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
}

function setupTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        
        item.addEventListener('mouseenter', function() {
            this.classList.add('animate-glow');
            this.querySelector('.timeline-content').style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('animate-glow');
            this.querySelector('.timeline-content').style.transform = 'translateY(0)';
        });
    });
}

function setupContactButtons() {
    const contactButtons = document.querySelectorAll('.contact-btn, .cta-button');
    
    contactButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('animate-glow');
            if (this.classList.contains('secondary')) {
                this.style.transform = 'scale(1.05) rotate(1deg)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('animate-glow');
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function setupInteractiveElements() {
    setupNavigation();
    setupScrollTransparency();
    setupLazyLoading();
    setupDynamicColors();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
                link.style.color = '#00ffcc';
                link.style.textShadow = '0 0 10px #00ffcc';
            } else {
                link.style.color = '#ffffff';
                link.style.textShadow = 'none';
            }
        });
    });
}

function setupScrollTransparency() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }, { passive: true });
}

function setupLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-lazy');
                }
                imageObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });
    
    lazyElements.forEach(element => {
        imageObserver.observe(element);
    });
}

function setupDynamicColors() {
    // Add dynamic color changing on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Optional: Change glow intensity based on scroll
        const glowIntensity = 0.3 + (scrollPercent / 100) * 0.4;
        document.documentElement.style.setProperty('--glow-intensity', glowIntensity);
    }, { passive: true });
}

function handleWindowResize() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        document.body.classList.add('resizing');
        
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resizing');
        }, 250);
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        console.log('Escape key pressed');
    }
    
    if (e.key === 'Tab') {
        // Tab navigation highlight
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Keyboard Navigation Styles
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus-visible {
        outline: 2px solid #00ffcc;
        outline-offset: 4px;
        border-radius: 4px;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 204, 0.6), rgba(0, 255, 204, 0));
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance Monitoring
function performanceMonitoring() {
    if (window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time: ' + pageLoadTime + 'ms');
        });
    }
}

performanceMonitoring();

// Network Status Detection
function setupNetworkStatus() {
    if (navigator.onLine) {
        console.log('Online');
    } else {
        console.log('Offline');
    }
    
    window.addEventListener('online', () => {
        console.log('Back online');
    });
    
    window.addEventListener('offline', () => {
        console.log('Gone offline');
    });
}

setupNetworkStatus();

// Scroll to Top Button
function setupScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

setupScrollToTop();

// Intersection Observer for animation triggers
function setupAnimationTriggers() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                entry.target.classList.add('animate-' + animation);
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        animationObserver.observe(element);
    });
}

setupAnimationTriggers();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupProjectCards,
        setupSkillCards,
        setupEducationCards,
        setupTimelineItems,
        setupContactButtons,
        createRipple,
        initializeComponents
    };
}