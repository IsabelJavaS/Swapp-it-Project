// Firestore Database Functions for Marketplace
import { 
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { db, auth } from '../firebase/config.js';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  TRANSACTIONS: 'transactions',
  POINTS: 'points',
  PAYMENTS: 'payments',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
  NOTIFICATIONS: 'notifications'
};

// ==================== USER FUNCTIONS ====================
export const createUserProfile = async (userData) => {
  try {
    console.log('createUserProfile called with:', userData);
    
    // Verificar que tenemos los datos necesarios
    if (!userData.uid) {
      throw new Error('User ID is required');
    }
    
    if (!userData) {
      throw new Error('User data is required');
    }
    
    // Verificar que Firebase está inicializado
    if (!db) {
      throw new Error('Firestore database not initialized');
    }
    
    const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
    console.log('User reference created:', userRef.path);
    
    // Estructura del perfil de usuario
    const completeUserProfile = {
      uid: userData.uid,
      email: userData.email,
      role: userData.role,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      swappitCoins: userData.swappitCoins || 100,
      isActive: userData.isActive || true
    };
    
    // Agregar datos específicos del rol
    if (userData.role === 'personal') {
      completeUserProfile.personal = {
        nombre: userData.nombre,
        telefono: userData.telefono,
        direccion: userData.direccion,
        colegio: userData.colegio,
        otherSchool: userData.otherSchool || null
      };
    } else if (userData.role === 'business') {
      completeUserProfile.business = {
        nombreNegocio: userData.nombreNegocio,
        ruc: userData.ruc,
        direccionNegocio: userData.direccionNegocio,
        telefonoNegocio: userData.telefonoNegocio,
        tipoNegocio: userData.tipoNegocio,
        descripcionNegocio: userData.descripcionNegocio
      };
    }
    
    // Agregar sistema de puntos
    completeUserProfile.points = {
      balance: 0,
      history: []
    };
    
    // Agregar estadísticas
    completeUserProfile.stats = {
      totalSales: 0,
      totalPurchases: 0,
      rating: 0,
      reviewCount: 0,
      productsCount: 0
    };
    
    console.log('Complete user profile prepared:', completeUserProfile);
    console.log('Attempting to write to Firestore...');
    
    // Intentar escribir directamente a Firestore
    await setDoc(userRef, completeUserProfile);
    
    console.log('User profile created successfully in Firestore');
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', {
      userId,
      userData: userData ? 'present' : 'missing',
      db: db ? 'initialized' : 'not initialized',
      auth: auth ? 'initialized' : 'not initialized'
    });
    
    // Provide more specific error information
    let errorMessage = error.message;
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied: Check Firestore security rules. User may not have write permissions.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'User not authenticated: Please ensure user is logged in before creating profile.';
    } else if (error.code === 'not-found') {
      errorMessage = 'Firestore database not found: Check Firebase configuration.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firestore service unavailable: Check internet connection and Firebase status.';
    } else if (error.code === 'resource-exhausted') {
      errorMessage = 'Firestore quota exceeded: Check Firebase usage limits.';
    } else if (error.code === 'invalid-argument') {
      errorMessage = 'Invalid data provided: Check the user data structure.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      errorCode: error.code,
      originalError: error.message
    };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PROFILE MANAGEMENT ====================
export const updatePersonalInfo = async (userId, personalData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      personal: personalData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating personal info:', error);
    return { success: false, error: error.message };
  }
};

export const updateBusinessInfo = async (userId, businessData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      business: businessData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating business info:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserEmail = async (userId, newEmail) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      email: newEmail,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: error.message };
  }
};

export const updateLastLogin = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating last login:', error);
    return { success: false, error: error.message };
  }
};

// ==================== POINTS SYSTEM ====================
export const getUserPoints = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return { 
        success: true, 
        data: {
          balance: userData.points?.balance || 0,
          history: userData.points?.history || []
        }
      };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user points:', error);
    return { success: false, error: error.message };
  }
};

export const addPoints = async (userId, amount, reason, transactionId = null) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    
    // Get current user data
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const currentBalance = userData.points?.balance || 0;
    const currentHistory = userData.points?.history || [];
    
    // Create new history entry
    const historyEntry = {
      amount,
      reason,
      transactionId,
      timestamp: serverTimestamp(),
      type: 'credit',
      previousBalance: currentBalance,
      newBalance: currentBalance + amount
    };
    
    // Update user document
    await updateDoc(userRef, {
      'points.balance': currentBalance + amount,
      'points.history': arrayUnion(historyEntry),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error adding points:', error);
    return { success: false, error: error.message };
  }
};

