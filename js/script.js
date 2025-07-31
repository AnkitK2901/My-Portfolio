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

    // --- Clock Function ---
    function updateClock() {
        const now = new Date();
        
        // Use en-US locale for reliable AM/PM format
        const fullTimeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Example: "04:02:05 PM" -> ["04:02", "05", "PM"]
        const timeParts = fullTimeString.split(/:| /);
        
        const mainTime = timeParts[0] + ":" + timeParts[1];
        const seconds = timeParts[2];
        const ampm = timeParts[3];

        timeDisplay.textContent = mainTime;
        secondsDisplay.textContent = seconds;
        ampmDisplay.textContent = ampm;

        // Date formatting remains the same
        const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dateDisplay.textContent = dateString;
    }

    // --- Dark Mode Logic ---
    function updateThemeIcon(isDarkMode) {
        themeToggleDarkIcon.classList.toggle('hidden', !isDarkMode);
        themeToggleLightIcon.classList.toggle('hidden', isDarkMode);
    }

    // Check for saved theme in localStorage. Default to dark if nothing is set.
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
        // Add fade-out classes to all lock screen elements
        lockElements.forEach(el => el.classList.add('lock-element-fade-out'));
        lockScreen.classList.add('fade-out');
        
        // Show the main content and trigger its reveal animation
        mainContent.classList.remove('hidden');
        mainContent.classList.add('content-reveal');
    });

    // --- Scroll Reveal Logic using Intersection Observer ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after revealing to save resources
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Initial Setup ---
    updateClock();
    setInterval(updateClock, 1000); // Update clock every second
});