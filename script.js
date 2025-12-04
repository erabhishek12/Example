/* ========================================
   JAVASOURCECODE V4.0 ULTRA - COMPLETE JAVASCRIPT
   With Thumbnail Support
   Total Lines: 2200+
======================================== */

'use strict';

/* ========================================
   GLOBAL CONFIGURATION
======================================== */
const CONFIG = {
    COURSES_SHEET_ID: '1gt3LLr9i5Nu888DVSrHyGCZaqHL6uqnDI1X3sMS7Qhg',
    NOTES_SHEET_ID: '1gt3LLr9i5Nu888DVSrHyGCZaqHL6uqnDI1X3sMS7Qhg',
    COURSES_SHEET_NAME: 'Courses',
    NOTES_SHEET_NAME: 'Notes',
    API_URL: 'https://opensheet.elk.sh/',
    ITEMS_PER_PAGE: 9,
    TYPING_TEXTS: [
        'Master Programming Skills',
        'Learn. Code. Succeed.',
        'Free Premium Education',
        'Join 50,000+ Developers'
    ]
};

const FILTER_MAPPING = {
    'B.Tech': {
        branches: ['CSE', 'ECE', 'ME', 'Civil', 'IT', 'General'],
        semesters: ['1', '2', '3', '4', '5', '6', '7', '8']
    },
    'BCA': {
        branches: ['General', 'IT', 'Web Development'],
        semesters: ['1', '2', '3', '4', '5', '6']
    },
    'BBA': {
        branches: ['General Management', 'Finance', 'Marketing', 'IT Management'],
        semesters: ['1', '2', '3', '4', '5', '6']
    },
    'General': {
        branches: ['Programming', 'Design', 'Data Science'],
        semesters: ['N/A']
    }
};

/* ========================================
   APPLICATION STATE
======================================== */
const AppState = {
    courses: [],
    notes: [],
    filteredCourses: [],
    filteredNotes: [],
    currentCourseType: 'all',
    currentBranch: 'all',
    currentSemester: 'all',
    currentNotesCourseType: 'all',
    currentNotesBranch: 'all',
    currentNotesSemester: 'all',
    currentPage: 1,
    notesCurrentPage: 1,
    isVoiceSearchActive: false,
    userStreak: 0,
    lastVisit: null,
    achievements: [],
    currentView: 'grid',
    notesCurrentView: 'grid',
    recognition: null,
    testimonialIndex: 0,
    isDataLoaded: false
};

/* ========================================
   DOM ELEMENTS CACHE
======================================== */
const DOM = {
    loadingScreen: null,
    loadingProgress: null,
    loadingPercentage: null,
    loadingText: null,
    navbar: null,
    hamburger: null,
    navMenu: null,
    navLinks: null,
    themeToggle: null,
    voiceSearch: null,
    scrollToTop: null,
    progressBar: null,
    coursesGrid: null,
    notesGrid: null,
    coursesPagination: null,
    notesPagination: null,
    notificationBtn: null,
    notificationPanel: null,
    achievementBadges: null,
    notificationContainer: null
};

