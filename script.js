document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.getElementById('welcome-section');
    const bookList = document.getElementById('book-list');
    const bookUpload = document.getElementById('book-upload');
    const mainContent = document.querySelector('.content');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Initialize logo click handler
    const logoLink = document.querySelector('.logo-text');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Hide all content sections first
            document.querySelectorAll('.content-section, .book-content').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            
            // Show welcome section
            if (welcomeSection) {
                welcomeSection.style.display = 'block';
                welcomeSection.classList.add('active');
                welcomeSection.setAttribute('style', 'display: block !important');
            }
            
            // Update featured books
            updateFeaturedBooks();
            
            // Clear URL hash without triggering hashchange
            history.pushState('', document.title, window.location.pathname);
        });
    }

    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (!hash) {
            // If no hash, show welcome section
            document.querySelectorAll('.content-section, .book-content').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            if (welcomeSection) {
                welcomeSection.style.display = 'block';
                welcomeSection.classList.add('active');
                welcomeSection.setAttribute('style', 'display: block !important');
                updateFeaturedBooks();
            }
        } else if (document.getElementById(hash)) {
            showBookContent(hash);
        }
    });
    
    // Remove any remaining Ecce Homo elements - COMMENTED OUT TO ALLOW ECCE HOMO TO DISPLAY
    // removeEcceHomoElements();
    
    // Load books from localStorage
    loadBooksFromStorage();
    
    // Initialize featured books section
    updateFeaturedBooks();
    
    // Initialize sidebar scroll detection
    initSidebarScrollDetection();
    
    // Function to remove any remaining Ecce Homo elements - COMMENTED OUT TO ALLOW ECCE HOMO TO DISPLAY
    /*
    function removeEcceHomoElements() {
        // Remove from sidebar
        const ecceHomoItem = document.querySelector('.book-link[data-book-id="eccehomo"]');
        if (ecceHomoItem) {
            const listItem = ecceHomoItem.closest('.book-item');
            if (listItem) {
                listItem.remove();
                console.log('Removed Ecce Homo from sidebar');
            }
        }
        
        // Remove from main content
        const ecceHomoContent = document.getElementById('eccehomo');
        if (ecceHomoContent) {
            ecceHomoContent.remove();
            console.log('Removed Ecce Homo content section');
        }
        
        // Remove from localStorage if present
        let books = JSON.parse(localStorage.getItem('customBooks') || '[]');
        const filteredBooks = books.filter(book => book.id !== 'eccehomo');
        if (books.length !== filteredBooks.length) {
            localStorage.setItem('customBooks', JSON.stringify(filteredBooks));
            console.log('Removed Ecce Homo from localStorage');
        }
    }
    */
    
    // Function to show a specific book content
    function showBookContent(bookId) {
        console.log('showBookContent called with bookId:', bookId);
        
        // Hide welcome section and all book contents
        if (welcomeSection) welcomeSection.classList.remove('active');
        document.querySelectorAll('.book-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Hide search results if they exist
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        
        // Show the selected book content
        let activeBookContent = document.getElementById(bookId);
        
        // If the book content doesn't exist, create it dynamically
        if (!activeBookContent) {
            console.log('Creating missing book content for:', bookId);
            
            // Get book info from the sidebar link
            const bookLink = document.querySelector(`.book-link[data-book-id="${bookId}"]`);
            if (bookLink) {
                const bookTitle = bookLink.querySelector('.book-title').textContent;
                const bookAuthor = bookLink.querySelector('.book-author').textContent;
                const bookCover = bookLink.querySelector('img').getAttribute('src');
                
                // Create a simple book content element
                const bookData = {
                    id: bookId,
                    title: bookTitle,
                    author: bookAuthor,
                    coverUrl: bookCover,
                    overview: `This book's full content hasn't been added yet.`,
                    themes: [
                        {
                            title: "Sample Theme",
                            description: ["This is a placeholder theme."]
                        }
                    ],
                    quotes: ["This is a placeholder quote for this book."]
                };
                
                // Add the book content to the main content
                addBookToMainContent(bookData);
                
                // Get the newly created element
                activeBookContent = document.getElementById(bookId);
            }
        }
        
        if (activeBookContent) {
            console.log('Found book content element:', bookId);
            activeBookContent.classList.add('active');
            activeBookContent.style.display = 'block';
            
            // Update URL hash without triggering page reload
            history.replaceState(null, null, `#${bookId}`);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
            }
        } else {
            console.error('No matching book content found for:', bookId);
            // If no book content found, show welcome section
            if (welcomeSection) {
                welcomeSection.classList.add('active');
                welcomeSection.style.display = 'block';
            }
        }
    }

    // Handle book link clicks (including dynamically added ones)
    document.addEventListener('click', function(e) {
        const bookLink = e.target.closest('.book-link');
        if (bookLink) {
            e.preventDefault();
            const bookId = bookLink.getAttribute('data-book-id');
            console.log('Book link clicked:', bookId);
            showBookContent(bookId);
        }
    });

    // Check URL hash on page load
    function checkHash() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash && document.getElementById(hash)) {
            showBookContent(hash);
        } else {
            // Show welcome section if no valid hash
            if (welcomeSection) {
                welcomeSection.classList.add('active');
                welcomeSection.style.display = 'block';
            }
        }
    }

    // Initial check
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    // Handle file upload
    bookUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const bookData = JSON.parse(event.target.result);
                addNewBook(bookData);
                // Reset file input
                bookUpload.value = '';
            } catch (error) {
                alert('Invalid book data format. Please upload a valid JSON file.');
                console.error('Error parsing book data:', error);
            }
        };
        reader.readAsText(file);
    });
    
    // Function to add a new book
    function addNewBook(bookData) {
        // Validate required fields
        if (!bookData.id || !bookData.title || !bookData.author) {
            alert('Book data is missing required fields (id, title, author)');
            return;
        }
        
        // Check if book with this ID already exists
        if (document.querySelector(`.book-link[data-book-id="${bookData.id}"]`)) {
            alert(`A book with ID "${bookData.id}" already exists.`);
            return;
        }
        
        // Add to sidebar
        addBookToSidebar(bookData);
        
        // Add to main content
        addBookToMainContent(bookData);
        
        // Save to localStorage
        saveBookToStorage(bookData);
        
        // Update highlights counter
        updateHighlightsCounter();
        
        // Update featured books
        updateFeaturedBooks();
        
        // Show success message
        alert(`Book "${bookData.title}" has been added successfully!`);
    }
    
    // Function to add book to sidebar
    function addBookToSidebar(bookData) {
        const bookItem = document.createElement('li');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <a href="#${bookData.id}" data-book-id="${bookData.id}" class="book-link">
                <div class="book-cover">
                    <img src="${bookData.coverUrl}" alt="${bookData.title} Cover" loading="lazy">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${bookData.title}</h3>
                    <p class="book-author">${bookData.author}</p>
                </div>
            </a>
        `;
        bookList.appendChild(bookItem);
    }
    
    // Function to add book to main content
    function addBookToMainContent(bookData) {
        const bookSection = document.createElement('section');
        bookSection.className = 'content-section book-content';
        bookSection.id = bookData.id;
        bookSection.setAttribute('data-book-id', bookData.id);
        bookSection.setAttribute('aria-labelledby', `${bookData.id}-title`);
        
        // Create themes HTML
        let themesHTML = '';
        if (bookData.themes && bookData.themes.length > 0) {
            themesHTML = bookData.themes.map(theme => `
                <li>
                    <h3>${theme.title}</h3>
                    ${theme.description.map(para => `<p>${para}</p>`).join('')}
                </li>
            `).join('');
        }
        
        // Create quotes HTML
        let quotesHTML = '';
        if (bookData.quotes && bookData.quotes.length > 0) {
            quotesHTML = bookData.quotes.map(quote => `
                <blockquote class="quote-card">
                    <p>${quote}</p>
                </blockquote>
            `).join('');
        }
        
        bookSection.innerHTML = `
            <article class="book-summary">
                <header class="book-header">
                    <h1 class="book-title-main" id="${bookData.id}-title">${bookData.author} - ${bookData.title}</h1>
                </header>
                <div class="book-intro">
                    <h3>Overview</h3>
                    ${bookData.overview ? `<p>${bookData.overview}</p>` : ''}
                </div>
                ${themesHTML ? `
                <section class="key-themes">
                    <h2 class="section-title">Key Themes</h2>
                    <ul class="theme-list">
                        ${themesHTML}
                    </ul>
                </section>
                ` : ''}
                ${quotesHTML ? `
                <section class="significant-quotes">
                    <h2 class="section-title">Significant Quotes</h2>
                    <div class="quote-grid">
                        ${quotesHTML}
                    </div>
                </section>
                ` : ''}
            </article>
        `;
        
        mainContent.appendChild(bookSection);
    }
    
    // Function to add book to featured section
    function addBookToFeatured(bookData) {
        // Instead of adding individual books, just update the featured books section
        // to show the last 3 books from the sidebar
        updateFeaturedBooks();
    }
    
    // Function to save book to localStorage
    function saveBookToStorage(bookData) {
        let books = JSON.parse(localStorage.getItem('customBooks') || '[]');
        books.push(bookData);
        localStorage.setItem('customBooks', JSON.stringify(books));
    }
    
    // Function to load books from localStorage
    function loadBooksFromStorage() {
        const books = JSON.parse(localStorage.getItem('customBooks') || '[]');

        books.forEach(book => {
            addBookToSidebar(book);
            addBookToMainContent(book);
        });
    }

    // Initialize sidebar scroll detection
    function initSidebarScrollDetection() {
        const sidebar = document.querySelector('.sidebar');
        
        // Check initial scroll position
        checkSidebarScroll(sidebar);
        
        // Add scroll event listener
        sidebar.addEventListener('scroll', function() {
            checkSidebarScroll(this);
        });
    }

    // Check if sidebar is scrolled to bottom
    function checkSidebarScroll(sidebar) {
        // Calculate if scrolled to bottom (with a small threshold)
        const isAtBottom = sidebar.scrollHeight - sidebar.scrollTop - sidebar.clientHeight < 10;
        
        if (isAtBottom) {
            sidebar.classList.add('at-bottom');
        } else {
            sidebar.classList.remove('at-bottom');
        }
    }

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {  // Ensure the toggle exists before using it
        const icon = sidebarToggle.querySelector('i');

        function toggleSidebar() {
            console.log('Toggle sidebar called'); // Debug
            const isExpanding = !sidebar.classList.contains('active');
            sidebar.classList.toggle('active');
            
            // Toggle body scroll on mobile
            if (window.innerWidth <= 768) {
                body.classList.toggle('sidebar-active', isExpanding);
            }
            
            // Toggle collapsed class for proper content centering
            sidebar.classList.toggle('collapsed', !isExpanding);
            
            // Update icon to show the next action (> for expand, < for collapse)
            icon.className = isExpanding ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        }

        // Set initial icon state and classes
        icon.className = 'fas fa-chevron-right';
        sidebar.classList.add('collapsed'); // Ensure sidebar starts collapsed

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                toggleSidebar();
            }
        });

        // Handle touch events for better mobile experience
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) < swipeThreshold) return;
            
            if (window.innerWidth <= 768) {
                if (swipeDistance > 0 && !sidebar.classList.contains('active')) {
                    // Swipe right, open sidebar
                    toggleSidebar();
                } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
                    // Swipe left, close sidebar
                    toggleSidebar();
                }
            }
        }

        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Sidebar toggle clicked'); // Debug
            toggleSidebar();
        });

        // Update sidebar state on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                body.classList.remove('sidebar-active');
                icon.className = 'fas fa-chevron-right';
            }
        });
    } else {
        console.error('Sidebar toggle button not found');
    }

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme toggle element:', themeToggle);

    // Initialize the default class on body
    function initializeTheme() {
        // Default to dark-mode (site's original design)
        const body = document.body;
        
        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('theme');
        console.log('Saved theme:', savedTheme);
        
        if (savedTheme === 'light-mode') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        } else {
            // Default to dark-mode
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        }
        
        // Update the icon based on current theme
        updateThemeIcon();
    }

    // Toggle Theme
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            const body = document.body;
            
            // Toggle between light and dark mode
            if (body.classList.contains('light-mode')) {
                // Switch to dark mode
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                // Switch to light mode
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            
            updateThemeIcon();
        });
    } else {
        console.error('Theme toggle button not found');
    }

    // Update Theme Icon
    function updateThemeIcon() {
        if (themeToggle) {
            const isLightMode = document.body.classList.contains('light-mode');
            console.log('Updating icon for light mode:', isLightMode);
            themeToggle.innerHTML = isLightMode 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', isLightMode 
                ? 'Switch to dark mode' 
                : 'Switch to light mode');
        }
    }

    // Initialize theme on page load
    initializeTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            // Only update if user hasn't set a preference
            body.classList.toggle('light-mode', !e.matches);
            updateThemeIcon();
        }
    });

    // Search functionality - comprehensive indexing
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let searchIndex = [];

    // Build comprehensive search index
    function buildSearchIndex() {
        searchIndex = [];
        
        // Index book items in sidebar
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach(bookItem => {
            const bookLink = bookItem.querySelector('.book-link');
            const bookTitle = bookItem.querySelector('.book-title')?.textContent || '';
            const bookAuthor = bookItem.querySelector('.book-author')?.textContent || '';
            const bookId = bookLink?.getAttribute('data-book-id') || '';
            
            searchIndex.push({
                id: bookId,
                type: 'book',
                title: bookTitle,
                author: bookAuthor,
                text: `${bookTitle} ${bookAuthor}`,
                element: bookItem
            });
            
            // Also index the content of each book
            const bookContent = document.getElementById(bookId);
            if (bookContent) {
                // Index book overview
                const overview = bookContent.querySelector('.book-intro p')?.textContent || '';
                if (overview) {
                    searchIndex.push({
                        id: bookId,
                        type: 'overview',
                        title: `${bookTitle} - Overview`,
                        text: overview,
                        element: bookContent
                    });
                }
                
                // Index book themes
                const themes = bookContent.querySelectorAll('.theme-list li');
                themes.forEach((theme, index) => {
                    const themeTitle = theme.querySelector('h3')?.textContent || '';
                    const themeText = Array.from(theme.querySelectorAll('p'))
                        .map(p => p.textContent)
                        .join(' ');
                    
                    searchIndex.push({
                        id: bookId,
                        type: 'theme',
                        title: `${bookTitle} - ${themeTitle}`,
                        text: themeText,
                        element: bookContent
                    });
                });
                
                // Index book quotes
                const quotes = bookContent.querySelectorAll('.quote-card p');
                quotes.forEach((quote, index) => {
                    searchIndex.push({
                        id: bookId,
                        type: 'quote',
                        title: `${bookTitle} - Quote ${index + 1}`,
                        text: quote.textContent,
                        element: bookContent
                    });
                });
            }
        });
        
        // Index featured books in welcome section
        const featuredBooks = document.querySelectorAll('.featured-book-card');
        featuredBooks.forEach(book => {
            const title = book.querySelector('h3')?.textContent || '';
            const author = book.querySelector('p')?.textContent || '';
            const bookId = book.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]?.substring(1) || '';
            
            if (bookId) {
                searchIndex.push({
                    id: bookId,
                    type: 'featured',
                    title: title,
                    author: author,
                    text: `${title} ${author}`,
                    element: book
                });
            }
        });
        
        console.log(`Built search index with ${searchIndex.length} items`);
    }

    // Perform search with improved matching
    function performSearch(query) {
        if (!query || query.length < 2) return [];
        
        query = query.toLowerCase();
        const terms = query.split(/\s+/).filter(term => term.length > 1);
        
        return searchIndex.filter(item => {
            const itemText = ((item.text || '') + ' ' + (item.title || '') + ' ' + (item.author || '')).toLowerCase();
            
            // Check if all terms are found in the item
            return terms.every(term => itemText.includes(term));
        });
    }

    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear any existing search results first
        const content = document.querySelector('.content');
        const existingResults = document.getElementById('search-results');
        if (existingResults) {
            content.removeChild(existingResults);
        }
        
        const query = searchInput.value.trim();
        if (query.length < 2) {
            searchInput.classList.add('error');
            setTimeout(() => searchInput.classList.remove('error'), 1000);
            return;
        }
        
        // Build fresh index
        buildSearchIndex();
        
        // Get search results
        const results = performSearch(query);
        
        // Create search results container
        const searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'content-section';
        
        // Hide all other content
        document.querySelectorAll('.content-section, .book-content').forEach(section => {
            section.style.display = 'none';
        });
        
        // Create results HTML
        if (results.length === 0) {
            searchResults.innerHTML = `
                <h2>Search Results</h2>
                <p>No results found for "${query}".</p>
            `;
        } else {
            // Group results by book ID
            const groupedResults = {};
            results.forEach(result => {
                if (!groupedResults[result.id]) {
                    groupedResults[result.id] = {
                        id: result.id,
                        title: result.title.split(' - ')[0], // Get main book title
                        author: result.author || '',
                        items: []
                    };
                }
                groupedResults[result.id].items.push(result);
            });
            
            searchResults.innerHTML = `
                <h2>Search Results for "${query}"</h2>
                <p>Found matches in ${Object.keys(groupedResults).length} books:</p>
                <ul class="search-results-list"></ul>
            `;
            
            const resultsList = searchResults.querySelector('.search-results-list');
            
            // Display results grouped by book
            Object.values(groupedResults).forEach(group => {
                const listItem = document.createElement('li');
                listItem.className = 'search-result-item';
                
                const bookLink = document.createElement('a');
                bookLink.href = '#';
                bookLink.className = 'search-result-link';
                bookLink.setAttribute('data-book-id', group.id);
                bookLink.innerHTML = `
                    <strong>${group.title}</strong>
                    ${group.author ? `<span> by ${group.author}</span>` : ''}
                `;
                
                bookLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const bookId = this.getAttribute('data-book-id');
                    console.log('Clicked book with ID:', bookId);
                    
                    // Hide search results
                    searchResults.style.display = 'none';
                    
                    // Show book content using the existing showBookContent function
                    showBookContent(bookId);
                });
                
                listItem.appendChild(bookLink);
                
                // Add details about matches
                const matchDetails = document.createElement('div');
                matchDetails.className = 'match-details';
                
                const matchTypes = {
                    overview: 'Overview',
                    theme: 'Themes',
                    quote: 'Quotes'
                };
                
                // Count matches by type
                const typeCounts = {};
                group.items.forEach(item => {
                    if (item.type !== 'book' && item.type !== 'featured') {
                        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
                    }
                });
                
                // Display match counts
                if (Object.keys(typeCounts).length > 0) {
                    matchDetails.innerHTML = 'Matches found in: ' + 
                        Object.entries(typeCounts)
                            .map(([type, count]) => `${matchTypes[type] || type} (${count})`)
                            .join(', ');
                }
                
                listItem.appendChild(matchDetails);
                resultsList.appendChild(listItem);
            });
        }
        
        // Add to page
        content.appendChild(searchResults);
    });

    // Clear search on page load
    window.addEventListener('load', function() {
        searchInput.value = '';
        const existingResults = document.getElementById('search-results');
        if (existingResults) {
            existingResults.remove();
        }
    });

    // Explore button functionality - simplified and direct
    document.addEventListener('DOMContentLoaded', function() {
        const exploreBtn = document.querySelector('.explore-btn');
        
        if (exploreBtn) {
            // Remove any existing click handlers
            const newExploreBtn = exploreBtn.cloneNode(true);
            exploreBtn.parentNode.replaceChild(newExploreBtn, exploreBtn);
            
            newExploreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Explore button clicked');
                
                // First, hide everything
                const allSections = document.querySelectorAll('.content-section, .book-content');
                allSections.forEach(section => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                });
                
                // Hide search results if they exist
                const searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.remove();
                }
                
                // Clear search input
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Show welcome section
                const welcomeSection = document.getElementById('welcome-section');
                if (welcomeSection) {
                    console.log('Found welcome section, showing it');
                    welcomeSection.style.display = 'block';
                    welcomeSection.classList.add('active');
                    
                    // Force display with !important
                    welcomeSection.setAttribute('style', 'display: block !important');
                } else {
                    console.error('Welcome section not found');
                }
                
                // Clear URL hash
                history.pushState('', document.title, window.location.pathname);
                
                // Double-check after a small delay
                setTimeout(() => {
                    if (welcomeSection) {
                        welcomeSection.style.display = 'block';
                        welcomeSection.classList.add('active');
                    }
                }, 100);
            });
        } else {
            console.error('Explore button not found');
        }
    });

    // Also add a global function for backup
    window.showWelcomeSection = function() {
        const welcomeSection = document.getElementById('welcome-section');
        if (welcomeSection) {
            // First hide all content
            document.querySelectorAll('.content-section, .book-content').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            
            // Hide search results if they exist
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            
            // Show welcome section
            welcomeSection.style.display = 'block';
            welcomeSection.classList.add('active');
            
            // Force display with !important
            welcomeSection.setAttribute('style', 'display: block !important');
            
            // Update featured books to show only the last 3
            updateFeaturedBooks();
            
            // Clear URL hash
            history.pushState('', document.title, window.location.pathname);
        }
    };

    // Function to update featured books to show only the last 3
    function updateFeaturedBooks() {
        const bookGrid = document.querySelector('.book-grid');
        if (!bookGrid) return;
        
        // Get all book items from the sidebar
        const bookItems = Array.from(document.querySelectorAll('.book-item'));
        
        // Clear existing featured books
        bookGrid.innerHTML = '';
        
        // Get the last 3 books (or fewer if there are less than 3)
        const lastThreeBooks = bookItems.slice(-3).reverse();
        
        // Add the last 3 books to the featured section
        lastThreeBooks.forEach(bookItem => {
            const bookLink = bookItem.querySelector('.book-link');
            const bookId = bookLink.getAttribute('data-book-id');
            const bookTitle = bookItem.querySelector('.book-title').textContent;
            const bookAuthor = bookItem.querySelector('.book-author').textContent;
            const bookCover = bookItem.querySelector('img').getAttribute('src');
            
            const featuredCard = document.createElement('div');
            featuredCard.className = 'featured-book-card';
            featuredCard.setAttribute('onclick', `window.location.hash='${bookId}'`);
            
            featuredCard.innerHTML = `
                <img src="${bookCover}" alt="${bookTitle} Cover" loading="lazy">
                <h3>${bookTitle}</h3>
                <p>${bookAuthor}</p>
            `;
            
            bookGrid.appendChild(featuredCard);
        });
    }

    // Function to update highlights counter
    function updateHighlightsCounter() {
        const counter = document.querySelector('.highlights-counter span');
        if (!counter) return;
        
        // Get all quotes from the page
        const quotes = document.querySelectorAll('.quote-card');
        counter.textContent = quotes.length;
    }

    // Initialize highlights counter
    updateHighlightsCounter();

    // Add this after your existing book upload handler
    let coverImageData = null;

    // Handle cover image upload
    const coverUpload = document.getElementById('cover-upload');
    if (coverUpload) {
        coverUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                coverImageData = event.target.result;
                // Now show the form with the uploaded cover
                showBookEntryForm();
            };
            reader.readAsDataURL(file);
        });
    }

    // Add manual book entry functionality
    const manualEntryBtn = document.getElementById('manual-book-entry');
    if (manualEntryBtn) {
        manualEntryBtn.removeEventListener('click', showBookEntryForm); // Remove any existing handlers
        manualEntryBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            // Show the cover upload dialog instead of the form
            document.getElementById('cover-upload').click();
        });
    }

    // Function to show book entry form
    function showBookEntryForm() {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'book-entry-modal';
        
        // Create form HTML with the uploaded cover preview
        modal.innerHTML = `
            <div class="book-entry-form">
                <h2>Add New Book</h2>
                <form id="new-book-form">
                    <div class="form-group">
                        <label for="book-id">Book ID (no spaces):</label>
                        <input type="text" id="book-id" required>
                    </div>
                    <div class="form-group">
                        <label for="book-title">Title:</label>
                        <input type="text" id="book-title" required>
                    </div>
                    <div class="form-group">
                        <label for="book-author">Author:</label>
                        <input type="text" id="book-author" required>
                    </div>
                    <div class="form-group">
                        <label for="book-overview">Overview:</label>
                        <textarea id="book-overview" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Cover Image:</label>
                        <div class="cover-preview">
                            ${coverImageData ? `<img src="${coverImageData}" alt="Cover preview">` : '<p>No cover uploaded</p>'}
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="cancel-entry">Cancel</button>
                        <button type="submit">Save Book</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Handle form submission
        const form = document.getElementById('new-book-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create book data object
            const bookData = {
                id: document.getElementById('book-id').value.trim().replace(/\s+/g, '-'),
                title: document.getElementById('book-title').value.trim(),
                author: document.getElementById('book-author').value.trim(),
                overview: document.getElementById('book-overview').value.trim(),
                coverUrl: coverImageData || 'covers/default-cover.jpg',
                themes: [],
                quotes: []
            };
            
            // Add the book
            addNewBook(bookData);
            
            // Reset cover image data
            coverImageData = null;
            
            // Close modal
            document.body.removeChild(modal);
        });
        
        // Handle cancel
        document.getElementById('cancel-entry').addEventListener('click', function() {
            document.body.removeChild(modal);
            coverImageData = null; // Reset cover image data on cancel
        });
    }

    // Add edit functionality to book items
    function setupBookEditButtons() {
        // Add edit buttons to each book item
        document.querySelectorAll('.book-item').forEach(item => {
            // Skip if edit button already exists
            if (item.querySelector('.edit-book-btn')) return;
            
            const bookLink = item.querySelector('.book-link');
            if (!bookLink) return;
            
            const bookId = bookLink.getAttribute('data-book-id');
            
            // Create edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-book-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.setAttribute('aria-label', 'Edit book');
            editBtn.setAttribute('title', 'Edit book');
            
            // Add click handler
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                editBook(bookId);
            });
            
            // Add to book item
            item.appendChild(editBtn);
        });
    }

    // Function to edit a book
    function editBook(bookId) {
        // Get book data from storage
        const books = JSON.parse(localStorage.getItem('customBooks') || '[]');
        const bookData = books.find(book => book.id === bookId);
        
        if (!bookData) {
            // For built-in books, create a copy in localStorage
            const bookElement = document.getElementById(bookId);
            if (!bookElement) {
                alert('Book not found');
                return;
            }
            
            // Extract data from DOM
            const title = bookElement.querySelector('.book-title-main').textContent.split('–')[1]?.trim() || 
                          bookElement.querySelector('.book-title-main').textContent;
            const author = bookElement.querySelector('.book-title-main').textContent.split('–')[0]?.trim() || 'Unknown';
            const overview = bookElement.querySelector('.book-intro p')?.textContent || '';
            
            // Get cover image
            const bookItem = document.querySelector(`.book-link[data-book-id="${bookId}"]`);
            const coverUrl = bookItem?.querySelector('img')?.src || 'covers/default-cover.jpg';
            
            // Create new book data
            const newBookData = {
                id: bookId,
                title: title,
                author: author,
                coverUrl: coverUrl,
                overview: overview,
                themes: [],
                quotes: []
            };
            
            // Extract themes
            const themes = bookElement.querySelectorAll('.theme-list li');
            themes.forEach(theme => {
                const themeTitle = theme.querySelector('h3')?.textContent || '';
                const themeDescriptions = Array.from(theme.querySelectorAll('p')).map(p => p.textContent);
                
                if (themeTitle) {
                    newBookData.themes.push({
                        title: themeTitle,
                        description: themeDescriptions
                    });
                }
            });
            
            // Extract quotes
            const quotes = bookElement.querySelectorAll('.quote-card p');
            quotes.forEach(quote => {
                newBookData.quotes.push(quote.textContent);
            });
            
            // Show edit form with this data
            showBookEditForm(newBookData, true);
        } else {
            // Show edit form with existing data
            showBookEditForm(bookData, false);
        }
    }

    // Function to show book edit form
    function showBookEditForm(bookData, isNewCopy) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'book-entry-modal';
        
        // Create themes HTML
        let themesHTML = '';
        if (bookData.themes && bookData.themes.length > 0) {
            bookData.themes.forEach((theme, index) => {
                const descriptionInputs = theme.description.map((desc, descIndex) => `
                    <textarea class="theme-description" data-theme-index="${index}" data-desc-index="${descIndex}">${desc}</textarea>
                `).join('');
                
                themesHTML += `
                    <div class="theme-item" data-theme-index="${index}">
                        <input type="text" class="theme-title" value="${theme.title}">
                        <div class="theme-descriptions">
                            ${descriptionInputs}
                        </div>
                        <button type="button" class="add-description-btn" data-theme-index="${index}">Add Description</button>
                        <button type="button" class="remove-theme-btn" data-theme-index="${index}">Remove Theme</button>
                    </div>
                `;
            });
        }
        
        // Create quotes HTML
        let quotesHTML = '';
        if (bookData.quotes && bookData.quotes.length > 0) {
            bookData.quotes.forEach((quote, index) => {
                quotesHTML += `
                    <div class="quote-item" data-quote-index="${index}">
                        <textarea class="quote-text">${quote}</textarea>
                        <button type="button" class="remove-quote-btn" data-quote-index="${index}">Remove Quote</button>
                    </div>
                `;
            });
        }
        
        // Create form HTML
        modal.innerHTML = `
            <div class="book-entry-form">
                <h2>${isNewCopy ? 'Create Copy of Book' : 'Edit Book'}</h2>
                <form id="edit-book-form">
                    <div class="form-group">
                        <label for="book-id">Book ID (no spaces):</label>
                        <input type="text" id="book-id" value="${bookData.id}" ${isNewCopy ? '' : 'readonly'} required>
                        ${isNewCopy ? '<p class="form-help">Creating a copy will add this as a new book</p>' : ''}
                    </div>
                    <div class="form-group">
                        <label for="book-title">Title:</label>
                        <input type="text" id="book-title" value="${bookData.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="book-author">Author:</label>
                        <input type="text" id="book-author" value="${bookData.author}" required>
                    </div>
                    <div class="form-group">
                        <label for="book-overview">Overview:</label>
                        <textarea id="book-overview" rows="4">${bookData.overview || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Cover Image:</label>
                        <div class="cover-preview">
                            <img src="${bookData.coverUrl}" alt="Cover preview">
                        </div>
                        <input type="file" id="edit-cover-upload" accept="image/*" class="file-input">
                        <label for="edit-cover-upload" class="upload-cover-btn">Upload New Cover</label>
                    </div>
                    
                    <h3>Themes</h3>
                    <div class="themes-container">
                        ${themesHTML}
                    </div>
                    <button type="button" id="add-theme-btn">Add Theme</button>
                    
                    <h3>Quotes</h3>
                    <div class="quotes-container">
                        ${quotesHTML}
                    </div>
                    <button type="button" id="add-quote-btn">Add Quote</button>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel-edit">Cancel</button>
                        <button type="submit">Save Changes</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Setup event handlers for dynamic elements
        setupDynamicFormHandlers();
        
        // Handle cover image upload
        const editCoverUpload = document.getElementById('edit-cover-upload');
        let newCoverImageData = null;
        
        if (editCoverUpload) {
            editCoverUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    newCoverImageData = event.target.result;
                    const coverPreview = modal.querySelector('.cover-preview img');
                    if (coverPreview) {
                        coverPreview.src = newCoverImageData;
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        
        // Handle form submission
        const form = document.getElementById('edit-book-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create updated book data object
            const updatedBookData = {
                id: document.getElementById('book-id').value.trim().replace(/\s+/g, '-'),
                title: document.getElementById('book-title').value.trim(),
                author: document.getElementById('book-author').value.trim(),
                overview: document.getElementById('book-overview').value.trim(),
                coverUrl: newCoverImageData || bookData.coverUrl,
                themes: [],
                quotes: []
            };
            
            // Collect themes
            const themeItems = modal.querySelectorAll('.theme-item');
            themeItems.forEach(item => {
                const themeTitle = item.querySelector('.theme-title').value.trim();
                if (!themeTitle) return; // Skip empty themes
                
                const descriptions = Array.from(item.querySelectorAll('.theme-description'))
                    .map(desc => desc.value.trim())
                    .filter(desc => desc); // Filter out empty descriptions
                
                updatedBookData.themes.push({
                    title: themeTitle,
                    description: descriptions
                });
            });
            
            // Collect quotes
            const quoteItems = modal.querySelectorAll('.quote-item');
            quoteItems.forEach(item => {
                const quoteText = item.querySelector('.quote-text').value.trim();
                if (quoteText) {
                    updatedBookData.quotes.push(quoteText);
                }
            });
            
            if (isNewCopy) {
                // Add as new book
                addNewBook(updatedBookData);
            } else {
                // Update existing book
                updateExistingBook(updatedBookData);
            }
            
            // Close modal
            document.body.removeChild(modal);
        });
        
        // Handle cancel
        document.getElementById('cancel-edit').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // Setup handlers for dynamic form elements
    function setupDynamicFormHandlers() {
        // Add theme button
        const addThemeBtn = document.getElementById('add-theme-btn');
        if (addThemeBtn) {
            addThemeBtn.addEventListener('click', function() {
                const themesContainer = document.querySelector('.themes-container');
                const themeIndex = themesContainer.querySelectorAll('.theme-item').length;
                
                const newTheme = document.createElement('div');
                newTheme.className = 'theme-item';
                newTheme.setAttribute('data-theme-index', themeIndex);
                
                newTheme.innerHTML = `
                    <input type="text" class="theme-title" placeholder="Theme Title">
                    <div class="theme-descriptions">
                        <textarea class="theme-description" data-theme-index="${themeIndex}" data-desc-index="0" placeholder="Theme description"></textarea>
                    </div>
                    <button type="button" class="add-description-btn" data-theme-index="${themeIndex}">Add Description</button>
                    <button type="button" class="remove-theme-btn" data-theme-index="${themeIndex}">Remove Theme</button>
                `;
                
                themesContainer.appendChild(newTheme);
                
                // Setup new buttons
                setupRemoveThemeButtons();
                setupAddDescriptionButtons();
            });
        }
        
        // Add quote button
        const addQuoteBtn = document.getElementById('add-quote-btn');
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', function() {
                const quotesContainer = document.querySelector('.quotes-container');
                const quoteIndex = quotesContainer.querySelectorAll('.quote-item').length;
                
                const newQuote = document.createElement('div');
                newQuote.className = 'quote-item';
                newQuote.setAttribute('data-quote-index', quoteIndex);
                
                newQuote.innerHTML = `
                    <textarea class="quote-text" placeholder="Enter quote text"></textarea>
                    <button type="button" class="remove-quote-btn" data-quote-index="${quoteIndex}">Remove Quote</button>
                `;
                
                quotesContainer.appendChild(newQuote);
                
                // Setup new buttons
                setupRemoveQuoteButtons();
            });
        }
        
        // Setup initial buttons
        setupRemoveThemeButtons();
        setupAddDescriptionButtons();
        setupRemoveQuoteButtons();
    }

    // Setup remove theme buttons
    function setupRemoveThemeButtons() {
        document.querySelectorAll('.remove-theme-btn').forEach(btn => {
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const themeItem = this.closest('.theme-item');
                if (themeItem) {
                    themeItem.remove();
                }
            });
        });
    }

    // Setup add description buttons
    function setupAddDescriptionButtons() {
        document.querySelectorAll('.add-description-btn').forEach(btn => {
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const themeItem = this.closest('.theme-item');
                const themeIndex = this.getAttribute('data-theme-index');
                const descriptionsContainer = themeItem.querySelector('.theme-descriptions');
                const descIndex = descriptionsContainer.querySelectorAll('.theme-description').length;
                
                const textarea = document.createElement('textarea');
                textarea.className = 'theme-description';
                textarea.setAttribute('data-theme-index', themeIndex);
                textarea.setAttribute('data-desc-index', descIndex);
                textarea.placeholder = 'Additional description';
                
                descriptionsContainer.appendChild(textarea);
            });
        });
    }

    // Setup remove quote buttons
    function setupRemoveQuoteButtons() {
        document.querySelectorAll('.remove-quote-btn').forEach(btn => {
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const quoteItem = this.closest('.quote-item');
                if (quoteItem) {
                    quoteItem.remove();
                }
            });
        });
    }

    // Function to update an existing book
    function updateExistingBook(bookData) {
        // Get all books from storage
        let books = JSON.parse(localStorage.getItem('customBooks') || '[]');
        
        // Find the book to update
        const index = books.findIndex(book => book.id === bookData.id);
        
        if (index !== -1) {
            // Update the book
            books[index] = bookData;
            
            // Save back to localStorage
            localStorage.setItem('customBooks', JSON.stringify(books));
            
            // Update the UI
            updateBookInUI(bookData);
            
            // Show success message
            alert(`Book "${bookData.title}" has been updated successfully!`);
        } else {
            // Book not found in storage, add it
            books.push(bookData);
            localStorage.setItem('customBooks', JSON.stringify(books));
            
            // Update the UI
            updateBookInUI(bookData);
            
            // Show success message
            alert(`Book "${bookData.title}" has been added to your collection!`);
        }
        
        // Update highlights counter
        updateHighlightsCounter();
    }

    // Function to update book in UI
    function updateBookInUI(bookData) {
        // Update sidebar item
        const bookItem = document.querySelector(`.book-link[data-book-id="${bookData.id}"]`).closest('.book-item');
        if (bookItem) {
            bookItem.querySelector('.book-title').textContent = bookData.title;
            bookItem.querySelector('.book-author').textContent = bookData.author;
            bookItem.querySelector('img').src = bookData.coverUrl;
        }
        
        // Update book content section
        const bookContent = document.getElementById(bookData.id);
        if (bookContent) {
            // Update title and author
            bookContent.querySelector('.book-title-main').textContent = `${bookData.author} - ${bookData.title}`;
            
            // Update overview
            const overviewElem = bookContent.querySelector('.book-intro');
            if (overviewElem) {
                overviewElem.innerHTML = `
                    <h3>Overview</h3>
                    ${bookData.overview ? `<p>${bookData.overview}</p>` : ''}
                `;
            }
            
            // Update themes
            const themesSection = bookContent.querySelector('.key-themes');
            if (themesSection && bookData.themes.length > 0) {
                const themesList = themesSection.querySelector('.theme-list');
                themesList.innerHTML = bookData.themes.map(theme => `
                    <li>
                        <h3>${theme.title}</h3>
                        ${theme.description.map(para => `<p>${para}</p>`).join('')}
                    </li>
                `).join('');
            }
            
            // Update quotes
            const quotesSection = bookContent.querySelector('.significant-quotes');
            if (quotesSection && bookData.quotes.length > 0) {
                const quotesGrid = quotesSection.querySelector('.quote-grid');
                quotesGrid.innerHTML = bookData.quotes.map(quote => `
                    <blockquote class="quote-card">
                        <p>${quote}</p>
                    </blockquote>
                `).join('');
            }
        }
        
        // Update featured book if it exists
        const featuredBook = document.querySelector(`.featured-book-card[onclick="window.location.hash='${bookData.id}'"]`);
        if (featuredBook) {
            featuredBook.querySelector('img').src = bookData.coverUrl;
            featuredBook.querySelector('h3').textContent = bookData.title;
            featuredBook.querySelector('p').textContent = bookData.author;
        }
    }

    // Call this function when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing DOMContentLoaded code ...
        
        // Initialize sidebar scroll detection
        initSidebarScrollDetection();
    });

    // Make sure we only have one DOMContentLoaded handler for the add book functionality
    const initAddBookButton = function() {
        // Find the add book container
        const addBookContainer = document.querySelector('.add-book-container');
        
        if (addBookContainer) {
            console.log('Initializing add book button');
            // Replace with improved version
            addBookContainer.innerHTML = `
                <button id="add-book-btn" class="add-book-button">
                    <i class="fas fa-plus"></i> Add New Book
                </button>
                <input type="file" id="book-upload" accept=".json" class="file-input" aria-label="Upload book data" style="display: none;">
                <input type="file" id="cover-upload" accept="image/*" class="file-input" aria-label="Upload book cover" style="display: none;">
            `;
            
            // Set up the new button handler
            const addBookBtn = document.getElementById('add-book-btn');
            if (addBookBtn) {
                addBookBtn.addEventListener('click', showAddBookOptions);
            }
            
            // Re-attach file upload handlers since we replaced the elements
            const bookUpload = document.getElementById('book-upload');
            if (bookUpload) {
                bookUpload.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        try {
                            const bookData = JSON.parse(event.target.result);
                            addNewBook(bookData);
                            // Reset file input
                            bookUpload.value = '';
                        } catch (error) {
                            alert('Invalid book data format. Please upload a valid JSON file.');
                            console.error('Error parsing book data:', error);
                        }
                    };
                    reader.readAsText(file);
                });
            }
        }
    };

    // Call this function once when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAddBookButton);
    } else {
        // DOM already loaded, run the function now
        initAddBookButton();
    }

    // Function to show add book options in a modal
    function showAddBookOptions() {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'book-entry-modal';
        
        // Create options HTML
        modal.innerHTML = `
            <div class="book-entry-form add-options-form">
                <h2>Add New Book</h2>
                <p>Choose how you want to add a book:</p>
                
                <div class="add-options">
                    <button id="manual-entry-option" class="option-button">
                        <i class="fas fa-edit"></i>
                        <span>Create Manually</span>
                        <p>Add a book by entering details yourself</p>
                    </button>
                    
                    <button id="json-upload-option" class="option-button">
                        <i class="fas fa-file-upload"></i>
                        <span>Upload JSON</span>
                        <p>Import a book from a JSON file</p>
                    </button>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="cancel-options">Cancel</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Handle manual entry option
        document.getElementById('manual-entry-option').addEventListener('click', function() {
            document.body.removeChild(modal);
            showEnhancedBookEntryForm();
        });
        
        // Handle JSON upload option
        document.getElementById('json-upload-option').addEventListener('click', function() {
            document.body.removeChild(modal);
            document.getElementById('book-upload').click();
        });
        
        // Handle cancel
        document.getElementById('cancel-options').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // Enhanced book entry form with better UX
    function showEnhancedBookEntryForm(existingData = null) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'book-entry-modal';
        
        // Default values
        const bookData = existingData || {
            id: '',
            title: '',
            author: '',
            overview: '',
            coverUrl: null,
            themes: [],
            quotes: []
        };
        
        // Create form HTML with improved layout
        modal.innerHTML = `
            <div class="book-entry-form enhanced">
                <h2>${existingData ? 'Edit Book' : 'Add New Book'}</h2>
                
                <form id="enhanced-book-form">
                    <div class="form-layout">
                        <div class="form-left">
                            <div class="form-group">
                                <label for="book-id">Book ID (no spaces):</label>
                                <input type="text" id="book-id" value="${bookData.id}" required 
                                    placeholder="e.g., my-book-title">
                                <p class="field-hint">This will be used in URLs. Use only letters, numbers, and hyphens.</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="book-title">Title:</label>
                                <input type="text" id="book-title" value="${bookData.title}" required
                                    placeholder="Enter book title">
                            </div>
                            
                            <div class="form-group">
                                <label for="book-author">Author:</label>
                                <input type="text" id="book-author" value="${bookData.author}" required
                                    placeholder="Enter author name">
                            </div>
                            
                            <div class="form-group">
                                <label for="book-overview">Overview:</label>
                                <textarea id="book-overview" rows="6" 
                                    placeholder="Enter a brief overview of the book">${bookData.overview}</textarea>
                            </div>
                        </div>
                        
                        <div class="form-right">
                            <div class="cover-upload-container">
                                <div class="cover-preview ${bookData.coverUrl ? 'has-image' : ''}">
                                    ${bookData.coverUrl ? 
                                        `<img src="${bookData.coverUrl}" alt="Book cover preview">` : 
                                        `<div class="no-cover">
                                            <i class="fas fa-book"></i>
                                            <p>No cover image</p>
                                        </div>`
                                    }
                                </div>
                                
                                <label for="cover-upload-input" class="cover-upload-btn">
                                    <i class="fas fa-upload"></i> Upload Cover Image
                                </label>
                                <input type="file" id="cover-upload-input" accept="image/*" class="file-input">
                                
                                <p class="field-hint">Recommended size: 300x450 pixels</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Themes Section -->
                    <div class="themes-section">
                        <h3>Themes <button type="button" id="add-theme-btn" class="small-btn"><i class="fas fa-plus"></i> Add Theme</button></h3>
                        <div id="themes-container">
                            ${bookData.themes.map((theme, index) => `
                                <div class="theme-item" data-index="${index}">
                                    <div class="theme-header">
                                        <input type="text" class="theme-title" value="${theme.title}" placeholder="Theme title">
                                        <button type="button" class="remove-theme-btn"><i class="fas fa-times"></i></button>
                                    </div>
                                    <div class="theme-descriptions">
                                        ${theme.description.map((desc, descIndex) => `
                                            <textarea class="theme-description" data-desc-index="${descIndex}" 
                                                placeholder="Theme description">${desc}</textarea>
                                        `).join('')}
                                    </div>
                                    <button type="button" class="add-desc-btn"><i class="fas fa-plus"></i> Add Description</button>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    <!-- Quotes Section -->
                    <div class="quotes-section">
                        <h3>Quotes <button type="button" id="add-quote-btn" class="small-btn"><i class="fas fa-plus"></i> Add Quote</button></h3>
                        <div id="quotes-container">
                            ${bookData.quotes.map((quote, index) => `
                                <div class="quote-item" data-index="${index}">
                                    <textarea class="quote-text" placeholder="Enter a memorable quote">${quote}</textarea>
                                    <button type="button" class="remove-quote-btn"><i class="fas fa-times"></i></button>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel-entry">Cancel</button>
                        <button type="submit" class="primary-btn">Save Book</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Set up cover image upload
        const coverUploadInput = document.getElementById('cover-upload-input');
        const coverPreview = modal.querySelector('.cover-preview');
        
        coverUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                bookData.coverUrl = event.target.result;
                coverPreview.innerHTML = `<img src="${bookData.coverUrl}" alt="Book cover preview">`;
                coverPreview.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        });
        
        // Set up theme management
        const themesContainer = document.getElementById('themes-container');
        
        // Add theme button
        document.getElementById('add-theme-btn').addEventListener('click', function() {
            addNewTheme(themesContainer);
        });
        
        // Set up existing theme buttons
        setupThemeButtons(modal);
        
        // Set up quote management
        const quotesContainer = document.getElementById('quotes-container');
        
        // Add quote button
        document.getElementById('add-quote-btn').addEventListener('click', function() {
            addNewQuote(quotesContainer);
        });
        
        // Set up existing quote buttons
        setupQuoteButtons(modal);
        
        // Handle form submission
        const form = document.getElementById('enhanced-book-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect basic info
            const updatedBookData = {
                id: document.getElementById('book-id').value.trim().replace(/\s+/g, '-'),
                title: document.getElementById('book-title').value.trim(),
                author: document.getElementById('book-author').value.trim(),
                overview: document.getElementById('book-overview').value.trim(),
                coverUrl: bookData.coverUrl || 'covers/default-cover.jpg',
                themes: [],
                quotes: []
            };
            
            // Collect themes
            modal.querySelectorAll('.theme-item').forEach(themeItem => {
                const themeTitle = themeItem.querySelector('.theme-title').value.trim();
                if (!themeTitle) return; // Skip empty themes
                
                const descriptions = [];
                themeItem.querySelectorAll('.theme-description').forEach(descEl => {
                    const descText = descEl.value.trim();
                    if (descText) descriptions.push(descText);
                });
                
                updatedBookData.themes.push({
                    title: themeTitle,
                    description: descriptions
                });
            });
            
            // Collect quotes
            modal.querySelectorAll('.quote-item').forEach(quoteItem => {
                const quoteText = quoteItem.querySelector('.quote-text').value.trim();
                if (quoteText) {
                    updatedBookData.quotes.push(quoteText);
                }
            });
            
            // Validate
            if (!updatedBookData.id || !updatedBookData.title || !updatedBookData.author) {
                alert('Please fill in all required fields (ID, Title, and Author)');
                return;
            }
            
            // Add or update the book
            if (existingData) {
                updateExistingBook(updatedBookData);
            } else {
                addNewBook(updatedBookData);
            }
            
            // Close modal
            document.body.removeChild(modal);
        });
        
        // Handle cancel
        document.getElementById('cancel-entry').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // Helper function to add a new theme
    function addNewTheme(container) {
        const themeIndex = container.querySelectorAll('.theme-item').length;
        
        const themeEl = document.createElement('div');
        themeEl.className = 'theme-item';
        themeEl.setAttribute('data-index', themeIndex);
        
        themeEl.innerHTML = `
            <div class="theme-header">
                <input type="text" class="theme-title" placeholder="Theme title">
                <button type="button" class="remove-theme-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="theme-descriptions">
                <textarea class="theme-description" data-desc-index="0" placeholder="Theme description"></textarea>
            </div>
            <button type="button" class="add-desc-btn"><i class="fas fa-plus"></i> Add Description</button>
        `;
        
        container.appendChild(themeEl);
        
        // Set up buttons
        setupThemeItemButtons(themeEl);
    }

    // Helper function to set up theme buttons
    function setupThemeButtons(container) {
        // Set up remove theme buttons
        container.querySelectorAll('.remove-theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const themeItem = this.closest('.theme-item');
                themeItem.remove();
            });
        });
        
        // Set up add description buttons
        container.querySelectorAll('.add-desc-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const themeItem = this.closest('.theme-item');
                const descriptionsContainer = themeItem.querySelector('.theme-descriptions');
                const descIndex = descriptionsContainer.querySelectorAll('.theme-description').length;
                
                const textarea = document.createElement('textarea');
                textarea.className = 'theme-description';
                textarea.setAttribute('data-desc-index', descIndex);
                textarea.placeholder = 'Theme description';
                
                descriptionsContainer.appendChild(textarea);
            });
        });
    }

    // Helper function to set up buttons for a single theme item
    function setupThemeItemButtons(themeItem) {
        // Set up remove theme button
        themeItem.querySelector('.remove-theme-btn').addEventListener('click', function() {
            themeItem.remove();
        });
        
        // Set up add description button
        themeItem.querySelector('.add-desc-btn').addEventListener('click', function() {
            const descriptionsContainer = themeItem.querySelector('.theme-descriptions');
            const descIndex = descriptionsContainer.querySelectorAll('.theme-description').length;
            
            const textarea = document.createElement('textarea');
            textarea.className = 'theme-description';
            textarea.setAttribute('data-desc-index', descIndex);
            textarea.placeholder = 'Theme description';
            
            descriptionsContainer.appendChild(textarea);
        });
    }

    // Helper function to add a new quote
    function addNewQuote(container) {
        const quoteIndex = container.querySelectorAll('.quote-item').length;
        
        const quoteEl = document.createElement('div');
        quoteEl.className = 'quote-item';
        quoteEl.setAttribute('data-index', quoteIndex);
        
        quoteEl.innerHTML = `
            <textarea class="quote-text" placeholder="Enter a memorable quote"></textarea>
            <button type="button" class="remove-quote-btn"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(quoteEl);
        
        // Set up remove button
        quoteEl.querySelector('.remove-quote-btn').addEventListener('click', function() {
            quoteEl.remove();
        });
    }

    // Helper function to set up quote buttons
    function setupQuoteButtons(container) {
        container.querySelectorAll('.remove-quote-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const quoteItem = this.closest('.quote-item');
                quoteItem.remove();
            });
        });
    }

    // Add this near the top of your DOMContentLoaded event handler
    async function loadAllBooks() {
        try {
            const response = await fetch('data/books/index.json');
            const bookList = await response.json();
            
            for (const bookId of bookList) {
                try {
                    const bookResponse = await fetch(`data/books/${bookId}.json`);
                    const bookData = await bookResponse.json();
                    addBookToSidebar(bookData);
                    addBookToMainContent(bookData);
                } catch (error) {
                    console.error(`Error loading book ${bookId}:`, error);
                }
            }
            
            // After loading all books, update the UI
            updateHighlightsCounter();
            updateFeaturedBooks();
            
            // Show welcome section by default
            showWelcomeSection();
        } catch (error) {
            console.error('Error loading book index:', error);
        }
    }

    // Call this when the page loads
    loadAllBooks();

    // Add click event listener to the Easter egg
    const easterEgg = document.getElementById('easterEgg');
    if (easterEgg) {
        easterEgg.addEventListener('click', () => {
            alert("You followed the white rabbit");
        });
    }
});
