// Portfolio Application JavaScript - Fixed Version
(function() {
    'use strict';
    
    class PortfolioApp {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
            this.navMenu = document.getElementById('navMenu');
            this.themeToggle = document.getElementById('themeToggle');
            this.contactForm = document.getElementById('contactForm');
            this.downloadResumeBtn = document.getElementById('downloadResume');
            
            this.currentSection = 'home';
            this.isScrolling = false;
            
            this.init();
        }

        init() {
            this.initTheme();
            this.bindEvents();
            this.initScrollAnimations();
            this.initIntersectionObserver();
            this.animateSkillBars();
            
            console.log('Portfolio application initialized successfully');
        }

        initTheme() {
            // Set default theme to light
            const savedTheme = 'light';
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            this.updateThemeToggle(savedTheme);
        }

        bindEvents() {
            // Theme toggle
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }

            // Mobile menu toggle
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }

            // Navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);
                    this.closeMobileMenu();
                });
            });

            // Contact form
            if (this.contactForm) {
                this.contactForm.addEventListener('submit', (e) => {
                    this.handleContactForm(e);
                });
            }

            // Download resume
            if (this.downloadResumeBtn) {
                this.downloadResumeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadResume();
                });
            }

            // Scroll events
            window.addEventListener('scroll', this.throttle(() => {
                this.handleScroll();
            }, 100));

            // Resize events
            window.addEventListener('resize', this.throttle(() => {
                this.handleResize();
            }, 250));

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Smooth scroll for all internal links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    if (targetId) {
                        this.scrollToSection(targetId);
                    }
                });
            });
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Toggling theme from', currentTheme, 'to', newTheme);
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            this.updateThemeToggle(newTheme);
            
            // Force a repaint to ensure theme changes are visible
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger a reflow
            document.body.style.display = '';
            
            // Show notification to confirm theme change
            this.showNotification(`Switched to ${newTheme} mode`, 'success');
        }

        updateThemeToggle(theme) {
            if (this.themeToggle) {
                this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
                this.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            }
        }

        toggleMobileMenu() {
            this.mobileMenuBtn.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        }

        closeMobileMenu() {
            this.mobileMenuBtn.classList.remove('active');
            this.navMenu.classList.remove('active');
        }

        scrollToSection(sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) return;

            const navbarHeight = this.navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight - 20;

            this.isScrolling = true;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Reset scrolling flag after animation
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }

        handleScroll() {
            if (this.isScrolling) return;

            // Update navbar appearance
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Update active navigation link
            this.updateActiveNavLink();
        }

        updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const navbarHeight = this.navbar.offsetHeight;
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSection = section.id;
                }
            });

            // Handle case where we're at the very top
            if (window.scrollY < 100) {
                currentSection = 'home';
            }

            if (currentSection && currentSection !== this.currentSection) {
                this.currentSection = currentSection;
                
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        }

        handleResize() {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }

        initScrollAnimations() {
            // Add fade-in class to elements that should animate
            const animateElements = document.querySelectorAll('.about-card, .highlight-item, .stat-card, .timeline-item, .skill-category, .project-card, .education-item, .certification-item, .contact-item');
            
            animateElements.forEach(element => {
                element.classList.add('fade-in');
            });
        }

        initIntersectionObserver() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Trigger skill bar animations when skills section is visible
                        if (entry.target.closest('#skills')) {
                            this.animateSkillBars();
                        }
                    }
                });
            }, observerOptions);

            // Observe fade-in elements
            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });

            // Observe sections for navigation updates
            document.querySelectorAll('section[id]').forEach(section => {
                observer.observe(section);
            });
        }

        animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            
            skillBars.forEach(bar => {
                const level = bar.dataset.level;
                const skillItem = bar.closest('.skill-item');
                
                // Only animate if the skill item is visible
                if (skillItem && skillItem.classList.contains('visible')) {
                    setTimeout(() => {
                        bar.style.setProperty('--target-width', level + '%');
                        bar.style.width = level + '%';
                        bar.classList.add('animate');
                    }, 300);
                }
            });
        }

        handleContactForm(e) {
            e.preventDefault();
            
            const formData = new FormData(this.contactForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            console.log('Form submitted with data:', formObject);

            // Basic form validation
            if (!this.validateContactForm(formObject)) {
                return;
            }

            // Show loading state
            const submitBtn = this.contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                this.showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                this.contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }

        validateContactForm(formData) {
            const { name, email, subject, message } = formData;
            
            if (!name || name.trim().length < 2) {
                this.showNotification('❌ Please enter a valid name (at least 2 characters).', 'error');
                return false;
            }
            
            if (!email || !this.isValidEmail(email)) {
                this.showNotification('❌ Please enter a valid email address.', 'error');
                return false;
            }
            
            if (!subject || subject.trim().length < 5) {
                this.showNotification('❌ Please enter a subject (at least 5 characters).', 'error');
                return false;
            }
            
            if (!message || message.trim().length < 10) {
                this.showNotification('❌ Please enter a message (at least 10 characters).', 'error');
                return false;
            }
            
            return true;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        downloadResume() {
            console.log('Download resume clicked');
            
            // Show notification with download information
            this.showNotification('📄 Resume download would be available here. Please contact me directly at vsdp1357@gmail.com for my latest resume.', 'info');
            
            // In a real implementation, you would trigger the download:
            // const link = document.createElement('a');
            // link.href = 'path/to/Sai_Durga_Pradeep_Veeramalla_Resume.pdf';
            // link.download = 'Sai_Durga_Pradeep_Veeramalla_Resume.pdf';
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
        }

        showNotification(message, type = 'info') {
            console.log('Showing notification:', message, type);
            
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => {
                notification.remove();
            });

            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            const bgColor = colors[type] || colors.info;

            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 10000;
                font-weight: 500;
                max-width: 400px;
                min-width: 300px;
                animation: slideInRight 0.3s ease-out;
                font-size: 14px;
                line-height: 1.4;
                font-family: var(--font-family-base);
                border: none;
                outline: none;
            `;

            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                float: right;
                margin-left: 12px;
                margin-top: -2px;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            `;
            
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
            });

            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.8';
            });

            const messageContainer = document.createElement('div');
            messageContainer.style.cssText = `
                padding-right: 24px;
                word-wrap: break-word;
            `;
            messageContainer.innerHTML = message;

            notification.appendChild(messageContainer);
            notification.appendChild(closeBtn);
            
            // Add CSS for animation if not already present
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);

            // Auto remove after 6 seconds
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => {
                        if (notification && notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 6000);
        }

        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        // Public methods for external access
        scrollTo(sectionId) {
            this.scrollToSection(sectionId);
        }

        notify(message, type) {
            this.showNotification(message, type);
        }
    }

    // Initialize the application
    let portfolioApp;

    function initializeApp() {
        console.log('Initializing portfolio app...');
        portfolioApp = new PortfolioApp();
        
        // Make app globally accessible for debugging
        window.portfolioApp = portfolioApp;
        
        // Add some demo interactions for better UX
        setTimeout(() => {
            addInteractiveFeatures();
        }, 1000);
        
        console.log('Portfolio app initialized');
    }

    function addInteractiveFeatures() {
        console.log('Adding interactive features...');
        
        // Add hover effects to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click effects to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple && ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });

        // Add ripple animation CSS if not already present
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add counter animation to stats
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(stat);
        });

        function animateCounter(element) {
            const target = element.textContent;
            const isNumeric = /^\d+\.?\d*$/.test(target);
            
            if (isNumeric) {
                const targetValue = parseFloat(target);
                const duration = 1500;
                const startTime = performance.now();
                
                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentValue = targetValue * progress;
                    
                    if (target.includes('.')) {
                        element.textContent = currentValue.toFixed(1);
                    } else {
                        element.textContent = Math.floor(currentValue);
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.textContent = target; // Ensure final value is exact
                    }
                };
                
                requestAnimationFrame(updateCounter);
            }
        }

        console.log('Interactive features added successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && portfolioApp) {
            // Re-animate skill bars when page becomes visible
            setTimeout(() => {
                portfolioApp.animateSkillBars();
            }, 300);
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (!portfolioApp) return;
        
        // Press 'h' to go to home
        if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey) {
            const activeElement = document.activeElement;
            if (!activeElement.matches('input, textarea, select')) {
                portfolioApp.scrollTo('home');
            }
        }
        
        // Press 'c' to go to contact
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.altKey) {
            const activeElement = document.activeElement;
            if (!activeElement.matches('input, textarea, select')) {
                portfolioApp.scrollTo('contact');
            }
        }
    });

})();