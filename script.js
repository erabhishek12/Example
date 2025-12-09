// ===== FIREBASE v10 MODULAR SDK IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
    apiKey: "AIzaSyCklk9ugj3J4O5zWO1zn46r652vcUPKNDc",
    authDomain: "study-hub-b826d.firebaseapp.com",
    databaseURL: "https://study-hub-b826d-default-rtdb.firebaseio.com",
    projectId: "study-hub-b826d",
    storageBucket: "study-hub-b826d.firebasestorage.app",
    messagingSenderId: "122884916872",
    appId: "1:122884916872:web:39cd7136592a2ef917c13d"
};

// ===== INITIALIZE FIREBASE =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== DOM ELEMENTS =====
const elements = {
    // Loaders & Containers
    initialLoader: document.getElementById('initialLoader'),
    mainContainer: document.getElementById('mainContainer'),
    
    // Toggle Elements
    loginToggle: document.getElementById('loginToggle'),
    registerToggle: document.getElementById('registerToggle'),
    toggleSlider: document.getElementById('toggleSlider'),
    
    // Forms
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // Login Fields
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginSubmitBtn: document.getElementById('loginSubmitBtn'),
    loginSubmitContainer: document.getElementById('loginSubmitContainer'),
    
    // Register Fields
    regFullName: document.getElementById('regFullName'),
    regPhone: document.getElementById('regPhone'),
    regBranch: document.getElementById('regBranch'),
    regCourse: document.getElementById('regCourse'),
    regSemester: document.getElementById('regSemester'),
    regCollege: document.getElementById('regCollege'),
    regEmail: document.getElementById('regEmail'),
    regPassword: document.getElementById('regPassword'),
    regConfirmPassword: document.getElementById('regConfirmPassword'),
    acceptTerms: document.getElementById('acceptTerms'),
    registerSubmitBtn: document.getElementById('registerSubmitBtn'),
    registerSubmitContainer: document.getElementById('registerSubmitContainer'),
    
    // Machine Elements
    machineContainer: document.getElementById('machineContainer'),
    gearLarge: document.getElementById('gearLarge'),
    gearMedium: document.getElementById('gearMedium'),
    gearSmall: document.getElementById('gearSmall'),
    pullSystem: document.getElementById('pullSystem'),
    pulleyTop: document.getElementById('pulleyTop'),
    rope: document.getElementById('rope'),
    weight: document.getElementById('weight'),
    conveyorBelt: document.getElementById('conveyorBelt'),
    spraySystem: document.getElementById('spraySystem'),
    sprayCan: document.getElementById('sprayCan'),
    sprayParticles: document.getElementById('sprayParticles'),
    dominoChain: document.getElementById('dominoChain'),
    leverSystem: document.getElementById('leverSystem'),
    leverArm: document.getElementById('leverArm'),
    
    // Toast & Modal
    toastContainer: document.getElementById('toastContainer'),
    successModal: document.getElementById('successModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    redirectProgress: document.getElementById('redirectProgress')
};

// ===== GLOBAL VARIABLES =====
let currentMode = 'login';
let isAnimating = false;
let machineTimeline = null;

// ===== UTILITY FUNCTIONS =====

// Show Toast Notification
function showToast(type, title, message, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// Add slideOut animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(styleSheet);

// Validate Email Format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Phone Number (10 digits)
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Show Success Modal
function showSuccessModal(title, message) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.successModal.classList.add('active');
    
    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        elements.redirectProgress.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            // Redirect after progress complete
            setTimeout(() => {
                redirectToDashboard();
            }, 200);
        }
    }, 50);
}

// Redirect to Dashboard
function redirectToDashboard() {
    // Prevent back navigation to login page
    window.history.replaceState(null, '', 'dashboard.html');
    window.location.replace('dashboard.html');
}

// Set Button Loading State
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ===== GSAP MACHINE ANIMATION =====

// Initialize Machine Animation
function initMachineAnimation() {
    // Create main timeline
    machineTimeline = gsap.timeline({ paused: true });
    
    // Idle gear rotation
    gsap.to(elements.gearLarge, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none"
    });
    
    gsap.to(elements.gearMedium, {
        rotation: -360,
        duration: 7,
        repeat: -1,
        ease: "none"
    });
    
    gsap.to(elements.gearSmall, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none"
    });
}

