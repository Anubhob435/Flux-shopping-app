document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
        });
    });

    // Animate emoji on hover
    const emoji = document.querySelector('.emoji');
    if (emoji) {
        emoji.addEventListener('mouseover', () => {
            emoji.style.animation = 'none';
            void emoji.offsetWidth; // Trigger reflow
            emoji.style.animation = 'bounce 2s infinite';
        });
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Animate features on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const fadeInElements = document.querySelectorAll('.category-card, .feature-card');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        fadeInObserver.observe(element);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content') && nav.classList.contains('show')) {
            nav.classList.remove('show');
        }
    });

    // Add scroll class to header
    const header = document.querySelector('.nav-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        document.body.classList.toggle('nav-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        }
    });

    // Smooth scroll for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu when clicking a link
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Category tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const trendingCards = document.querySelectorAll('.trending-card');
    
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter trending cards based on category
            trendingCards.forEach(function(card) {
                if (category === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else if (card.dataset.category && card.dataset.category.includes(category)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Animation for sections on scroll
    const animatedElements = document.querySelectorAll('.category-card, .trending-card, .feature-card, .testimonial-card');
    
    function checkScroll() {
        animatedElements.forEach(function(element) {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (position < windowHeight * 0.9) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Check positions on load
    setTimeout(checkScroll, 100);
    
    // Check positions on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    const searchInput = searchBox.querySelector('input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (searchInput.value.trim() !== '') {
            // For demo purposes, we'll just show an alert
            alert('Search for: ' + searchInput.value);
        }
    });
    
    searchBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            // For demo purposes, we'll just show an alert
            alert('Search for: ' + searchInput.value);
        }
    });
    
    // Add hover effects for category and feature cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Set random card animations
    function setRandomAnimationDelays() {
        document.querySelectorAll('.category-card, .trending-card, .feature-card').forEach(function(card) {
            const randomDelay = Math.random() * 0.5;
            card.style.animationDelay = randomDelay + 's';
        });
    }
    
    setRandomAnimationDelays();
    
    // For demo purposes: Show/hide notification
    function showNotification(message) {
        // Create notification if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Add styles 
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.background = 'var(--primary)';
            notification.style.color = 'white';
            notification.style.padding = '12px 20px';
            notification.style.borderRadius = '8px';
            notification.style.boxShadow = 'var(--shadow-lg)';
            notification.style.transform = 'translateX(150%)';
            notification.style.transition = 'transform 0.3s ease';
            notification.style.zIndex = '1000';
            notification.style.maxWidth = '300px';
        }
        
        notification.textContent = message;
        notification.style.transform = 'translateX(0)';
        
        setTimeout(function() {
            notification.style.transform = 'translateX(150%)';
        }, 3000);
    }
    
    // Demo: Show notification when clicking "Get Access" buttons
    document.querySelectorAll('.card-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const cardTitle = this.closest('.trending-card').querySelector('h3').textContent;
            showNotification(`You now have access to ${cardTitle}`);
        });
    });

    // Add parallax effect to hero section
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(function(shape, index) {
                const speed = 0.03 + (index * 0.01);
                const x = (window.innerWidth - mouseX * speed) / 100;
                const y = (window.innerHeight - mouseY * speed) / 100;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    });
});
