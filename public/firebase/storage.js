// Firebase Storage Functions
import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import { storage } from './config.js';

// Upload product image
export const uploadProductImage = async (file, productId, imageIndex = 0, transactionType = 'sale', category = 'other') => {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    // Organize by transaction type and category
    let baseFolder = '';
    if (transactionType === 'sale') {
      baseFolder = 'ProductsCatalog';
    } else if (transactionType === 'swapp') {
      baseFolder = 'ProductsSwapp';
    } else {
      baseFolder = 'ProductsCatalog'; // Default fallback
    }
    
    // Create folder structure: baseFolder/category/productId/image
    const fileName = `${baseFolder}/${category}/${productId}/image_${imageIndex}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    console.log('Uploading file:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      productId,
      transactionType,
      category,
      baseFolder
    });
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Upload successful:', {
      fileName,
      downloadURL,
      bytesTransferred: snapshot.bytesTransferred,
      folderStructure: `${baseFolder}/${category}/${productId}`
    });
    
    return { success: true, url: downloadURL, path: fileName };
  } catch (error) {
    console.error('Error uploading product image:', error);
    console.error('Error details:', {
      errorCode: error.code,
      errorMessage: error.message,
      fileName: file?.name,
      fileSize: file?.size,
      productId,
      transactionType,
      category
    });
    
    // Provide more specific error messages
    let errorMessage = error.message;
    
    if (error.code === 'storage/unauthorized') {
      errorMessage = 'Unauthorized: Check Firebase Storage rules and authentication.';
    } else if (error.code === 'storage/quota-exceeded') {
      errorMessage = 'Storage quota exceeded. Please try with a smaller image.';
    } else if (error.code === 'storage/retry-limit-exceeded') {
      errorMessage = 'Upload failed due to network issues. Please try again.';
    } else if (error.code === 'storage/invalid-checksum') {
      errorMessage = 'File corruption detected. Please try uploading again.';
    }
    
    return { success: false, error: errorMessage, errorCode: error.code };
  }
};

// Upload multiple product images
export const uploadProductImages = async (files, productId, transactionType = 'sale', category = 'other') => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadProductImage(file, productId, index, transactionType, category)
    );
    
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result.success);
    
    if (successfulUploads.length === 0) {
      return { success: false, error: 'No images were uploaded successfully' };
    }
    
    return { 
      success: true, 
      images: successfulUploads.map(upload => ({
        url: upload.url,
        path: upload.path
      }))
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return { success: false, error: error.message };
  }
};

// Upload user avatar
export const uploadUserAvatar = async (file, userId) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatars/${userId}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, path: fileName };
  } catch (error) {
    console.error('Error uploading user avatar:', error);
    return { success: false, error: error.message };
  }
};

// Delete file from storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// Delete all product images
export const deleteProductImages = async (productId) => {
  try {
    const productImagesRef = ref(storage, `ProductsCatalog/${productId}`);
    const result = await listAll(productImagesRef);
    
    const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting product images:', error);
    return { success: false, error: error.message };
  }
};

// Get file download URL
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(fileRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error getting file URL:', error);
    return { success: false, error: error.message };
  }
};

// Validate file type and size
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth = 1920,
    maxHeight = 1080
  } = options;
  
  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type must be one of: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { valid: true };
};

// Compress image before upload (client-side)
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const maxWidth = 800;
      const maxHeight = 600;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}; 