export const deductPoints = async (userId, amount, reason, transactionId = null) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    
    // Get current user data
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const currentBalance = userData.points?.balance || 0;
    const currentHistory = userData.points?.history || [];
    
    // Check if user has enough points
    if (currentBalance < amount) {
      return { success: false, error: 'Insufficient points' };
    }
    
    // Create new history entry
    const historyEntry = {
      amount: -amount,
      reason,
      transactionId,
      timestamp: serverTimestamp(),
      type: 'debit',
      previousBalance: currentBalance,
      newBalance: currentBalance - amount
    };
    
    // Update user document
    await updateDoc(userRef, {
      'points.balance': currentBalance - amount,
      'points.history': arrayUnion(historyEntry),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deducting points:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PRODUCT FUNCTIONS ====================
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active',
      views: 0,
      favorites: 0,
      rating: 0,
      reviewCount: 0
    });
    return { success: true, productId: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

export const getProducts = async (filters = {}) => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    let q = query(productsRef);
    
    // Apply filters one by one to avoid complex composite indexes
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }
    
    if (filters.transactionType) {
      q = query(q, where('transactionType', '==', filters.transactionType));
    }
    
    if (filters.sellerType) {
      q = query(q, where('sellerType', '==', filters.sellerType));
    }
    
    // Price filters - apply only one at a time to avoid complex indexes
    if (filters.priceMin && filters.priceMax) {
      q = query(q, where('price', '>=', filters.priceMin), where('price', '<=', filters.priceMax));
    } else if (filters.priceMin) {
      q = query(q, where('price', '>=', filters.priceMin));
    } else if (filters.priceMax) {
      q = query(q, where('price', '<=', filters.priceMax));
    }
    
    // Status filter
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    // Order by - use simple ordering to avoid composite indexes
    const orderByField = filters.orderBy || 'createdAt';
    const orderDirection = filters.orderDirection || 'desc';
    q = query(q, orderBy(orderByField, orderDirection));
    
    // Limit results
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      products.push({
        id: doc.id,
        ...productData
      });
    });
    
    // Apply additional filters in memory if needed
    let filteredProducts = products;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.productName?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
      );
    }
    
    return { success: true, products: filteredProducts };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, error: error.message };
  }
};