/* ========================================
   INITIALIZATION
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        cacheDOMElements();
        showLoadingScreen();
        
        // Sequential initialization with loading updates
        await initWithProgress('Initializing theme...', 10, initializeTheme);
        await initWithProgress('Setting up navigation...', 20, initializeNavigation);
        await initWithProgress('Loading user data...', 30, initializeUserTracking);
        await initWithProgress('Initializing features...', 40, initializeFeatures);
        await initWithProgress('Loading courses...', 60, fetchCourses);
        await initWithProgress('Loading notes...', 80, fetchNotes);
        await initWithProgress('Finalizing setup...', 95, initializeFinalFeatures);
        
        updateLoadingProgress(100, 'Ready!');
        
        setTimeout(hideLoadingScreen, 500);
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateLoadingText('Error loading application. Please refresh.');
        showNotification('Failed to initialize application', 'error');
    }
}

function cacheDOMElements() {
    DOM.loadingScreen = document.getElementById('loadingScreen');
    DOM.loadingProgress = document.getElementById('loadingProgress');
    DOM.loadingPercentage = document.getElementById('loadingPercentage');
    DOM.loadingText = document.getElementById('loadingText');
    DOM.navbar = document.getElementById('navbar');
    DOM.hamburger = document.getElementById('hamburger');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.navLinks = document.querySelectorAll('.nav-link');
    DOM.themeToggle = document.getElementById('themeToggle');
    DOM.voiceSearch = document.getElementById('voiceSearch');
    DOM.scrollToTop = document.getElementById('scrollToTop');
    DOM.progressBar = document.getElementById('progressBar');
    DOM.coursesGrid = document.getElementById('coursesGrid');
    DOM.notesGrid = document.getElementById('notesGrid');
    DOM.coursesPagination = document.getElementById('coursesPagination');
    DOM.notesPagination = document.getElementById('notesPagination');
    DOM.notificationBtn = document.getElementById('notificationBtn');
    DOM.notificationPanel = document.getElementById('notificationPanel');
    DOM.achievementBadges = document.getElementById('achievementBadges');
    DOM.notificationContainer = document.getElementById('notificationContainer');
}

async function initWithProgress(text, progress, fn) {
    updateLoadingProgress(progress, text);
    await new Promise(resolve => setTimeout(resolve, 200));
    await fn();
}

function showLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.add('hidden');
    }
}

function updateLoadingProgress(percent, text) {
    if (DOM.loadingProgress) {
        DOM.loadingProgress.style.width = `${percent}%`;
    }
    if (DOM.loadingPercentage) {
        DOM.loadingPercentage.textContent = `${percent}%`;
    }
    if (text && DOM.loadingText) {
        DOM.loadingText.textContent = text;
    }
}

function updateLoadingText(text) {
    if (DOM.loadingText) {
        DOM.loadingText.textContent = text;
    }
}

/* ========================================
   THEME MANAGEMENT
======================================== */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(
        `${newTheme === 'dark' ? '🌙' : '☀️'} ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
        'success'
    );
}

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/* ========================================
   NAVIGATION
======================================== */
function initializeNavigation() {
    // Scroll effects
    window.addEventListener('scroll', handleScroll);
    
    // Hamburger menu
    if (DOM.hamburger && DOM.navMenu) {
        DOM.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Nav links
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Scroll to top button
    if (DOM.scrollToTop) {
        DOM.scrollToTop.addEventListener('click', scrollToTop);
    }
    
    // Notification panel
    if (DOM.notificationBtn) {
        DOM.notificationBtn.addEventListener('click', toggleNotificationPanel);
    }
    
    // Close notification panel on outside click
    document.addEventListener('click', (e) => {
        if (DOM.notificationPanel && 
            !DOM.notificationPanel.contains(e.target) && 
            !DOM.notificationBtn.contains(e.target)) {
            DOM.notificationPanel.classList.remove('active');
        }
    });
    
    // Clear notifications
    const clearBtn = document.getElementById('clearNotifications');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearNotifications);
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (DOM.navbar) {
        if (scrollY > 50) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
    }
    
    // Progress bar
    updateProgressBar();
    
    // Active nav link
    updateActiveNavLink();
    
    // Scroll to top button
    if (DOM.scrollToTop) {
        if (scrollY > 500) {
            DOM.scrollToTop.classList.add('visible');
        } else {
            DOM.scrollToTop.classList.remove('visible');
        }
    }
}

function updateProgressBar() {
    if (!DOM.progressBar) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    DOM.progressBar.style.width = scrolled + '%';
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile menu
        if (DOM.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleNotificationPanel() {
    if (DOM.notificationPanel) {
        DOM.notificationPanel.classList.toggle('active');
    }
}

function clearNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (notificationList) {
        notificationList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No notifications</p>';
    }
    if (DOM.notificationPanel) {
        DOM.notificationPanel.classList.remove('active');
    }
}

/* ========================================
   FEATURES INITIALIZATION
======================================== */
function initializeFeatures() {
    initializeTypingEffect();
    initializeVoiceSearch();
    initializeAnimations();
    initializeParticles();
    initializeCustomCursor();
}

function initializeFinalFeatures() {
    initializeFilters();
    initializeModals();
    initializeContactForm();
    initializeFAQ();
    initializeTestimonials();
    initializeNewsletterForm();
    initializeAchievements();
}

/* ========================================
   TYPING EFFECT
======================================== */
function initializeTypingEffect() {
    const element = document.getElementById('typingText');
    if (!element) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = CONFIG.TYPING_TEXTS[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % CONFIG.TYPING_TEXTS.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    type();
}

/* ========================================
   VOICE SEARCH
======================================== */
function initializeVoiceSearch() {
    if (!DOM.voiceSearch) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        DOM.voiceSearch.style.display = 'none';
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    AppState.recognition = new SpeechRecognition();
    
    AppState.recognition.continuous = false;
    AppState.recognition.lang = 'en-US';
    AppState.recognition.interimResults = false;
    
    DOM.voiceSearch.addEventListener('click', toggleVoiceSearch);
    
    AppState.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const courseSearch = document.getElementById('courseSearch');
        if (courseSearch) {
            courseSearch.value = transcript;
            applyFilters();
        }
        showNotification(`🎤 Searching for: ${transcript}`, 'success');
    };
    
    AppState.recognition.onend = () => {
        AppState.isVoiceSearchActive = false;
        DOM.voiceSearch.classList.remove('listening');
    };
    
    AppState.recognition.onerror = (event) => {
        console.error('Voice search error:', event.error);
        showNotification('Voice search error. Please try again.', 'error');
        DOM.voiceSearch.classList.remove('listening');
    };
}

function toggleVoiceSearch() {
    if (AppState.isVoiceSearchActive) {
        AppState.recognition.stop();
        AppState.isVoiceSearchActive = false;
        DOM.voiceSearch.classList.remove('listening');
    } else {
        AppState.recognition.start();
        AppState.isVoiceSearchActive = true;
        DOM.voiceSearch.classList.add('listening');
        showNotification('🎤 Listening... Speak now', 'info');
    }
}

/* ========================================
   ANIMATIONS
======================================== */
function initializeAnimations() {
    // Number animation
    const numberElements = document.querySelectorAll('.stat-number, .counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    numberElements.forEach(el => observer.observe(el));
    
    // Scroll reveal
    const revealElements = document.querySelectorAll('.feature-card, .course-card, .note-card, .roadmap-step, .team-card, .testimonial-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
}

function animateNumber(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

/* ========================================
   PARTICLES BACKGROUND
======================================== */
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#6366f1' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

/* ========================================
   CUSTOM CURSOR
======================================== */
function initializeCustomCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    if (!cursorDot || !cursorOutline) return;
    
    // Hide default cursor on desktop
    if (window.innerWidth > 768) {
        document.body.style.cursor = 'none';
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });
        
        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .course-card, .note-card, .filter-tab');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    }
}

/* ========================================
   DATA FETCHING
======================================== */
async function fetchCourses() {
    try {
        const url = `${CONFIG.API_URL}${CONFIG.COURSES_SHEET_ID}/${CONFIG.COURSES_SHEET_NAME}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        
        AppState.courses = data.map(course => ({
            ...course,
            CourseType: course.CourseType || 'General',
            Branch: course.Branch || 'General',
            Semester: course.Semester || 'N/A',
            Category: course.Category || 'General',
            Title: course.Title || 'Untitled Course',
            Description: course.Description || 'No description available',
            Students: course.Students || '0',
            URL: course.URL || '#',
            Thumbnail: course.Thumbnail || '',
            Duration: course.Duration || '',
            Rating: course.Rating || '0'
        }));
        
        AppState.filteredCourses = [...AppState.courses];
        AppState.isDataLoaded = true;
        displayCourses();
        
    } catch (error) {
        console.error('Error fetching courses:', error);
        showNotification('Failed to load courses. Please refresh the page.', 'error');
        displayErrorState('courses');
    }
}

