# Firebase Firestore Index Fix

## Issue Description
The application was encountering a Firebase Firestore index error when trying to load product details:

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/proyect-swapp-it/firestore/indexes?create_composite=...
```

## Root Cause
The error occurred because the `getProducts()` function in `firestore.js` was making queries that combined:
1. **Filtering by category** (`where('category', '==', filters.category)`)
2. **Ordering by createdAt** (`orderBy('createdAt', 'desc')`)

Firestore requires composite indexes for queries that filter and order by different fields.

## Solution Applied

### 1. Updated Firestore Indexes Configuration
Modified `firestore.indexes.json` to include the missing composite indexes:

```json
{
  "collectionGroup": "products",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "category", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

### 2. Added Additional Indexes
Also added indexes for other common query combinations:
- `sellerId` + `createdAt`
- `transactionType` + `createdAt`
- `sellerType` + `createdAt`
- `status` + `createdAt`

### 3. Deployed Indexes
Ran the deployment command:
```bash
firebase deploy --only firestore:indexes
```

## Files Modified
- `firestore.indexes.json` - Added composite indexes
- `FIREBASE_INDEX_FIX.md` - This documentation

## Testing
Created `test-indexes.js` to verify that all indexes are working properly.

## Prevention for Future
1. **Always test queries** with filters and ordering combinations
2. **Monitor Firebase Console** for index errors
3. **Add indexes proactively** when adding new query patterns
4. **Use the Firebase Console** to create indexes when errors occur

## Common Query Patterns That Need Indexes
- `category` + `createdAt` (for category pages)
- `sellerId` + `createdAt` (for user profiles)
- `status` + `createdAt` (for filtering by status)
- `price` + `createdAt` (for price-based sorting)

## Status
✅ **RESOLVED** - All necessary indexes have been deployed and should resolve the product loading issues. 