export const getProduct = async (productId) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      // Increment view count
      await updateDoc(productRef, {
        views: increment(1)
      });
      
      return { success: true, product: { id: productSnap.id, ...productSnap.data() } };
    } else {
      return { success: false, error: 'Product not found' };
    }
  } catch (error) {
    console.error('Error getting product:', error);
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// ==================== TRANSACTION FUNCTIONS ====================
export const createTransaction = async (transactionData) => {
  try {
    const batch = writeBatch(db);
    
    // Create transaction
    const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
    const transactionRef = doc(transactionsRef);
    batch.set(transactionRef, {
      ...transactionData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    // Create order
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const orderRef = doc(ordersRef);
    batch.set(orderRef, {
      transactionId: transactionRef.id,
      buyerId: transactionData.buyerId,
      sellerId: transactionData.sellerId,
      productId: transactionData.productId,
      amount: transactionData.amount,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    // Update product status
    const productRef = doc(db, COLLECTIONS.PRODUCTS, transactionData.productId);
    batch.update(productRef, {
      status: 'sold',
      soldAt: serverTimestamp()
    });
    
    await batch.commit();
    return { success: true, transactionId: transactionRef.id };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: error.message };
  }
};

export const completeTransaction = async (transactionId, paymentMethod = 'points') => {
  try {
    const batch = writeBatch(db);
    
    // Get transaction
    const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    const transactionSnap = await getDoc(transactionRef);
    
    if (!transactionSnap.exists()) {
      return { success: false, error: 'Transaction not found' };
    }
    
    const transaction = transactionSnap.data();
    
    // Update transaction status
    batch.update(transactionRef, {
      status: 'completed',
      paymentMethod,
      completedAt: serverTimestamp()
    });
    
    // Update order status
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const orderQuery = query(ordersRef, where('transactionId', '==', transactionId));
    const orderSnap = await getDocs(orderQuery);
    
    if (!orderSnap.empty) {
      const orderDoc = orderSnap.docs[0];
      batch.update(orderDoc.ref, {
        status: 'completed',
        completedAt: serverTimestamp()
      });
    }
    
    // Handle points transfer
    if (paymentMethod === 'points') {
      // Deduct points from buyer
      batch.update(doc(db, COLLECTIONS.POINTS, transaction.buyerId), {
        balance: increment(-transaction.amount)
      });
      
      // Add points to seller
      batch.update(doc(db, COLLECTIONS.POINTS, transaction.sellerId), {
        balance: increment(transaction.amount * 0.9) // 10% platform fee
      });
    }
    
    // Update user stats
    batch.update(doc(db, COLLECTIONS.USERS, transaction.buyerId), {
      totalPurchases: increment(1),
      updatedAt: serverTimestamp()
    });
    
    batch.update(doc(db, COLLECTIONS.USERS, transaction.sellerId), {
      totalSales: increment(1),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error completing transaction:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REVIEW FUNCTIONS ====================
export const addReview = async (reviewData) => {
  try {
    const batch = writeBatch(db);
    
    // Add review
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const reviewRef = doc(reviewsRef);
    batch.set(reviewRef, {
      ...reviewData,
      createdAt: serverTimestamp()
    });
    
    // Update product rating
    const productRef = doc(db, COLLECTIONS.PRODUCTS, reviewData.productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const product = productSnap.data();
      const newReviewCount = product.reviewCount + 1;
      const newRating = ((product.rating * product.reviewCount) + reviewData.rating) / newReviewCount;
      
      batch.update(productRef, {
        rating: newRating,
        reviewCount: newReviewCount
      });
    }
    
    // Update seller rating
    const sellerRef = doc(db, COLLECTIONS.USERS, reviewData.sellerId);
    const sellerSnap = await getDoc(sellerRef);
    
    if (sellerSnap.exists()) {
      const seller = sellerSnap.data();
      const newReviewCount = seller.reviewCount + 1;
      const newRating = ((seller.rating * seller.reviewCount) + reviewData.rating) / newReviewCount;
      
      batch.update(sellerRef, {
        rating: newRating,
        reviewCount: newReviewCount
      });
    }
    
    await batch.commit();
    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REAL-TIME LISTENERS ====================
export const subscribeToProducts = (callback, filters = {}) => {
  const productsRef = collection(db, COLLECTIONS.PRODUCTS);
  let q = query(productsRef, where('status', '==', 'active'));
  
  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(products);
  });
};

export const subscribeToUserPoints = (userId, callback) => {
  const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
  
  return onSnapshot(pointsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  });
};

export const subscribeToUserTransactions = (userId, callback) => {
  const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
  const q = query(
    transactionsRef,
    where('buyerId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const transactions = [];
    snapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(transactions);
  });
};

// ==================== TRANSACTION QUERY FUNCTIONS ====================
export const getTransactions = async (filters = {}) => {
  try {
    const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
    let q = query(transactionsRef);
    
    // Apply filters
    if (filters.buyerId) {
      q = query(q, where('buyerId', '==', filters.buyerId));
    }
    
    if (filters.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    // Order by creation date
    q = query(q, orderBy('createdAt', 'desc'));
    
    // Limit results
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      const transactionData = doc.data();
      transactions.push({
        id: doc.id,
        ...transactionData
      });
    });
    
    return { success: true, transactions };
  } catch (error) {
    console.error('Error getting transactions:', error);
    return { success: false, error: error.message, transactions: [] };
  }
};

// ==================== NOTIFICATION FUNCTIONS ====================
export const getNotifications = async (filters = {}) => {
  try {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    let q = query(notificationsRef);
    
    // Apply filters
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (filters.unread) {
      q = query(q, where('read', '==', false));
    }
    
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    // Order by creation date
    q = query(q, orderBy('createdAt', 'desc'));
    
    // Limit results
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      const notificationData = doc.data();
      notifications.push({
        id: doc.id,
        ...notificationData
      });
    });
    
    return { success: true, notifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: error.message, notifications: [] };
  }
};

export const createNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    const notificationRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false
    });
    
    return { success: true, notificationId: notificationRef.id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
}; 