async function fetchNotes() {
    try {
        const url = `${CONFIG.API_URL}${CONFIG.NOTES_SHEET_ID}/${CONFIG.NOTES_SHEET_NAME}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }
        
        const data = await response.json();
        
        AppState.notes = data.map(note => ({
            ...note,
            CourseType: note.CourseType || 'General',
            Branch: note.Branch || 'General',
            Semester: note.Semester || 'N/A',
            Type: note.Type || 'PDF',
            Title: note.Title || 'Untitled Note',
            Subject: note.Subject || 'No subject specified',
            Downloads: note.Downloads || '0',
            URL: note.URL || '#',
            Thumbnail: note.Thumbnail || '',
            Rating: note.Rating || '0'
        }));
        
        AppState.filteredNotes = [...AppState.notes];
        renderNotes();
        
    } catch (error) {
        console.error('Error fetching notes:', error);
        showNotification('Failed to load notes. Please refresh the page.', 'error');
        displayErrorState('notes');
    }
}

function displayErrorState(type) {
    const grid = type === 'courses' ? DOM.coursesGrid : DOM.notesGrid;
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--accent-orange); margin-bottom: 1.5rem;"></i>
                <h3>Failed to load ${type}</h3>
                <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">There was an error loading the data. Please check your connection and try again.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    <span>Reload Page</span>
                </button>
            </div>
        `;
    }
}

