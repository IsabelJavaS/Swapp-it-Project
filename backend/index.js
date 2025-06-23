const express = require('express'); 
const cors = require('cors'); 
const path = require('path');
require('dotenv').config();
const { initializeApp } = require('firebase/app'); 
const { getAuth } = require('firebase/auth'); 
const { getFirestore } = require('firebase/firestore'); 
const { getStorage } = require('firebase/storage'); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}; 

// Validate Firebase configuration
const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN', 
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please create a .env file based on env.example');
    process.exit(1);
}

const firebaseApp = initializeApp(firebaseConfig); 
const auth = getAuth(firebaseApp); 
const db = getFirestore(firebaseApp); 
const storage = getStorage(firebaseApp); 

console.log('✅ Firebase configured successfully');

// API Routes
app.get('/api/health', (req, res) => { 
  res.json({ 
    status: 'Backend funcionando correctamente!',
    environment: process.env.NODE_ENV,
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN
    }
  }); 
}); 

// API Route for testing Firebase connection
app.get('/api/firebase-test', (req, res) => {
  res.json({ 
    message: 'Firebase conectado correctamente',
    projectId: process.env.FIREBASE_PROJECT_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    environment: process.env.NODE_ENV
  });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve other HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productsPage.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productDetail.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`); 
  console.log(`🌐 Frontend disponible en http://localhost:${PORT}`); 
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
});