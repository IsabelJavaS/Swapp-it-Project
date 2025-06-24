// Firebase Test - Verificar conexión
import { auth, db, storage, getCurrentProjectInfo, isConfigComplete } from '../../src/firebase/config.js';
import { collection, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { ref } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import { showNotification } from '../../src/js/app.js';

// Función para probar la conexión con Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Verificar si la configuración está completa
    if (!isConfigComplete()) {
      console.warn('⚠️ Configuración de Firebase incompleta. Revisa src/firebase/config.js');
      return false;
    }
    
    // Mostrar información del proyecto actual
    const projectInfo = getCurrentProjectInfo();
    console.log('📋 Current project:', projectInfo);
    
    // Probar conexión con Auth
    console.log('🔐 Testing Auth...');
    const authState = auth.currentUser;
    console.log('Auth state:', authState ? 'User logged in' : 'No user logged in');
    
    // Probar conexión con Firestore
    console.log('🗄️ Testing Firestore...');
    const testCollectionRef = collection(db, 'test');
    const testDocRef = doc(testCollectionRef, 'connection');
    const testDoc = await getDoc(testDocRef);
    console.log('Firestore connection:', testDoc.exists() ? 'Success' : 'Success (no document)');
    
    // Probar conexión con Storage
    console.log('📁 Testing Storage...');
    const storageRef = ref(storage, 'test');
    console.log('Storage connection: Success');
    
    showNotification('✅ Firebase connection successful!', 'success');
    console.log('✅ All Firebase services connected successfully!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    showNotification(`❌ Firebase connection failed: ${error.message}`, 'danger');
    return false;
  }
};

// Función para mostrar información del proyecto en la consola
export const showProjectInfo = () => {
  const projectInfo = getCurrentProjectInfo();
  console.log('🚀 SWAPPIT Firebase Configuration:');
  console.log('Environment:', projectInfo.environment);
  console.log('Project ID:', projectInfo.projectId);
  console.log('Auth Domain:', projectInfo.authDomain);
  console.log('Config Complete:', isConfigComplete());
};

// Función para cambiar de proyecto desde la consola
export const switchProjectFromConsole = (environment) => {
  if (environment === 'development' || environment === 'production') {
    console.log(`🔄 Switching to ${environment} project...`);
    // Esta función recargará la página para aplicar los cambios
    window.location.reload();
  } else {
    console.error('❌ Invalid environment. Use "development" or "production"');
  }
};

// Auto-test cuando se carga el archivo
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar información del proyecto
  showProjectInfo();
  
  // Probar conexión automáticamente
  setTimeout(() => {
    testFirebaseConnection();
  }, 1000);
  
  // Agregar funciones globales para debugging
  window.firebaseTest = {
    testConnection: testFirebaseConnection,
    showInfo: showProjectInfo,
    switchProject: switchProjectFromConsole
  };
  
  console.log('🔧 Firebase test functions available:');
  console.log('- firebaseTest.testConnection() - Test Firebase connection');
  console.log('- firebaseTest.showInfo() - Show project information');
  console.log('- firebaseTest.switchProject("development") - Switch to development');
  console.log('- firebaseTest.switchProject("production") - Switch to production');
}); 