/* ========================================
   FILTERS INITIALIZATION
======================================== */
function initializeFilters() {
    // Course filters
    const courseTypeFilter = document.getElementById('courseTypeFilter');
    const branchFilter = document.getElementById('branchFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const courseSearch = document.getElementById('courseSearch');
    const clearCourseSearch = document.getElementById('clearCourseSearch');
    const resetFilters = document.getElementById('resetFilters');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    if (courseTypeFilter) courseTypeFilter.addEventListener('change', handleCourseTypeFilter);
    if (branchFilter) branchFilter.addEventListener('change', handleBranchFilter);
    if (semesterFilter) semesterFilter.addEventListener('change', handleSemesterFilter);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (courseSearch) {
        courseSearch.addEventListener('input', handleSearchInput);
    }
    if (clearCourseSearch) {
        clearCourseSearch.addEventListener('click', () => {
            courseSearch.value = '';
            clearCourseSearch.style.display = 'none';
            applyFilters();
        });
    }
    if (resetFilters) resetFilters.addEventListener('click', resetCourseFilters);
    if (gridView) gridView.addEventListener('click', () => toggleView('grid', 'courses'));
    if (listView) listView.addEventListener('click', () => toggleView('list', 'courses'));
    
    // Notes filters
    const notesCourseTypeFilter = document.getElementById('notesCourseTypeFilter');
    const notesBranchFilter = document.getElementById('notesBranchFilter');
    const notesSemesterFilter = document.getElementById('notesSemesterFilter');
    const notesTypeFilter = document.getElementById('notesTypeFilter');
    const notesSortFilter = document.getElementById('notesSortFilter');
    const notesSearch = document.getElementById('notesSearch');
    const clearNotesSearch = document.getElementById('clearNotesSearch');
    const resetNotesFilters = document.getElementById('resetNotesFilters');
    const notesGridView = document.getElementById('notesGridView');
    const notesListView = document.getElementById('notesListView');
    
    if (notesCourseTypeFilter) notesCourseTypeFilter.addEventListener('change', handleNotesCourseTypeFilter);
    if (notesBranchFilter) notesBranchFilter.addEventListener('change', handleNotesBranchFilter);
    if (notesSemesterFilter) notesSemesterFilter.addEventListener('change', handleNotesSemesterFilter);
    if (notesTypeFilter) notesTypeFilter.addEventListener('change', applyNotesFilters);
    if (notesSortFilter) notesSortFilter.addEventListener('change', applyNotesFilters);
    if (notesSearch) {
        notesSearch.addEventListener('input', handleNotesSearchInput);
    }
    if (clearNotesSearch) {
        clearNotesSearch.addEventListener('click', () => {
            notesSearch.value = '';
            clearNotesSearch.style.display = 'none';
            applyNotesFilters();
        });
    }
    if (resetNotesFilters) resetNotesFilters.addEventListener('click', resetNotesFiltersFunc);
    if (notesGridView) notesGridView.addEventListener('click', () => toggleView('grid', 'notes'));
    if (notesListView) notesListView.addEventListener('click', () => toggleView('list', 'notes'));
    
    // Filter tabs
    initializeFilterTabs();
}

function initializeFilterTabs() {
    const courseTabs = document.querySelectorAll('#filterTabs .filter-tab');
    courseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            courseTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    const notesTabs = document.querySelectorAll('#notesFilterTabs .filter-tab');
    notesTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            notesTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function handleSearchInput(e) {
    const clearBtn = document.getElementById('clearCourseSearch');
    if (clearBtn) {
        clearBtn.style.display = e.target.value ? 'flex' : 'none';
    }
    debounce(applyFilters, 300)();
}

function handleNotesSearchInput(e) {
    const clearBtn = document.getElementById('clearNotesSearch');
    if (clearBtn) {
        clearBtn.style.display = e.target.value ? 'flex' : 'none';
    }
    debounce(applyNotesFilters, 300)();
}

function toggleView(view, type) {
    if (type === 'courses') {
        AppState.currentView = view;
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');
        if (view === 'grid') {
            gridBtn?.classList.add('active');
            listBtn?.classList.remove('active');
            DOM.coursesGrid?.classList.remove('list-view');
        } else {
            listBtn?.classList.add('active');
            gridBtn?.classList.remove('active');
            DOM.coursesGrid?.classList.add('list-view');
        }
    } else {
        AppState.notesCurrentView = view;
        const gridBtn = document.getElementById('notesGridView');
        const listBtn = document.getElementById('notesListView');
        if (view === 'grid') {
            gridBtn?.classList.add('active');
            listBtn?.classList.remove('active');
            DOM.notesGrid?.classList.remove('list-view');
        } else {
            listBtn?.classList.add('active');
            gridBtn?.classList.remove('active');
            DOM.notesGrid?.classList.add('list-view');
        }
    }
}

function resetCourseFilters() {
    document.getElementById('courseTypeFilter').value = 'all';
    document.getElementById('branchFilter').value = 'all';
    document.getElementById('branchFilter').disabled = true;
    document.getElementById('semesterFilter').value = 'all';
    document.getElementById('semesterFilter').disabled = true;
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('sortFilter').value = 'popular';
    document.getElementById('courseSearch').value = '';
    document.getElementById('clearCourseSearch').style.display = 'none';
    
    AppState.currentCourseType = 'all';
    AppState.currentBranch = 'all';
    AppState.currentSemester = 'all';
    
    applyFilters();
    showNotification('Filters reset', 'success');
}

function resetNotesFiltersFunc() {
    document.getElementById('notesCourseTypeFilter').value = 'all';
    document.getElementById('notesBranchFilter').value = 'all';
    document.getElementById('notesBranchFilter').disabled = true;
    document.getElementById('notesSemesterFilter').value = 'all';
    document.getElementById('notesSemesterFilter').disabled = true;
    document.getElementById('notesTypeFilter').value = 'all';
    document.getElementById('notesSortFilter').value = 'newest';
    document.getElementById('notesSearch').value = '';
    document.getElementById('clearNotesSearch').style.display = 'none';
    
    AppState.currentNotesCourseType = 'all';
    AppState.currentNotesBranch = 'all';
    AppState.currentNotesSemester = 'all';
    
    applyNotesFilters();
    showNotification('Filters reset', 'success');
}

/* ========================================
   HIERARCHICAL FILTERS
======================================== */
function handleCourseTypeFilter(e) {
    const courseType = e.target.value;
    AppState.currentCourseType = courseType;
    
    const branchFilter = document.getElementById('branchFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    
    branchFilter.innerHTML = '<option value="all">Select Branch</option>';
    semesterFilter.innerHTML = '<option value="all">Select Semester</option>';
    AppState.currentBranch = 'all';
    AppState.currentSemester = 'all';
    
    if (courseType !== 'all' && FILTER_MAPPING[courseType]) {
        branchFilter.disabled = false;
        FILTER_MAPPING[courseType].branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = branch;
            branchFilter.appendChild(option);
        });
        
        semesterFilter.disabled = true;
    } else {
        branchFilter.disabled = true;
        semesterFilter.disabled = true;
    }
    
    applyFilters();
}

function handleBranchFilter(e) {
    const branch = e.target.value;
    AppState.currentBranch = branch;
    
    const semesterFilter = document.getElementById('semesterFilter');
    semesterFilter.innerHTML = '<option value="all">Select Semester</option>';
    AppState.currentSemester = 'all';
    
    if (branch !== 'all' && AppState.currentCourseType !== 'all') {
        const courseType = AppState.currentCourseType;
        if (FILTER_MAPPING[courseType]) {
            semesterFilter.disabled = false;
            FILTER_MAPPING[courseType].semesters.forEach(semester => {
                const option = document.createElement('option');
                option.value = semester;
                option.textContent = semester === 'N/A' ? 'Not Applicable' : `Semester ${semester}`;
                semesterFilter.appendChild(option);
            });
        }
    } else {
        semesterFilter.disabled = true;
    }
    
    applyFilters();
}

function handleSemesterFilter(e) {
    AppState.currentSemester = e.target.value;
    applyFilters();
}

function handleNotesCourseTypeFilter(e) {
    const courseType = e.target.value;
    AppState.currentNotesCourseType = courseType;
    
    const branchFilter = document.getElementById('notesBranchFilter');
    const semesterFilter = document.getElementById('notesSemesterFilter');
    
    branchFilter.innerHTML = '<option value="all">Select Branch</option>';
    semesterFilter.innerHTML = '<option value="all">Select Semester</option>';
    AppState.currentNotesBranch = 'all';
    AppState.currentNotesSemester = 'all';
    
    if (courseType !== 'all' && FILTER_MAPPING[courseType]) {
        branchFilter.disabled = false;
        FILTER_MAPPING[courseType].branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = branch;
            branchFilter.appendChild(option);
        });
        
        semesterFilter.disabled = true;
    } else {
        branchFilter.disabled = true;
        semesterFilter.disabled = true;
    }
    
    applyNotesFilters();
}

