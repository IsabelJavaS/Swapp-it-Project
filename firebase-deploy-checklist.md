# Firebase Deploy Checklist

## 🔥 Pre-Deploy Verification

### 1. File Structure Check
- [ ] All files are in the `public/` directory
- [ ] `firebase.json` is configured correctly
- [ ] No files are in the ignore list that should be deployed

### 2. Critical Files Verification
- [ ] `/components/cart-component.js` exists
- [ ] `/components/header-component.js` exists
- [ ] `/components/header-auth-component.js` exists
- [ ] `/components/footer-component.js` exists
- [ ] `/firebase/config.js` exists
- [ ] `/firebase/auth.js` exists
- [ ] `/js/global-header-manager.js` exists

### 3. Script Loading Order
- [ ] Cart component loads before headers
- [ ] Firebase config loads before other scripts
- [ ] All components are registered before use

### 4. Firebase Configuration
- [ ] Firebase project is configured
- [ ] Authentication is enabled
- [ ] Firestore rules are set
- [ ] Storage rules are set

## 🚀 Deploy Commands

### Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Project (if not done)
```bash
firebase init hosting
```

### Deploy to Firebase
```bash
firebase deploy
```

### Deploy only hosting
```bash
firebase deploy --only hosting
```

## 🔍 Post-Deploy Testing

### 1. Open the deployed site
- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Navigation works correctly

### 2. Check Console for Errors
- [ ] No JavaScript errors
- [ ] All components load correctly
- [ ] Firebase connection works

### 3. Test Functionality
- [ ] Header displays correctly
- [ ] Cart functionality works
- [ ] Authentication works
- [ ] Navigation between pages works

### 4. Test Responsive Design
- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works

## 🐛 Common Firebase Deploy Issues

### Issue: Files not found (404)
**Solution:**
- Check file paths are correct
- Ensure files are in `public/` directory
- Verify `firebase.json` configuration

### Issue: Scripts not loading
**Solution:**
- Check script order in HTML
- Verify all dependencies are loaded
- Check for JavaScript errors

### Issue: Components not registering
**Solution:**
- Ensure components load before use
- Check for syntax errors in component files
- Verify `customElements.define()` is called

### Issue: Firebase not connecting
**Solution:**
- Check Firebase configuration
- Verify project ID is correct
- Ensure Firebase services are enabled

## 📊 Debug Commands

### Check Firebase project
```bash
firebase projects:list
```

### Check hosting configuration
```bash
firebase hosting:channel:list
```

### View deployment history
```bash
firebase hosting:releases:list
```

### Test locally before deploy
```bash
firebase serve
```

## 🎯 Quick Verification Script

After deploying, open the browser console and run:
```javascript
// Check if all components are loaded
window.headerTests.runAll()

// Check Firebase deploy specific issues
window.firebaseDeployCheck.runAllChecks()

// Test cart functionality
window.headerDebug.testCart()
```

## 📝 Deployment Notes

- **Environment**: Firebase Hosting
- **Public Directory**: `public/`
- **Build Process**: None (static files)
- **Cache**: Firebase handles caching automatically
- **SSL**: Automatically provided by Firebase

## 🔧 Troubleshooting

### If deploy fails:
1. Check Firebase CLI version: `firebase --version`
2. Verify login: `firebase login --reauth`
3. Check project: `firebase use --add`
4. Clear cache: `firebase logout && firebase login`

### If site doesn't work after deploy:
1. Check browser console for errors
2. Verify all files are accessible
3. Test with different browsers
4. Check Firebase project settings

### If components don't work:
1. Verify script loading order
2. Check for JavaScript errors
3. Ensure all dependencies are loaded
4. Test locally with `firebase serve` 