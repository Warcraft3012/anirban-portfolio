// src/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    initWebsite();
    createHeroBackground();
    setupScrollAnimations();
    setupSmoothScroll();
    setupResumeDownload();
});

function initWebsite() {
    console.log('Portfolio initialized');
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
        }
    }, 2000);
}

function setupResumeDownload() {
    const resumeButtons = document.querySelectorAll('a[download]');
    
    resumeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Visual feedback
            this.classList.add('downloading');
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Downloading...</span>';
            
            // Reset after animation
            setTimeout(() => {
                this.classList.remove('downloading');
                this.classList.add('downloaded');
                this.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Downloaded!</span>';
                
                // Reset text after 2 seconds
                setTimeout(() => {
                    this.classList.remove('downloaded');
                    this.innerHTML = originalText;
                }, 2000);
            }, 500);
            
            // Track download event (optional - for analytics)
            trackEvent('resume_download', {
                filename: this.getAttribute('download'),
                timestamp: new Date().toISOString()
            });
        });
    });
}

function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
    // You can send this to analytics service like Google Analytics
    // Example: ga('send', 'event', 'downloads', 'resume', eventData);
}

function createHeroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create animated grid background
    let time = 0;
    
    function animate() {
        // Much darker and subtler background
        ctx.fillStyle = 'rgba(5, 8, 16, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Reduced grid opacity
        ctx.strokeStyle = `rgba(0, 255, 204, ${0.03 + Math.sin(time * 0.005) * 0.02})`;
        ctx.lineWidth = 1;
        
        // Draw grid lines - more subtle
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i + Math.sin(time * 0.005 + i * 0.01) * 5, 0);
            ctx.lineTo(i + Math.sin(time * 0.005 + i * 0.01) * 5, canvas.height);
            ctx.stroke();
        }
        
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i + Math.sin(time * 0.005 + i * 0.01) * 5);
            ctx.lineTo(canvas.width, i + Math.sin(time * 0.005 + i * 0.01) * 5);
            ctx.stroke();
        }
        
        // Reduced particle opacity and size
        ctx.fillStyle = `rgba(0, 255, 204, ${0.1 + Math.sin(time * 0.002) * 0.08})`;
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time * 0.0005 + i) * canvas.width / 2) + canvas.width / 2;
            const y = (Math.cos(time * 0.0003 + i) * canvas.height / 2) + canvas.height / 2;
            ctx.beginPath();
            ctx.arc(x, y, 1.5 + Math.sin(time * 0.01 + i) * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-card')) {
                    const fillBars = entry.target.querySelectorAll('.skill-fill');
                    fillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.skill-card, .project-card, .edu-card, .timeline-content').forEach(el => {
        observer.observe(el);
    });
}

function setupSmoothScroll() {
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
    
    // Add scroll position indicator
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 0 30px rgba(0, 255, 204, 0.4)';
        } else {
            header.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.3)';
        }
    });
}