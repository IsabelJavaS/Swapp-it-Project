// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdqY2-nCthmXCKIoEEjiqVM4tncvJ1vYE",
  authDomain: "expo-project-9f551.firebaseapp.com",
  projectId: "expo-project-9f551",
  storageBucket: "expo-project-9f551.firebasestorage.app",
  messagingSenderId: "279525802893",
  appId: "1:279525802893:web:1ecc44fd3b916aae5a73c4",
  measurementId: "G-F9EG6SZ4LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };