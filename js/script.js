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
    const contactForm = document.getElementById('contact-form'); // New
    const formStatus = document.getElementById('form-status'); // New
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    // --- Custom Modal Logic for Pay Slip Demo ---
    const paySlipDemoButton = document.getElementById('payslip-demo-btn');
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modal = document.getElementById('custom-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

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
            e.preventDefault(); // Prevent the link from navigating
            showModal();
        });
    }

    // Add event listeners to close the modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideModal);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);

            // Hide all other content
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
            });
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });

            // Show the active tab and content
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

    let animationLoopActive = true;
    let currentAnimationId = 0;

    // --- Remove enter text on mobile ---
    if (window.innerWidth < 768 || "ontouchstart" in window) {
        const enterText = document.querySelector(".enter-text");
        if (enterText) {
            enterText.remove();
        }
    }

    // --- Asset Loading ---
    function preloadImages(urls, callback) {
        let loadedCount = 0;
        const totalImages = urls.length;
        if (totalImages === 0) {
            callback();
            return;
        }
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            };
        });
    }

    // --- Helper function for delays ---
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    // --- Animation Loop Logic ---
    const taglineText = "Welcome to my portfolio website! Curious to explore and learn more about me?";

    async function typeAndErase(element, text, id) {
        // Typing
        for (let i = 0; i <= text.length; i++) {
            if (id !== currentAnimationId || !animationLoopActive) return;
            element.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
            await delay(60);
        }

        if (id !== currentAnimationId) return;
        await delay(2500);

        // Erasing
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

        if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }

        themeSwitcher.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }
    // ===================================================================
    // START: Replace your code with this entire block
    // ===================================================================

    // This function you wrote is PERFECT. It defines what happens after the animation.
    function onContentHideEnd() {
        mainContent.classList.add('hidden');
        mainContent.classList.remove('content-reveal', 'content-hide');
        lockScreen.classList.remove('fade-out');
        lockScreen.classList.add('fade-in-zoom'); // This triggers your new CSS animation
        greetingEl.classList.remove('visible');
        taglineEl.innerHTML = '';
        animationLoopActive = true;
        currentAnimationId++;
        animationLoop(currentAnimationId);
    }

    // --- Page Transitions ---

    // This listener is also PERFECT. It resets the state when entering the site.
    enterButton.addEventListener('click', () => {
        animationLoopActive = false;
        greetingEl.classList.remove('visible');
        taglineEl.innerHTML = '';
        document.querySelectorAll('.lock-element').forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.remove('fade-in-zoom'); // This reset is correct
        lockScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');
        setTimeout(() => {
            body.classList.add('circles-active');
        }, 500);
    });

    // THIS IS THE PART TO FIX:
    // The homeLogo listener should ONLY start the animation.
    homeLogo.addEventListener('click', (e) => {
        e.preventDefault();
        scrollRevealElements.forEach(el => el.classList.remove('visible'));
        body.classList.remove('circles-active');

        // That's it. This is the only line of logic it needs.
        mainContent.classList.add('content-hide');
    });

    // THIS IS THE PART TO ADD:
    // This is the single, permanent listener that does the work after the animation.
    mainContent.addEventListener('animationend', (event) => {
        // It checks if the correct animation finished...
        if (event.animationName === 'fadeOutSlideUp') {
            // ...and then calls your function.
            onContentHideEnd();
        }
    });

    // ===================================================================
    // END: The corrected section finishes here
    // ===================================================================

    homeLogo.addEventListener('click', (e) => {
        e.preventDefault();
        scrollRevealElements.forEach(el => el.classList.remove('visible'));
        // Deactivate circle animations
        body.classList.remove('circles-active');

        // Add class to hide main content
        mainContent.classList.add('content-hide');

        mainContent.addEventListener('animationend', (event) => {
            // Ensure this only runs for the content-hide animation
            if (event.animationName === 'fadeOutSlideUp') {
                // Hide content and reset its classes
                onContentHideEnd();
                mainContent.classList.add('hidden');
                mainContent.classList.remove('content-reveal', 'content-hide');

                // Reset lock screen for re-entry
                lockScreen.classList.remove('fade-out');
                lockScreen.style.opacity = '1';
                lockScreen.style.visibility = 'visible';
                document.querySelectorAll('.lock-element').forEach(el => {
                    el.classList.remove('lock-element-fade-out');
                });
                greetingEl.classList.remove('visible');
                taglineEl.innerHTML = '';
                // Restart animation loop with a new ID
                animationLoopActive = true;
                currentAnimationId++;
                animationLoop(currentAnimationId);
            }
        }, { once: true });
    });

    // --- Mobile Menu ---
    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    });
    // --- NEW: Close mobile menu when clicking outside ---
    document.addEventListener('click', (event) => {
        // First, check if the menu is open and if the click was outside of the menu container AND not on the menu button.
        // The 'contains' method checks if the clicked element (event.target) is a descendant of the menu or the menu button.
        const isMenuOpen = menu.classList.contains('flex');
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnMenuBtn = menuBtn.contains(event.target);

        if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuBtn) {
            // If all conditions are met, close the menu.
            menu.classList.add('hidden');
            menu.classList.remove('flex');
        }
    });
    // --- ADD THIS NEW BLOCK ---
    // Add event listener to all links within the menu to close it on click
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the mobile menu is open before trying to close it
            if (menu.classList.contains('flex')) {
                menu.classList.toggle('hidden');
                menu.classList.toggle('flex');
            }
        });
    });
    // --- END OF NEW BLOCK ---

    // --- Scroll Reveal Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    scrollRevealElements.forEach(el => observer.observe(el));

    // --- NEW: Contact Form AJAX Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            // IMPORTANT: Replace with your Formspree endpoint URL
            // The Formspree URL is decoded from Base64 to prevent email scraping by bots.
            const formspreeEndpoint = atob('aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi9tZGtkbGF2ZQ==');

            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.innerHTML = "Thanks for your message! I'll get back to you.";
                    formStatus.className = 'form-success';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                    }
                    formStatus.className = 'form-error';
                }
            } catch (error) {
                formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                formStatus.className = 'form-error';
            }
        });
    }
    // --- NEW: Back to Top Button Logic ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // --- Active Nav Link on Scroll (Scrollspy) [FINAL ARCHITECTURE V2] ---
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#menu a');
        const triggers = document.querySelectorAll('.scroll-trigger');
        const navLinksArray = Array.from(navLinks);

        // --- 1. Track Scroll Direction ---
        let lastScrollY = window.scrollY;
        let scrollDirection = 'down';

        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY) {
                scrollDirection = 'down';
            } else {
                scrollDirection = 'up';
            }
            lastScrollY = window.scrollY;
        }, { passive: true });

        // --- 2. Observe Tripwires (for standard scrolling) ---
        const observerOptions = {
            root: null,
            rootMargin: '-90px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetSection = entry.target.parentElement;
                const targetLinkId = `#${targetSection.id}`;

                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === targetLinkId);
                    });
                } else {
                    if (scrollDirection === 'up') {
                        const linkForThisSection = document.querySelector(`#menu a[href="${targetLinkId}"]`);
                        if (linkForThisSection && linkForThisSection.classList.contains('active')) {
                            const activeIndex = navLinksArray.findIndex(link => link.getAttribute('href') === targetLinkId);
                            if (activeIndex > 0) {
                                navLinks[activeIndex].classList.remove('active');
                                navLinks[activeIndex - 1].classList.add('active');
                            }
                        }
                    }
                }
            });
        }, observerOptions);

        triggers.forEach(trigger => {
            if (trigger) observer.observe(trigger);
        });

        // --- 3. Handle Middle-Mouse Button Scrolling ---
        let isPanning = false;
        let animationFrameId;

        // This function manually checks position ONLY during a pan
        function panScrollCheck() {
            if (!isPanning) return;

            let currentSectionId = '';
            const topOffset = 90;

            triggers.forEach(trigger => {
                if (trigger.getBoundingClientRect().top < topOffset) {
                    currentSectionId = trigger.parentElement.id;
                }
            });

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                currentSectionId = sections[sections.length - 1].id;
            }

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
            });

            requestAnimationFrame(panScrollCheck);
        }

        window.addEventListener('mousedown', (e) => {
            if (e.button === 1) { // Middle mouse button
                isPanning = true;
                requestAnimationFrame(panScrollCheck);
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 1) {
                isPanning = false;
            }
        });

        // --- 4. Set Initial State ---
        setTimeout(() => {
            if (window.scrollY < 50 && navLinks[0]) {
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
    // --- NEW: Navbar Scroll Effect ---
    const header = document.querySelector('#mainContent header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Add 'scrolled' class if user scrolls more than 50px, otherwise remove it
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    // --- NEW: Infinite Scroll for Image Carousel ---
    function setupInfiniteScroll() {
        if (!imageCarousel) return;

        // Clone the images to ensure there's enough content to scroll smoothly
        const images = imageCarousel.querySelectorAll('img');
        images.forEach(img => {
            const clone = img.cloneNode(true);
            imageCarousel.appendChild(clone);
        });

        let currentPosition = 0;
        // You can adjust the speed here. Higher number = faster scroll.
        const speed = 0.75;

        function animate() {
            currentPosition += speed;

            // If the scroll position has passed the original set of images, reset it
            if (currentPosition >= imageCarousel.scrollWidth / 2) {
                currentPosition = 0;
            }

            imageCarousel.style.transform = `translateX(-${currentPosition}px)`;

            // Request the next animation frame to create a smooth loop
            requestAnimationFrame(animate);
        }

        // Start the animation
        animate();
    }

    // --- Initial Setup ---
    preloadImages(['assets/images/background.jpg', 'assets/images/profile.jpg'], () => {
        lockScreen.style.display = 'flex';
        skeletonLoader.style.opacity = '0';
        lockScreen.style.opacity = '1';

        setTimeout(() => {
            skeletonLoader.remove();
            updateClock();
            setInterval(updateClock, 1000);
            currentAnimationId++;
            animationLoop(currentAnimationId);
            setupDarkModeToggle();
            setupInfiniteScroll();
        }, 500);
    });
});
