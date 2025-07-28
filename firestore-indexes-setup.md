# Firestore Indexes Setup for SWAPPIT

## Required Indexes

### 1. Products Collection Indexes

#### Basic Indexes (Single Field)
- **Collection:** `products`
- **Field:** `category` (Ascending)
- **Field:** `sellerId` (Ascending)  
- **Field:** `transactionType` (Ascending)
- **Field:** `sellerType` (Ascending)
- **Field:** `status` (Ascending)
- **Field:** `createdAt` (Descending)
- **Field:** `price` (Ascending)

#### Composite Indexes (if needed for complex queries)
- **Collection:** `products`
- **Fields:** 
  - `category` (Ascending)
  - `createdAt` (Descending)
  - `__name__` (Descending)

- **Collection:** `products`
- **Fields:**
  - `transactionType` (Ascending)
  - `createdAt` (Descending)
  - `__name__` (Descending)

- **Collection:** `products`
- **Fields:**
  - `sellerType` (Ascending)
  - `createdAt` (Descending)
  - `__name__` (Descending)

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project `proyect-swapp-it`
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Select **Collection ID:** `products`
6. Add the required fields
7. Click **Create**

## Current Query Optimization

The `getProducts` function has been optimized to:
- Use single-field filters when possible
- Apply complex filtering in memory (JavaScript) rather than in Firestore
- Avoid complex composite indexes for basic queries
- Use simple ordering with `createdAt` and `__name__`

## Testing

After creating the indexes, test the following queries:
1. Get all products (no filters)
2. Get products by category
3. Get products by transaction type (sale/swapp)
4. Get products by seller type (student/business)
5. Get products ordered by creation date

## Error Resolution

If you see index errors:
1. Click the link in the error message to create the required index
2. Wait for the index to build (can take a few minutes)
3. Test the query again

## Performance Notes

- Indexes take time to build (1-5 minutes)
- Complex composite indexes are expensive
- Use single-field indexes when possible
- Consider pagination for large datasets 