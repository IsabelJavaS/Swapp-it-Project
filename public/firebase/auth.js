// Firebase Authentication Functions
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { auth } from '../firebase/config.js';
import { getUserProfile, updateLastLogin } from '../firebase/firestore.js';

// User registration
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    console.log('Starting password reset for email:', email);
    
    // Get the current domain for the action URL
    const currentDomain = window.location.origin;
    console.log('Current domain:', currentDomain);
    
    const actionCodeSettings = {
      url: `${currentDomain}/pages/auth/change-password.html`,
      handleCodeInApp: true
    };
    
    console.log('Action code settings:', actionCodeSettings);
    
    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('invalid-email');
    }
    
    // Check if Firebase auth is properly initialized
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }
    
    console.log('Sending password reset email...');
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    
    console.log('Password reset email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Return more specific error information
    return { 
      success: false, 
      error: error.message,
      errorCode: error.code 
    };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Update user email
export const updateEmail = async (user, newEmail) => {
  try {
    await firebaseUpdateEmail(user, newEmail);
    return { success: true };
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, error: error.message };
  }
};

// Update user password
export const updatePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in' };
    }
    
    await firebaseUpdatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
};

// Confirm password reset
export const confirmPasswordReset = async (actionCode, newPassword) => {
  try {
    await firebaseConfirmPasswordReset(auth, actionCode, newPassword);
    return { success: true };
  } catch (error) {
    console.error('Error confirming password reset:', error);
    return { success: false, error: error.message };
  }
}; 