function handleNotesBranchFilter(e) {
    const branch = e.target.value;
    AppState.currentNotesBranch = branch;
    
    const semesterFilter = document.getElementById('notesSemesterFilter');
    semesterFilter.innerHTML = '<option value="all">Select Semester</option>';
    AppState.currentNotesSemester = 'all';
    
    if (branch !== 'all' && AppState.currentNotesCourseType !== 'all') {
        const courseType = AppState.currentNotesCourseType;
        if (FILTER_MAPPING[courseType]) {
            semesterFilter.disabled = false;
            FILTER_MAPPING[courseType].semesters.forEach(semester => {
                const option = document.createElement('option');
                option.value = semester;
                option.textContent = semester === 'N/A' ? 'Not Applicable' : `Semester ${semester}`;
                semesterFilter.appendChild(option);
            });
        }
    } else {
        semesterFilter.disabled = true;
    }
    
    applyNotesFilters();
}

function handleNotesSemesterFilter(e) {
    AppState.currentNotesSemester = e.target.value;
    applyNotesFilters();
}

/* ========================================
   APPLY FILTERS
======================================== */
function applyFilters() {
    let filtered = [...AppState.courses];
    
    // Hierarchical filters
    if (AppState.currentCourseType !== 'all') {
        filtered = filtered.filter(course => course.CourseType === AppState.currentCourseType);
    }
    
    if (AppState.currentBranch !== 'all') {
        filtered = filtered.filter(course => course.Branch === AppState.currentBranch);
    }
    
    if (AppState.currentSemester !== 'all') {
        filtered = filtered.filter(course => course.Semester === AppState.currentSemester);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter')?.value;
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(course => course.Category === categoryFilter);
    }
    
    // Search filter
    const searchTerm = document.getElementById('courseSearch')?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(course =>
            course.Title?.toLowerCase().includes(searchTerm) ||
            course.Description?.toLowerCase().includes(searchTerm) ||
            course.Category?.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort
    const sortFilter = document.getElementById('sortFilter')?.value || 'popular';
    filtered = sortCourses(filtered, sortFilter);
    
    AppState.filteredCourses = filtered;
    AppState.currentPage = 1;
    displayCourses();
}

function applyNotesFilters() {
    let filtered = [...AppState.notes];
    
    // Hierarchical filters
    if (AppState.currentNotesCourseType !== 'all') {
        filtered = filtered.filter(note => note.CourseType === AppState.currentNotesCourseType);
    }
    
    if (AppState.currentNotesBranch !== 'all') {
        filtered = filtered.filter(note => note.Branch === AppState.currentNotesBranch);
    }
    
    if (AppState.currentNotesSemester !== 'all') {
        filtered = filtered.filter(note => note.Semester === AppState.currentNotesSemester);
    }
    
    // Type filter
    const typeFilter = document.getElementById('notesTypeFilter')?.value;
    if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter(note => note.Type === typeFilter);
    }
    
    // Search filter
    const searchTerm = document.getElementById('notesSearch')?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(note =>
            note.Title?.toLowerCase().includes(searchTerm) ||
            note.Subject?.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort
    const sortFilter = document.getElementById('notesSortFilter')?.value || 'newest';
    filtered = sortNotes(filtered, sortFilter);
    
    AppState.filteredNotes = filtered;
    AppState.notesCurrentPage = 1;
    renderNotes();
}

function sortCourses(courses, sortBy) {
    switch (sortBy) {
        case 'newest':
            return courses.sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));
        case 'a-z':
            return courses.sort((a, b) => (a.Title || '').localeCompare(b.Title || ''));
        case 'z-a':
            return courses.sort((a, b) => (b.Title || '').localeCompare(a.Title || ''));
        case 'rating':
            return courses.sort((a, b) => (parseFloat(b.Rating) || 0) - (parseFloat(a.Rating) || 0));
        case 'popular':
        default:
            return courses.sort((a, b) => (parseInt(b.Students) || 0) - (parseInt(a.Students) || 0));
    }
}

