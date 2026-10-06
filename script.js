/**
 * DermaSkill Academy
 * Main Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    rootElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        rootElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.querySelector('.ds-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.ds-mobile-menu a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Simple animation for hamburger
        mobileMenuBtn.classList.toggle('is-active');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('is-active');
        });
    });

    // --- Sticky Header & Active Links ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section, #hero');
    const navLinks = document.querySelectorAll('.ds-nav-list a, .ds-mobile-nav-list a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Links
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const animOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counters if it's the academy section
                if (entry.target.classList.contains('ds-academy-content')) {
                    startCounters();
                }

                // Unobserve if we only want it to animate once
                // observer.unobserve(entry.target); 
            }
        });
    }, animOptions);

    const elementsToAnimate = document.querySelectorAll('.mask-reveal, .slide-up-fade, .scale-reveal, .course-slide-in, .node-anim');
    elementsToAnimate.forEach(el => animObserver.observe(el));

    // --- SVG Path Animation (Journey) ---
    const path = document.querySelector('.journey-path-line');
    if (path) {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength + ' ' + pathLength;
        path.style.strokeDashoffset = pathLength;

        window.addEventListener('scroll', () => {
            // Calculate scroll percentage for the journey section specifically
            const journeySection = document.getElementById('journey');
            if (!journeySection) return;
            
            const sectionRect = journeySection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight && sectionRect.bottom > 0) {
                const scrollPercentage = 1 - (sectionTop / windowHeight);
                // Map percentage to path
                let drawLength = pathLength * scrollPercentage;
                // Add some constraints
                if (drawLength < 0) drawLength = 0;
                if (drawLength > pathLength) drawLength = pathLength;
                
                path.style.strokeDashoffset = pathLength - drawLength;
            }
        });
    }

    // --- Animated Counters ---
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // --- Parallax Effect ---
    const parallaxObjs = document.querySelectorAll('.parallax-obj');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        parallaxObjs.forEach(obj => {
            const speed = obj.getAttribute('data-speed') || 0.05;
            const xOffset = (x - 0.5) * speed * 100;
            const yOffset = (y - 0.5) * speed * 100;
            
            // Keep the original float animation by adding to transform instead of completely overwriting it if possible,
            // but for simplicity we'll just apply transform here.
            obj.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseout', function(e) {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Simple Particle Generation for Hero ---
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            createParticle(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 3px and 8px
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
});
