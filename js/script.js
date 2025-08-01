document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const body = document.body;
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

    // --- Page Transitions ---
    enterButton.addEventListener('click', () => {
        animationLoopActive = false;
        // Reset text states immediately to prevent overlap
        greetingEl.classList.remove('visible');
        taglineEl.innerHTML = '';

        // Add classes to trigger animations
        document.querySelectorAll('.lock-element').forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');

        // Add class for circle animation
        setTimeout(() => {
            body.classList.add('circles-active');
        }, 500);
    });

    homeLogo.addEventListener('click', (e) => {
        e.preventDefault();

        // Deactivate circle animations
        body.classList.remove('circles-active');

        // Add class to hide main content
        mainContent.classList.add('content-hide');

        mainContent.addEventListener('animationend', (event) => {
            // Ensure this only runs for the content-hide animation
            if (event.animationName === 'fadeOutSlideUp') {
                // Hide content and reset its classes
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

    // --- Scroll Reveal Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
            const formspreeEndpoint = 'https://formspree.io/f/mdkdlave';

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
        }, 500);
    });
});