function sortNotes(notes, sortBy) {
    switch (sortBy) {
        case 'newest':
            return notes.sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));
        case 'a-z':
            return notes.sort((a, b) => (a.Title || '').localeCompare(b.Title || ''));
        case 'rating':
            return notes.sort((a, b) => (parseFloat(b.Rating) || 0) - (parseFloat(a.Rating) || 0));
        case 'popular':
        default:
            return notes.sort((a, b) => (parseInt(b.Downloads) || 0) - (parseInt(a.Downloads) || 0));
    }
}

/* ========================================
   DISPLAY FUNCTIONS WITH THUMBNAILS
======================================== */
function displayCourses() {
    if (!DOM.coursesGrid) return;
    
    const startIndex = (AppState.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
    const coursesToDisplay = AppState.filteredCourses.slice(startIndex, endIndex);
    
    if (coursesToDisplay.length === 0) {
        DOM.coursesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-tertiary); margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">No courses found</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="resetCourseFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        if (DOM.coursesPagination) DOM.coursesPagination.innerHTML = '';
        return;
    }
    
    DOM.coursesGrid.innerHTML = coursesToDisplay.map((course, index) => {
        const thumbnail = course.Thumbnail || getYouTubeThumbnail(course.URL) || '';
        const hasThumbnail = thumbnail && thumbnail !== '';
        
        return `
        <div class="course-card glass-morphism" data-course-id="${course.ID || index}" style="animation-delay: ${index * 0.1}s">
            ${hasThumbnail ? `
            <div class="card-thumbnail">
                <img src="${thumbnail}" 
                     alt="${escapeHtml(course.Title || 'Course thumbnail')}" 
                     loading="lazy"
                     onerror="this.parentElement.innerHTML='<div class=\\'thumbnail-placeholder\\'><i class=\\'fas fa-play-circle\\'></i></div>'">
                <div class="thumbnail-overlay">
                    <i class="fas fa-play"></i>
                </div>
                <div class="thumbnail-badge video">
                    <i class="fas fa-video"></i>
                    Video
                </div>
                ${course.Duration ? `<div class="video-duration">${escapeHtml(course.Duration)}</div>` : ''}
            </div>
            ` : ''}
            
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <span class="card-badge">${escapeHtml(course.CourseType || 'General')}</span>
            </div>
            <h3 class="card-title">${escapeHtml(course.Title || 'Untitled Course')}</h3>
            <p class="card-description">${truncateText(course.Description || 'No description available', 100)}</p>
            <div class="card-meta">
                <span class="meta-item">
                    <i class="fas fa-code-branch"></i>
                    ${escapeHtml(course.Branch || 'General')}
                </span>
                <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    Sem ${escapeHtml(course.Semester || 'N/A')}
                </span>
                <span class="meta-item">
                    <i class="fas fa-users"></i>
                    ${formatNumber(course.Students || '0')} Students
                </span>
            </div>
            <div class="card-footer">
                <button class="card-btn card-btn-primary" onclick="viewCourse('${escapeHtml(course.URL || '#')}')">
                    <i class="fas fa-play-circle"></i>
                    Start Learning
                </button>
                <button class="card-btn card-btn-secondary" onclick="shareCourse('${escapeHtml(course.Title || '')}')">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `}).join('');
    
    displayPagination('courses');
}

function renderNotes() {
    if (!DOM.notesGrid) return;
    
    const startIndex = (AppState.notesCurrentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
    const notesToDisplay = AppState.filteredNotes.slice(startIndex, endIndex);
    
    if (notesToDisplay.length === 0) {
        DOM.notesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-tertiary); margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">No notes found</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="resetNotesFiltersFunc()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        if (DOM.notesPagination) DOM.notesPagination.innerHTML = '';
        return;
    }
    
    DOM.notesGrid.innerHTML = notesToDisplay.map((note, index) => {
        const thumbnail = note.Thumbnail || getDefaultNoteThumbnail(note.Type) || '';
        const hasThumbnail = thumbnail && thumbnail !== '';
        const noteType = (note.Type || 'PDF').toLowerCase();
        const typeIcon = getNoteTypeIcon(note.Type);
        
        return `
        <div class="note-card glass-morphism" data-note-id="${note.ID || index}" style="animation-delay: ${index * 0.1}s">
            ${hasThumbnail ? `
            <div class="card-thumbnail">
                <img src="${thumbnail}" 
                     alt="${escapeHtml(note.Title || 'Note thumbnail')}" 
                     loading="lazy"
                     onerror="this.parentElement.innerHTML='<div class=\\'thumbnail-placeholder\\'><i class=\\'${typeIcon}\\'></i></div>'">
                <div class="thumbnail-overlay">
                    <i class="fas fa-download"></i>
                </div>
                <div class="thumbnail-badge ${noteType}">
                    <i class="${typeIcon}"></i>
                    ${escapeHtml(note.Type || 'PDF')}
                </div>
            </div>
            ` : ''}
            
            <div class="card-header">
                <div class="card-icon">
                    <i class="${typeIcon}"></i>
                </div>
                <span class="card-badge">${escapeHtml(note.Type || 'PDF')}</span>
            </div>
            <h3 class="card-title">${escapeHtml(note.Title || 'Untitled Note')}</h3>
            <p class="card-description">${truncateText(note.Subject || 'No subject specified', 100)}</p>
            <div class="card-meta">
                <span class="meta-item">
                    <i class="fas fa-code-branch"></i>
                    ${escapeHtml(note.Branch || 'General')}
                </span>
                <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    Sem ${escapeHtml(note.Semester || 'N/A')}
                </span>
                <span class="meta-item">
                    <i class="fas fa-download"></i>
                    ${formatNumber(note.Downloads || '0')} Downloads
                </span>
            </div>
            <div class="card-footer">
                <button class="card-btn card-btn-primary" onclick="downloadNote('${escapeHtml(note.URL || '#')}', '${escapeHtml(note.Title || 'note')}')">
                    <i class="fas fa-download"></i>
                    Download
                </button>
                <button class="card-btn card-btn-secondary" onclick="shareNote('${escapeHtml(note.Title || '')}')">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `}).join('');
    
    displayPagination('notes');
}

