// Theme debugging script
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - theme-debug.js running');
    
    // Get theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme toggle found:', themeToggle);
    
    if (themeToggle) {
        // Force add direct click event
        themeToggle.onclick = function(e) {
            console.log('DIRECT CLICK EVENT FIRED');
            const body = document.body;
            const currentTheme = body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
            console.log('Current theme before toggle:', currentTheme);
            
            // Toggle class directly
            body.classList.toggle('light-mode');
            
            // Save to localStorage
            const newTheme = body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
            localStorage.setItem('theme', newTheme);
            console.log('New theme after toggle:', newTheme);
            
            // Update icon
            updateThemeIcon();
            
            // Log body classes for debugging
            console.log('Body classes after toggle:', body.className);
            
            // Force repaint
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        // Initialize theme
        initTheme();
    }
    
    function initTheme() {
        const body = document.body;
        const savedTheme = localStorage.getItem('theme');
        console.log('Saved theme:', savedTheme);
        
        // Apply saved theme
        if (savedTheme === 'light-mode') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
        
        // Update icon
        updateThemeIcon();
    }
    
    function updateThemeIcon() {
        const isLightMode = document.body.classList.contains('light-mode');
        console.log('Updating icon, light mode:', isLightMode);
        
        if (themeToggle) {
            themeToggle.innerHTML = isLightMode 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
            console.log('Theme icon updated');
        }
    }
});
