document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
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
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const contactForm = document.getElementById('contactForm');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');


    let animationLoopActive = true;

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

    async function typeAndErase(element, text) {
        // Typing
        for (let i = 0; i <= text.length; i++) {
            if (!animationLoopActive) return;
            element.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
            await delay(60); // Typing speed
        }
        await delay(2500); // Pause after typing

        // Erasing
        for (let i = text.length; i >= 0; i--) {
            if (!animationLoopActive) return;
            element.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
            await delay(30); // Erasing speed
        }
    }

    async function animationLoop() {
        while (animationLoopActive) {
            // 1. Show Greeting
            const hour = new Date().getHours();
            let greetingText;
            if (hour < 12) greetingText = "Good Morning";
            else if (hour < 18) greetingText = "Good Afternoon";
            else greetingText = "Good Evening";
            greetingEl.textContent = greetingText;
            greetingEl.classList.add('visible');
            await delay(2500);
            
            // 2. Hide Greeting
            greetingEl.classList.remove('visible');
            await delay(1000);
            
            // 3. Type and Erase Tagline
            if (animationLoopActive) {
                await typeAndErase(taglineEl, taglineText);
                taglineEl.innerHTML = '';
            }
            await delay(500);
        }
    }

    // --- Clock Function ---
    function updateClock() {
        const now = new Date();
        const fullTimeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const timeParts = fullTimeString.split(/:| /);
        timeDisplay.textContent = `${timeParts[0]}:${timeParts[1]}`;
        secondsDisplay.textContent = timeParts[2];
        ampmDisplay.textContent = timeParts[3];
        dateDisplay.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // --- Dark Mode Logic ---
    function setupDarkModeToggle() {
        if (!themeToggleButton) return;
        const updateThemeIcon = (isDarkMode) => {
            if(themeToggleDarkIcon && themeToggleLightIcon){
                themeToggleDarkIcon.classList.toggle('hidden', !isDarkMode);
                themeToggleLightIcon.classList.toggle('hidden', isDarkMode);
            }
        };

        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.remove('dark');
            updateThemeIcon(false);
        } else {
            document.documentElement.classList.add('dark');
            updateThemeIcon(true);
        }

        themeToggleButton.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    // --- Enter Animation ---
    enterButton.addEventListener('click', () => {
        animationLoopActive = false;
        document.querySelectorAll('.lock-element').forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');
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

    // --- Contact Form Validation ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(String(email).toLowerCase());

            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields.');
                return;
            }
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // --- Initial Setup ---
    preloadImages(['assets/images/bg.jpg', 'assets/images/profile.jpg'], () => {
        skeletonLoader.style.opacity = '0';
        lockScreen.style.opacity = '1';
        
        setTimeout(() => {
            skeletonLoader.remove();
            updateClock();
            setInterval(updateClock, 1000);
            animationLoop();
            setupDarkModeToggle();
        }, 500); // Wait for skeleton fade out transition
    });
});