/* ========================================
   THUMBNAIL HELPER FUNCTIONS
======================================== */
function getYouTubeThumbnail(url) {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Standard: https://www.youtube.com/watch?v=VIDEO_ID
    let match = url.match(/[?&]v=([^&]+)/);
    if (match) {
        videoId = match[1];
    }
    
    // Short: https://youtu.be/VIDEO_ID
    if (!videoId) {
        match = url.match(/youtu\.be\/([^?]+)/);
        if (match) {
            videoId = match[1];
        }
    }
    
    // Embed: https://www.youtube.com/embed/VIDEO_ID
    if (!videoId) {
        match = url.match(/\/embed\/([^?]+)/);
        if (match) {
            videoId = match[1];
        }
    }
    
    if (videoId) {
        // Try maxresdefault first (best quality)
        return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    return null;
}

function getDefaultNoteThumbnail(type) {
    // Default placeholder thumbnails for different note types
    const defaults = {
        'PDF': 'https://via.placeholder.com/400x200/dc2626/ffffff?text=PDF+Notes',
        'Video': 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Video+Lecture',
        'PPT': 'https://via.placeholder.com/400x200/f97316/ffffff?text=Presentation',
        'Document': 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Document'
    };
    
    return defaults[type] || defaults['PDF'];
}

function getNoteTypeIcon(type) {
    const icons = {
        'PDF': 'fas fa-file-pdf',
        'Video': 'fas fa-video',
        'PPT': 'fas fa-file-powerpoint',
        'Document': 'fas fa-file-alt',
        'default': 'fas fa-file'
    };
    
    return icons[type] || icons['default'];
}

function displayPagination(type) {
    const container = type === 'courses' ? DOM.coursesPagination : DOM.notesPagination;
    if (!container) return;
    
    const items = type === 'courses' ? AppState.filteredCourses : AppState.filteredNotes;
    const currentPage = type === 'courses' ? AppState.currentPage : AppState.notesCurrentPage;
    const totalPages = Math.ceil(items.length / CONFIG.ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage('${type}', ${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Show first page
    if (currentPage > 3) {
        html += `<button class="page-btn" onclick="changePage('${type}', 1)">1</button>`;
        if (currentPage > 4) {
            html += '<span style="padding: 0 0.5rem; color: var(--text-tertiary);">...</span>';
        }
    }
    
    // Show pages around current
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage('${type}', ${i})">
                ${i}
            </button>
        `;
    }
    
    // Show last page
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            html += '<span style="padding: 0 0.5rem; color: var(--text-tertiary);">...</span>';
        }
        html += `<button class="page-btn" onclick="changePage('${type}', ${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage('${type}', ${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = html;
}

function changePage(type, page) {
    if (type === 'courses') {
        AppState.currentPage = page;
        displayCourses();
        document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        AppState.notesCurrentPage = page;
        renderNotes();
        document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ========================================
   COURSE & NOTE ACTIONS
======================================== */
function viewCourse(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
        checkAchievement('firstCourse');
    } else {
        showNotification('Course URL not available', 'error');
    }
}

function downloadNote(url, title) {
    if (url && url !== '#') {
        window.open(url, '_blank');
        showNotification(`📥 Downloading: ${title}`, 'success');
        checkAchievement('firstDownload');
    } else {
        showNotification('Download URL not available', 'error');
    }
}

function shareCourse(title) {
    shareContent('course', title);
}

function shareNote(title) {
    shareContent('note', title);
}

function shareContent(type, title) {
    openModal('shareModal');
    
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.onclick = () => handleShare(btn.dataset.platform, type, title);
    });
}

function handleShare(platform, type, title) {
    const text = `Check out this ${type}: ${title} on JavaSourceCode!`;
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'copy':
            copyShareLink();
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        closeModal('shareModal');
        showNotification('Opened share dialog', 'success');
    }
}

function copyShareLink() {
    const input = document.getElementById('shareLink');
    if (input) {
        input.select();
        document.execCommand('copy');
        showNotification('📋 Link copied to clipboard!', 'success');
        closeModal('shareModal');
    }
}

/* ========================================
   USER TRACKING & STREAK
======================================== */
function initializeUserTracking() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('userStreak')) || 0;
    
    if (lastVisit === today) {
        AppState.userStreak = streak;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
            streak++;
            AppState.userStreak = streak;
            showNotification(`🔥 ${streak} day streak! Keep it up!`, 'success');
            checkAchievement('streak7', streak);
            checkAchievement('streak30', streak);
        } else {
            if (streak > 0) {
                showNotification('💡 Streak reset. Start a new one today!', 'info');
            }
            streak = 1;
            AppState.userStreak = streak;
        }
        
        localStorage.setItem('userStreak', streak);
        localStorage.setItem('lastVisit', today);
    }
    
    const streakCount = document.getElementById('streakCount');
    if (streakCount) {
        streakCount.textContent = AppState.userStreak;
    }
}

