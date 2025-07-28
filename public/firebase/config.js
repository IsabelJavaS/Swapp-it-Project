// Firebase Configuration - Solo Producción
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Configuración del proyecto real
const firebaseConfig = {
  apiKey: "AIzaSyAExygTQjFqetanu5ndSmp2lu0RxNQGhU4",
  authDomain: "proyect-swapp-it.firebaseapp.com",
  databaseURL: "https://proyect-swapp-it-default-rtdb.firebaseio.com",
  projectId: "proyect-swapp-it",
  storageBucket: "proyect-swapp-it.firebasestorage.app",
  messagingSenderId: "909327451855",
  appId: "1:909327451855:web:985769bf1a3eb9877e59ba",
  measurementId: "G-ES8F41DRD0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exportar la instancia de la app
export default app;

// Función para obtener información del proyecto actual
export const getCurrentProjectInfo = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  };
};

// Función para verificar si la configuración está completa
export const isConfigComplete = () => {
  return firebaseConfig && 
         firebaseConfig.apiKey &&
         firebaseConfig.projectId &&
         firebaseConfig.apiKey.length > 10;
}; 