// Trigger Full Machine Animation (Rube Goldberg Style)
function triggerMachineAnimation(targetContainer, targetButton) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Activate machine visually
    elements.machineContainer.classList.add('active');
    
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            elements.machineContainer.classList.remove('active');
        }
    });
    
    // Step 1: Speed up gears
    tl.to([elements.gearLarge, elements.gearMedium, elements.gearSmall], {
        duration: 0.3,
        ease: "power2.in"
    });
    
    // Step 2: Pull rope (weight goes up)
    tl.to(elements.weight, {
        y: -50,
        duration: 0.5,
        ease: "power2.out"
    });
    
    tl.to(elements.rope, {
        scaleY: 0.5,
        duration: 0.5,
        ease: "power2.out"
    }, "<");
    
    // Step 3: Rotate pulley wheel
    tl.to(elements.pulleyTop.querySelector('.pulley-wheel'), {
        rotation: 180,
        duration: 0.5,
        ease: "power2.inOut"
    }, "<");
    
    // Step 4: Weight drops
    tl.to(elements.weight, {
        y: 30,
        duration: 0.4,
        ease: "bounce.out"
    });
    
    tl.to(elements.rope, {
        scaleY: 1.2,
        duration: 0.4,
        ease: "bounce.out"
    }, "<");
    
    // Step 5: Conveyor belt activates
    tl.to('.belt-line', {
        x: -50,
        duration: 0.6,
        stagger: 0.05,
        ease: "power1.inOut"
    });
    
    tl.to(['.belt-wheel-left', '.belt-wheel-right'], {
        rotation: 180,
        duration: 0.6,
        ease: "power1.inOut"
    }, "<");
    
    // Step 6: Lever moves
    tl.to(elements.leverArm, {
        rotation: -30,
        duration: 0.4,
        ease: "power2.out"
    });
    
    // Step 7: Dominoes fall
    const dominoes = document.querySelectorAll('.domino');
    dominoes.forEach((domino, index) => {
        tl.to(domino, {
            rotation: 80,
            duration: 0.15,
            ease: "power2.in"
        }, `-=0.05`);
    });
    
    // Step 8: Spray can shakes
    tl.to(elements.sprayCan, {
        x: -5,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    // Step 9: Spray particles burst
    const particles = elements.sprayParticles.querySelectorAll('span');
    tl.to(elements.sprayParticles, {
        opacity: 1,
        duration: 0.1
    });
    
    particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI - Math.PI / 2;
        const distance = 50 + Math.random() * 30;
        
        tl.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 50,
            opacity: 1,
            scale: 1 + Math.random(),
            duration: 0.4,
            ease: "power2.out"
        }, "<");
    });
    
    // Step 10: Add spray effect to button container
    tl.add(() => {
        targetContainer.classList.add('spray-active');
        setTimeout(() => {
            targetContainer.classList.remove('spray-active');
        }, 500);
    });
    
    // Step 11: Reveal button with spray effect
    tl.to(targetButton, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onStart: () => {
            targetButton.classList.add('visible');
        }
    });
    
    // Step 12: Reset particles
    tl.to(particles, {
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "power2.in"
    });
    
    tl.to(elements.sprayParticles, {
        opacity: 0,
        duration: 0.1
    });
    
    // Step 13: Reset lever
    tl.to(elements.leverArm, {
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
    });
    
    // Step 14: Reset dominoes
    tl.to('.domino', {
        rotation: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.out"
    });
    
    // Step 15: Reset weight and rope
    tl.to(elements.weight, {
        y: 0,
        duration: 0.4,
        ease: "power2.inOut"
    });
    
    tl.to(elements.rope, {
        scaleY: 1,
        duration: 0.4,
        ease: "power2.inOut"
    }, "<");
    
    // Step 16: Reset conveyor
    tl.to('.belt-line', {
        x: 0,
        duration: 0.3,
        ease: "power1.inOut"
    });
    
    return tl;
}

// Simple Button Reveal (for mobile/no machine)
function simpleButtonReveal(button) {
    gsap.to(button, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onStart: () => {
            button.classList.add('visible');
        }
    });
}

// ===== FORM VALIDATION =====

