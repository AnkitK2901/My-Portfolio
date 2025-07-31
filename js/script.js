document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const lockScreen = document.getElementById('lockScreen');
    const enterButton = document.getElementById('enterButton');
    const mainContent = document.getElementById('mainContent');
    const timeDisplay = document.getElementById('timeDisplay');
    const secondsDisplay = document.getElementById('secondsDisplay');
    const ampmDisplay = document.getElementById('ampmDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const lockElements = document.querySelectorAll('.lock-element');
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const contactForm = document.getElementById('contactForm');

    // --- Clock Function ---
    function updateClock() {
        const now = new Date();
        
        const fullTimeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const timeParts = fullTimeString.split(/:| /);
        
        const mainTime = timeParts[0] + ":" + timeParts[1];
        const seconds = timeParts[2];
        const ampm = timeParts[3];

        timeDisplay.textContent = mainTime;
        secondsDisplay.textContent = seconds;
        ampmDisplay.textContent = ampm;

        const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dateDisplay.textContent = dateString;
    }

    // --- Dark Mode Logic ---
    function updateThemeIcon(isDarkMode) {
        themeToggleDarkIcon.classList.toggle('hidden', !isDarkMode);
        themeToggleLightIcon.classList.toggle('hidden', isDarkMode);
    }

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

    // --- Enter Animation ---
    enterButton.addEventListener('click', () => {
        lockElements.forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.add('fade-out');
        
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');
    });

    // --- Scroll Reveal Logic using Intersection Observer ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });
    
    // --- Contact Form Validation ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

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

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Initial Setup ---
    updateClock();
    setInterval(updateClock, 1000);
});