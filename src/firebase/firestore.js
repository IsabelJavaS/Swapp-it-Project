// Firestore Database Functions for Marketplace
import { 
  collection,
  doc,
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
import { db } from './config.js';

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
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      points: 0,
      totalSales: 0,
      totalPurchases: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create points document for user
    const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
    await setDoc(pointsRef, {
      balance: 0,
      history: [],
      createdAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
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

// ==================== POINTS SYSTEM ====================
export const getUserPoints = async (userId) => {
  try {
    const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
    const pointsSnap = await getDoc(pointsRef);
    
    if (pointsSnap.exists()) {
      return { success: true, data: pointsSnap.data() };
    } else {
      return { success: false, error: 'Points record not found' };
    }
  } catch (error) {
    console.error('Error getting user points:', error);
    return { success: false, error: error.message };
  }
};

export const addPoints = async (userId, amount, reason, transactionId = null) => {
  try {
    const batch = writeBatch(db);
    
    // Update points balance
    const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
    batch.update(pointsRef, {
      balance: increment(amount),
      history: arrayUnion({
        amount,
        reason,
        transactionId,
        timestamp: serverTimestamp(),
        type: 'credit'
      })
    });
    
    // Update user profile
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    batch.update(userRef, {
      points: increment(amount),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error adding points:', error);
    return { success: false, error: error.message };
  }
};

export const deductPoints = async (userId, amount, reason, transactionId = null) => {
  try {
    const batch = writeBatch(db);
    
    // Update points balance
    const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
    batch.update(pointsRef, {
      balance: increment(-amount),
      history: arrayUnion({
        amount: -amount,
        reason,
        transactionId,
        timestamp: serverTimestamp(),
        type: 'debit'
      })
    });
    
    // Update user profile
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    batch.update(userRef, {
      points: increment(-amount),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
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
    let q = query(productsRef, where('status', '==', 'active'));
    
    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }
    if (filters.priceMin || filters.priceMax) {
      if (filters.priceMin) {
        q = query(q, where('price', '>=', filters.priceMin));
      }
      if (filters.priceMax) {
        q = query(q, where('price', '<=', filters.priceMax));
      }
    }
    if (filters.search) {
      // Note: Firestore doesn't support full-text search natively
      // Consider using Algolia or similar for better search
    }
    
    // Order by
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
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, products };
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