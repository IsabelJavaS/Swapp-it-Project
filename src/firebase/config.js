// Firebase Configuration - Configuración Manual
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Configuración para diferentes entornos
const firebaseConfigs = {
  // PROYECTO DE PRUEBA - REEMPLAZA CON TUS CREDENCIALES REALES
  development: {
    apiKey: "AIzaSyAbg5nxrEEPuDbfohOmbn8eJVtYPsdUhtI",
    authDomain: "expo-tech-projects.firebaseapp.com",
    projectId: "expo-tech-projects",
    storageBucket: "expo-tech-projects.firebasestorage.app",
    messagingSenderId: "122667485782",
    appId: "1:122667485782:web:a6621378fd4673557049f7",
    measurementId: "G-210YWSZ2EZ"
  },
  
  // PROYECTO REAL (cuando lo tengas)
  production: {
    apiKey: "REEMPLAZA-CON-TU-API-KEY-REAL",
    authDomain: "tu-proyecto-real.firebaseapp.com",
    projectId: "tu-proyecto-real",
    storageBucket: "tu-proyecto-real.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:xyz789abc"
  }
};

// Determinar qué configuración usar
const getEnvironment = () => {
  // CAMBIA ESTA LÍNEA PARA CAMBIAR DE PROYECTO
  return 'development'; // Para proyecto de prueba
  // return 'production'; // Para proyecto real (descomenta cuando tengas el proyecto real)
};

// Obtener configuración actual
const currentConfig = firebaseConfigs[getEnvironment()];

// Initialize Firebase
const app = initializeApp(currentConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;

// Función para cambiar de proyecto (útil para desarrollo)
export const switchProject = (environment) => {
  if (firebaseConfigs[environment]) {
    console.log(`Switching to ${environment} project`);
    // Recargar la página para aplicar cambios
    window.location.reload();
  } else {
    console.error('Invalid environment:', environment);
  }
};

// Función para obtener información del proyecto actual
export const getCurrentProjectInfo = () => {
  return {
    environment: getEnvironment(),
    projectId: currentConfig.projectId,
    authDomain: currentConfig.authDomain
  };
};

// Función para verificar si la configuración está completa
export const isConfigComplete = () => {
  const config = firebaseConfigs[getEnvironment()];
  return config && 
         config.apiKey !== "REEMPLAZA-CON-TU-API-KEY" &&
         config.projectId !== "tu-proyecto-prueba" &&
         config.apiKey.length > 10; // Verificar que la API key tenga un formato válido
}; 