// Check if all login fields are valid
function validateLoginForm() {
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;
    
    if (!email || !password) {
        return { valid: false, message: 'Please fill in all fields' };
    }
    
    if (!isValidEmail(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    return { valid: true };
}

// Check if all register fields are valid
function validateRegisterForm() {
    const fullName = elements.regFullName.value.trim();
    const phone = elements.regPhone.value.trim();
    const branch = elements.regBranch.value;
    const course = elements.regCourse.value;
    const semester = elements.regSemester.value;
    const college = elements.regCollege.value.trim();
    const email = elements.regEmail.value.trim();
    const password = elements.regPassword.value;
    const confirmPassword = elements.regConfirmPassword.value;
    const acceptTerms = elements.acceptTerms.checked;
    
    if (!fullName || !phone || !branch || !course || !semester || !college || !email || !password || !confirmPassword) {
        return { valid: false, message: 'Please fill in all fields' };
    }
    
    if (fullName.length < 2) {
        return { valid: false, message: 'Please enter a valid full name' };
    }
    
    if (!isValidPhone(phone)) {
        return { valid: false, message: 'Please enter a valid 10-digit phone number' };
    }
    
    if (!isValidEmail(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    
    if (!acceptTerms) {
        return { valid: false, message: 'Please accept the Terms & Conditions' };
    }
    
    return { valid: true };
}

// Check form and trigger animation
function checkFormAndTriggerAnimation(mode) {
    let validation;
    let targetContainer;
    let targetButton;
    
    if (mode === 'login') {
        validation = validateLoginForm();
        targetContainer = elements.loginSubmitContainer;
        targetButton = elements.loginSubmitBtn;
    } else {
        validation = validateRegisterForm();
        targetContainer = elements.registerSubmitContainer;
        targetButton = elements.registerSubmitBtn;
    }
    
    if (validation.valid && !targetButton.classList.contains('visible')) {
        // Check if machine is visible (desktop)
        if (window.innerWidth > 1024) {
            triggerMachineAnimation(targetContainer, targetButton);
        } else {
            simpleButtonReveal(targetButton);
        }
    }
}

// ===== FIREBASE AUTHENTICATION =====

// Register New User
async function registerUser(email, password, userData) {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User created:', user.uid);
        
        // Update user profile with display name
        await updateProfile(user, {
            displayName: userData.fullName
        });
        
        console.log('Profile updated');
        
        // Store additional user data in Firestore
        const userDocRef = doc(db, 'students', user.uid);
        
        const firestoreData = {
            uid: user.uid,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            branch: userData.branch,
            course: userData.course,
            semester: userData.semester,
            college: userData.college,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true,
            role: 'student'
        };
        
        console.log('Saving to Firestore:', firestoreData);
        
        await setDoc(userDocRef, firestoreData);
        
        console.log('Firestore document created successfully');
        
        return { success: true, user: user };
        
    } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please login instead.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use a stronger password.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
            default:
                errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
    }
}

// Login User
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User logged in:', user.uid);
        
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'students', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            console.log('User data from Firestore:', userDoc.data());
        }
        
        return { success: true, user: user };
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please register first.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Contact support.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password. Please check and try again.';
                break;
            default:
                errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
    }
}

// ===== EVENT LISTENERS =====

// Toggle between Login and Register
function setupToggle() {
    elements.loginToggle.addEventListener('click', () => {
        if (currentMode === 'login') return;
        
        currentMode = 'login';
        elements.toggleSlider.classList.remove('right');
        elements.loginToggle.classList.add('active');
        elements.registerToggle.classList.remove('active');
        
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
        
        // Reset button visibility
        elements.loginSubmitBtn.classList.remove('visible');
        gsap.set(elements.loginSubmitBtn, { opacity: 0, scale: 0.8 });
    });
    
    elements.registerToggle.addEventListener('click', () => {
        if (currentMode === 'register') return;
        
        currentMode = 'register';
        elements.toggleSlider.classList.add('right');
        elements.registerToggle.classList.add('active');
        elements.loginToggle.classList.remove('active');
        
        elements.registerForm.classList.remove('hidden');
        elements.loginForm.classList.add('hidden');
        
        // Reset button visibility
        elements.registerSubmitBtn.classList.remove('visible');
        gsap.set(elements.registerSubmitBtn, { opacity: 0, scale: 0.8 });
    });
}

// Password Toggle Visibility
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form Input Listeners (for animation trigger)
function setupFormListeners() {
    // Login form inputs
    const loginInputs = [elements.loginEmail, elements.loginPassword];
    loginInputs.forEach(input => {
        input.addEventListener('input', () => {
            checkFormAndTriggerAnimation('login');
        });
        input.addEventListener('blur', () => {
            checkFormAndTriggerAnimation('login');
        });
    });
    
    // Register form inputs
    const registerInputs = [
        elements.regFullName,
        elements.regPhone,
        elements.regBranch,
        elements.regCourse,
        elements.regSemester,
        elements.regCollege,
        elements.regEmail,
        elements.regPassword,
        elements.regConfirmPassword
    ];
    
    registerInputs.forEach(input => {
        input.addEventListener('input', () => {
            checkFormAndTriggerAnimation('register');
        });
        input.addEventListener('change', () => {
            checkFormAndTriggerAnimation('register');
        });
        input.addEventListener('blur', () => {
            checkFormAndTriggerAnimation('register');
        });
    });
    
    // Terms checkbox
    elements.acceptTerms.addEventListener('change', () => {
        checkFormAndTriggerAnimation('register');
    });
}

