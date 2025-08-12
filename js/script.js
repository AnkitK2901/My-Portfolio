document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const body = document.body;
    const imageCarousel = document.querySelector('.image-carousel');
    const lockScreen = document.getElementById('lockScreen');
    const skeletonLoader = document.getElementById('skeletonLoader');
    const enterButton = document.getElementById('enterButton');
    const mainContent = document.getElementById('mainContent');
    const timeDisplay = document.getElementById('timeDisplay');
    const secondsDisplay = document.getElementById('secondsDisplay');
    const ampmDisplay = document.getElementById('ampmDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const greetingEl = document.getElementById('greeting-message');
    const taglineEl = document.getElementById('tagline-message');
    const themeSwitcher = document.getElementById('theme-switcher');
    const homeLogo = document.getElementById('home-logo');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    const paySlipDemoButton = document.getElementById('payslip-demo-btn');
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modal = document.getElementById('custom-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const backToTopButton = document.getElementById('back-to-top');
    const header = document.querySelector('#mainContent header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#menu a');
    const triggers = document.querySelectorAll('.scroll-trigger');
    const menuLinks = menu.querySelectorAll('a');

    // --- Custom Modal Logic ---
    function showModal() {
        if (modalOverlay && modal) {
            modalOverlay.classList.remove('hidden');
            modal.classList.remove('hidden');
        }
    }

    function hideModal() {
        if (modalOverlay && modal) {
            modalOverlay.classList.add('hidden');
            modal.classList.add('hidden');
        }
    }

    if (paySlipDemoButton) {
        paySlipDemoButton.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    }
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    if (modalOverlay) modalOverlay.addEventListener('click', hideModal);

    // --- Tab Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tabContent => tabContent.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (target) target.classList.add('active');
        });
    });

    // --- Animation & State Variables ---
    let animationLoopActive = true;
    let currentAnimationId = 0;

    // --- Mobile Specific Logic ---
    if (window.innerWidth < 768 || "ontouchstart" in window) {
        const enterText = document.querySelector(".enter-text");
        if (enterText) enterText.remove();
    }

    // --- Asset & Helper Functions ---
    function preloadImages(urls, callback) {
        let loadedCount = 0;
        const totalImages = urls.length;
        if (totalImages === 0) {
            if (callback) callback();
            return;
        }
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages && callback) {
                    callback();
                }
            };
        });
    }

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    // --- Lock Screen Animation Loop ---
    const taglineText = "Welcome to my portfolio website! Curious to explore and learn more about me?";

    async function typeAndErase(element, text, id) {
        for (let i = 0; i <= text.length; i++) {
            if (id !== currentAnimationId || !animationLoopActive) return;
            element.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
            await delay(60);
        }
        if (id !== currentAnimationId) return;
        await delay(2500);
        for (let i = text.length; i >= 0; i--) {
            if (id !== currentAnimationId || !animationLoopActive) return;
            element.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
            await delay(30);
        }
    }

    async function animationLoop(id) {
        while (animationLoopActive) {
            if (id !== currentAnimationId) return;
            const hour = new Date().getHours();
            let greetingText;
            if (hour < 12) greetingText = "Good Morning !";
            else if (hour < 18) greetingText = "Good Afternoon !";
            else greetingText = "Good Evening !";
            greetingEl.textContent = greetingText;
            greetingEl.classList.add('visible');
            if (id !== currentAnimationId) return;
            await delay(2500);
            greetingEl.classList.remove('visible');
            if (id !== currentAnimationId) return;
            await delay(1000);
            if (animationLoopActive) {
                await typeAndErase(taglineEl, taglineText, id);
                taglineEl.innerHTML = '';
            }
            if (id !== currentAnimationId) return;
            await delay(500);
        }
    }

    // --- Clock Function ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        if (timeDisplay) timeDisplay.textContent = `${hours}:${minutes}`;
        if (secondsDisplay) secondsDisplay.textContent = seconds;
        if (ampmDisplay) ampmDisplay.textContent = ampm;
        if (dateDisplay) dateDisplay.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // --- Dark Mode Logic ---
    function setupDarkModeToggle() {
        if (!themeSwitcher) return;
        const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
        themeSwitcher.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // --- Page Transitions & Animations ---
    function onContentHideEnd() {
        mainContent.classList.add('hidden');
        mainContent.classList.remove('content-reveal', 'content-hide');
        lockScreen.classList.remove('fade-out');
        lockScreen.classList.add('fade-in-zoom');
        greetingEl.classList.remove('visible');
        taglineEl.innerHTML = '';
        animationLoopActive = true;
        currentAnimationId++;
        animationLoop(currentAnimationId);
    }

    enterButton.addEventListener('click', () => {
        animationLoopActive = false;
        greetingEl.classList.remove('visible');
        taglineEl.innerHTML = '';
        document.querySelectorAll('.lock-element').forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.remove('fade-in-zoom');
        lockScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');
        setTimeout(() => {
            body.classList.add('circles-active');
        }, 500);
    });

    homeLogo.addEventListener('click', (e) => {
        e.preventDefault();
        scrollRevealElements.forEach(el => el.classList.remove('visible'));
        body.classList.remove('circles-active');
        mainContent.classList.add('content-hide');
    });

    mainContent.addEventListener('animationend', (event) => {
        if (event.animationName === 'fadeOutSlideUp') {
            onContentHideEnd();
        }
    });

    // --- Mobile Menu ---
    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('flex')) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
            }
        });
    });

    document.addEventListener('click', (event) => {
        const isMenuOpen = menu.classList.contains('flex');
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnMenuBtn = menuBtn.contains(event.target);
        if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuBtn) {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
        }
    });

    // --- Scroll Reveal Logic ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.1 });
    scrollRevealElements.forEach(el => scrollObserver.observe(el));

    // --- Contact Form AJAX Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formspreeEndpoint = atob('aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi9tZGtkbGF2ZQ==');
            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formStatus.innerHTML = "Thanks for your message! I'll get back to you.";
                    formStatus.className = 'form-success';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    formStatus.innerHTML = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem.";
                    formStatus.className = 'form-error';
                }
            } catch (error) {
                formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                formStatus.className = 'form-error';
            }
        });
    }

    // --- Back to Top Button ---
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('show', window.scrollY > 300);
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Active Nav Link on Scroll (Scrollspy) ---
    if ('IntersectionObserver' in window && navLinks.length > 0) {
        let lastScrollY = window.scrollY;
        let scrollDirection = 'down';
        const navLinksArray = Array.from(navLinks);

        window.addEventListener('scroll', () => {
            scrollDirection = (window.scrollY > lastScrollY) ? 'down' : 'up';
            lastScrollY = window.scrollY;
        }, { passive: true });

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetLinkId = `#${entry.target.parentElement.id}`;
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === targetLinkId);
                    });
                } else if (scrollDirection === 'up') {
                    const activeLink = document.querySelector(`#menu a[href="${targetLinkId}"]`);
                    if (activeLink?.classList.contains('active')) {
                        const activeIndex = navLinksArray.findIndex(link => link.getAttribute('href') === targetLinkId);
                        if (activeIndex > 0) {
                            navLinks[activeIndex].classList.remove('active');
                            navLinks[activeIndex - 1].classList.add('active');
                        }
                    }
                }
            });
        }, { rootMargin: '-90px 0px -50% 0px' });

        triggers.forEach(trigger => {
            if (trigger) sectionObserver.observe(trigger);
        });

        setTimeout(() => {
            if (window.scrollY < 50) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[0].classList.add('active');
            } else {
                let currentSectionId = '';
                sections.forEach(section => {
                    if (section.getBoundingClientRect().top < 100) {
                        currentSectionId = section.id;
                    }
                });
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
                });
            }
        }, 200);
    }

    // --- Navbar Scroll Effect ---
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Infinite Scroll for Image Carousel ---
    function setupInfiniteScroll() {
        if (!imageCarousel) return;
        const images = imageCarousel.querySelectorAll('img');
        images.forEach(img => {
            imageCarousel.appendChild(img.cloneNode(true));
        });
        let currentPosition = 0;
        const speed = 0.75;
        function animate() {
            currentPosition += speed;
            if (currentPosition >= imageCarousel.scrollWidth / 2) {
                currentPosition = 0;
            }
            imageCarousel.style.transform = `translateX(-${currentPosition}px)`;
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Initial Setup ---
    preloadImages(['assets/images/background.jpg', 'assets/images/profile.jpg'], () => {
        if (lockScreen) lockScreen.style.display = 'flex';
        if (skeletonLoader) skeletonLoader.style.opacity = '0';
        if (lockScreen) lockScreen.style.opacity = '1';

        setTimeout(() => {
            if (skeletonLoader) skeletonLoader.remove();
            updateClock();
            setInterval(updateClock, 1000);
            currentAnimationId++;
            animationLoop(currentAnimationId);
            setupDarkModeToggle();
            setupInfiniteScroll();
        }, 500);
    });
});