/* ========================================
   ACHIEVEMENTS
======================================== */
function initializeAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
        AppState.achievements = JSON.parse(saved);
    }
}

function checkAchievement(type, value = 1) {
    const achievements = {
        firstCourse: {
            title: '🎓 First Course',
            description: 'Started your first course!',
            condition: () => true
        },
        firstDownload: {
            title: '📥 First Download',
            description: 'Downloaded your first note!',
            condition: () => true
        },
        streak7: {
            title: '🔥 Week Warrior',
            description: '7 day learning streak!',
            condition: (val) => val >= 7
        },
        streak30: {
            title: '🏆 Month Master',
            description: '30 day learning streak!',
            condition: (val) => val >= 30
        }
    };
    
    const achievement = achievements[type];
    if (!achievement) return;
    
    const alreadyUnlocked = AppState.achievements.includes(type);
    
    if (!alreadyUnlocked && achievement.condition(value)) {
        AppState.achievements.push(type);
        localStorage.setItem('achievements', JSON.stringify(AppState.achievements));
        showAchievement(achievement.title, achievement.description);
    }
}

function showAchievement(title, description) {
    if (!DOM.achievementBadges) return;
    
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.innerHTML = `
        <i class="fas fa-trophy"></i>
        <div class="achievement-content">
            <h4>${title}</h4>
            <p>${description}</p>
        </div>
    `;
    
    DOM.achievementBadges.appendChild(badge);
    
    setTimeout(() => {
        badge.style.animation = 'slideInLeft 0.5s ease reverse';
        setTimeout(() => badge.remove(), 500);
    }, 5000);
}

/* ========================================
   MODALS
======================================== */
function initializeModals() {
    const helpBtn = document.getElementById('helpBtn');
    const closeButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');
    
    if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('helpModal');
        });
    }
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            closeModal(modalId);
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ========================================
   FAQ
======================================== */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ========================================
   TESTIMONIALS SLIDER
======================================== */
function initializeTestimonials() {
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (!testimonials.length) return;
    
    // Create dots
    if (dotsContainer) {
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToTestimonial(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => changeTestimonial(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeTestimonial(1));
    
    // Auto-rotate every 5 seconds
    setInterval(() => changeTestimonial(1), 5000);
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonials.length) return;
    
    testimonials[AppState.testimonialIndex].style.display = 'none';
    dots[AppState.testimonialIndex]?.classList.remove('active');
    
    AppState.testimonialIndex += direction;
    
    if (AppState.testimonialIndex >= testimonials.length) {
        AppState.testimonialIndex = 0;
    } else if (AppState.testimonialIndex < 0) {
        AppState.testimonialIndex = testimonials.length - 1;
    }
    
    testimonials[AppState.testimonialIndex].style.display = 'block';
    dots[AppState.testimonialIndex]?.classList.add('active');
}

function goToTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    testimonials[AppState.testimonialIndex].style.display = 'none';
    dots[AppState.testimonialIndex]?.classList.remove('active');
    
    AppState.testimonialIndex = index;
    
    testimonials[AppState.testimonialIndex].style.display = 'block';
    dots[AppState.testimonialIndex]?.classList.add('active');
}

/* ========================================
   CONTACT FORM
======================================== */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = length;
            
            if (length > 500) {
                charCount.style.color = 'var(--accent-red)';
            } else {
                charCount.style.color = 'var(--text-tertiary)';
            }
        });
    }
    
    form.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        category: form.category.value,
        message: form.message.value
    };
    
    // Validate
    if (!validateEmail(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (formData.message.length > 500) {
        showNotification('Message is too long (max 500 characters)', 'error');
        return;
    }
    
    // Simulate sending
    showNotification('📧 Sending message...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        document.getElementById('charCount').textContent = '0';
    }, 1500);
}

/* ========================================
   NEWSLETTER FORM
======================================== */
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            showNotification('🎉 Successfully subscribed to newsletter!', 'success');
            form.reset();
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });
}

/* ========================================
   NOTIFICATIONS
======================================== */
function showNotification(message, type = 'info') {
    if (!DOM.notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    DOM.notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function truncateText(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function formatNumber(num) {
    const number = parseInt(num);
    if (isNaN(number)) return '0';
    
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ========================================
   GLOBAL FUNCTIONS (for onclick handlers)
======================================== */
window.changePage = changePage;
window.viewCourse = viewCourse;
window.downloadNote = downloadNote;
window.shareCourse = shareCourse;
window.shareNote = shareNote;
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.resetCourseFilters = resetCourseFilters;
window.resetNotesFiltersFunc = resetNotesFiltersFunc;
window.copyShareLink = copyShareLink;

/* ========================================
   CONSOLE EASTER EGG
======================================== */
console.log('%c🎓 JavaSourceCode v4.0 Ultra', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cWelcome Developer! 👋', 'color: #ec4899; font-size: 16px;');
console.log('%cWith Thumbnail Support Enabled ✨', 'color: #06b6d4; font-size: 14px;');
console.log('%cInterested in contributing? Contact: ranvirdevops@gmail.com', 'color: #10b981; font-size: 14px;');
console.log('%cTotal Lines: 2200+ | Features: 50+', 'color: #f59e0b; font-size: 12px;');
