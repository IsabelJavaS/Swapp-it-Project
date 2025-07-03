// Main Application File
import { onAuthStateChange, getCurrentUser } from '../firebase/auth.js';
import { getUserProfile } from '../firebase/firestore.js';

// Global app state
window.SwappitApp = {
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true
};

// Initialize app
export const initializeApp = async () => {
  try {
    console.log('Initializing SWAPPIT application...');
    
    // Set up auth state listener
    onAuthStateChange(async (user) => {
      if (user) {
        console.log('User authenticated:', user.email);
        SwappitApp.user = user;
        SwappitApp.isAuthenticated = true;
        
        // Get user profile from Firestore
        const profileResult = await getUserProfile(user.uid);
        if (profileResult.success) {
          SwappitApp.userProfile = profileResult.data;
        }
        
        // Update UI for authenticated user
        updateUIForAuthenticatedUser(user);
      } else {
        console.log('User signed out');
        SwappitApp.user = null;
        SwappitApp.userProfile = null;
        SwappitApp.isAuthenticated = false;
        
        // Update UI for unauthenticated user
        updateUIForUnauthenticatedUser();
      }
      
      SwappitApp.isLoading = false;
      document.body.classList.remove('loading');
    });
    
    // Initialize other app features
    initializeTheme();
    initializeNavigation();
    
  } catch (error) {
    console.error('Error initializing app:', error);
    SwappitApp.isLoading = false;
  }
};

// Update UI for authenticated user
const updateUIForAuthenticatedUser = (user) => {
  // Update header avatar
  const avatarElement = document.querySelector('.profile-img');
  if (avatarElement) {
    if (user.photoURL) {
      avatarElement.src = user.photoURL;
    } else {
      // Create initials avatar
      const initials = user.displayName 
        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.email[0].toUpperCase();
      
      avatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=1d4ed8&color=fff&size=40`;
    }
  }
  
  // Update user name in sidebar (if exists)
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(element => {
    element.textContent = user.displayName || user.email;
  });
  
  // Show authenticated elements
  document.querySelectorAll('.auth-required').forEach(el => {
    el.style.display = 'block';
  });
  
  // Hide unauthenticated elements
  document.querySelectorAll('.auth-hidden').forEach(el => {
    el.style.display = 'none';
  });
};

// Update UI for unauthenticated user
const updateUIForUnauthenticatedUser = () => {
  // Reset avatar
  const avatarElement = document.querySelector('.profile-img');
  if (avatarElement) {
    avatarElement.src = 'https://ui-avatars.com/api/?name=Guest&background=6c757d&color=fff&size=40';
  }
  
  // Hide authenticated elements
  document.querySelectorAll('.auth-required').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show unauthenticated elements
  document.querySelectorAll('.auth-hidden').forEach(el => {
    el.style.display = 'block';
  });
};

// Initialize theme
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    if (themeIcon) {
      themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
};

// Initialize navigation
const initializeNavigation = () => {
  // Handle mobile menu toggle
  const mobileMenuToggle = document.querySelector('.navbar-toggler');
  const mobileMenu = document.querySelector('.navbar-collapse');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('show')) {
      if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('show');
      }
    }
  });
};

// Utility functions
export const showLoading = () => {
  SwappitApp.isLoading = true;
  document.body.classList.add('loading');
};

export const hideLoading = () => {
  SwappitApp.isLoading = false;
  document.body.classList.remove('loading');
};

export const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp); 