// Login Form Submit
function setupLoginSubmit() {
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const validation = validateLoginForm();
        
        if (!validation.valid) {
            showToast('error', 'Validation Error', validation.message);
            return;
        }
        
        const email = elements.loginEmail.value.trim();
        const password = elements.loginPassword.value;
        
        // Set loading state
        setButtonLoading(elements.loginSubmitBtn, true);
        
        // Attempt login
        const result = await loginUser(email, password);
        
        if (result.success) {
            showToast('success', 'Welcome Back!', `Logged in as ${result.user.email}`);
            
            // Show success modal with redirect
            setTimeout(() => {
                showSuccessModal('Welcome Back!', 'Redirecting to your dashboard...');
            }, 500);
        } else {
            setButtonLoading(elements.loginSubmitBtn, false);
            showToast('error', 'Login Failed', result.error);
        }
    });
}

// Register Form Submit
function setupRegisterSubmit() {
    elements.registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const validation = validateRegisterForm();
        
        if (!validation.valid) {
            showToast('error', 'Validation Error', validation.message);
            return;
        }
        
        // Collect all user data
        const userData = {
            fullName: elements.regFullName.value.trim(),
            phone: elements.regPhone.value.trim(),
            branch: elements.regBranch.value,
            course: elements.regCourse.value,
            semester: elements.regSemester.value,
            college: elements.regCollege.value.trim(),
            email: elements.regEmail.value.trim()
        };
        
        const password = elements.regPassword.value;
        
        // Set loading state
        setButtonLoading(elements.registerSubmitBtn, true);
        
        // Attempt registration
        const result = await registerUser(userData.email, password, userData);
        
        if (result.success) {
            showToast('success', 'Account Created!', `Welcome to Study Hub, ${userData.fullName}!`);
            
            // Show success modal with redirect
            setTimeout(() => {
                showSuccessModal('Account Created!', 'Redirecting to your dashboard...');
            }, 500);
        } else {
            setButtonLoading(elements.registerSubmitBtn, false);
            showToast('error', 'Registration Failed', result.error);
        }
    });
}

// ===== AUTH STATE OBSERVER =====

function setupAuthObserver() {
    onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.email : 'No user');
        
        // Hide initial loader
        setTimeout(() => {
            elements.initialLoader.style.opacity = '0';
            setTimeout(() => {
                elements.initialLoader.classList.add('hidden');
            }, 300);
        }, 500);
        
        if (user) {
            // User is signed in - redirect to dashboard
            console.log('User is logged in, redirecting...');
            
            // Prevent back navigation
            window.history.replaceState(null, '', 'dashboard.html');
            window.location.replace('dashboard.html');
        } else {
            // No user - show login form
            console.log('No user logged in, showing auth form');
            elements.mainContainer.classList.remove('hidden');
            
            // Initialize animations
            initMachineAnimation();
            
            // Initial button state
            gsap.set(elements.loginSubmitBtn, { opacity: 0, scale: 0.8 });
            gsap.set(elements.registerSubmitBtn, { opacity: 0, scale: 0.8 });
        }
    });
}

// ===== PREVENT BACK NAVIGATION =====

function preventBackNavigation() {
    // Push initial state
    window.history.pushState(null, '', window.location.href);
    
    // Listen for popstate (back button)
    window.addEventListener('popstate', () => {
        window.history.pushState(null, '', window.location.href);
    });
}

// ===== INITIALIZE APPLICATION =====

function initApp() {
    console.log('Initializing Study Hub Authentication...');
    
    // Setup all event listeners
    setupToggle();
    setupPasswordToggle();
    setupFormListeners();
    setupLoginSubmit();
    setupRegisterSubmit();
    preventBackNavigation();
    
    // Setup auth observer (this handles showing/hiding the form)
    setupAuthObserver();
    
    console.log('Application initialized successfully');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ===== EXPORT FOR DEBUGGING (OPTIONAL) =====
window.StudyHubAuth = {
    auth,
    db,
    signOut: () => signOut(auth),
    getCurrentUser: () => auth.currentUser
};