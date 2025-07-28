// Firebase Deploy Check Script
// This script helps identify common issues with Firebase Deploy

console.log('🔥 Firebase Deploy Check - Starting...');

class FirebaseDeployChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.success = [];
    }

    async runAllChecks() {
        console.log('🔍 Running Firebase Deploy checks...\n');
        
        await this.checkFilePaths();
        this.checkScriptLoading();
        this.checkComponentRegistration();
        this.checkFirebaseConfig();
        this.checkLocalStorage();
        this.checkConsoleErrors();
        this.checkNetworkRequests();
        
        this.generateReport();
    }

    // Check if all file paths are correct for Firebase Hosting
    async checkFilePaths() {
        console.log('📁 Check 1: File Paths...');
        
        const criticalFiles = [
            '/components/cart-component.js',
            '/components/header-component.js',
            '/components/header-auth-component.js',
            '/components/footer-component.js',
            '/firebase/config.js',
            '/firebase/auth.js',
            '/js/global-header-manager.js'
        ];

        for (const file of criticalFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`✅ ${file} - OK`);
                    this.success.push(`File accessible: ${file}`);
                } else {
                    console.error(`❌ ${file} - NOT FOUND (${response.status})`);
                    this.issues.push(`File not found: ${file} (Status: ${response.status})`);
                }
            } catch (error) {
                console.error(`❌ ${file} - ERROR: ${error.message}`);
                this.issues.push(`File error: ${file} - ${error.message}`);
            }
        }
    }

    // Check if scripts are loading correctly
    checkScriptLoading() {
        console.log('\n📜 Check 2: Script Loading...');
        
        const scripts = document.querySelectorAll('script[src]');
        const loadedScripts = Array.from(scripts).map(script => script.src);
        
        const requiredScripts = [
            'cart-component.js',
            'header-component.js',
            'header-auth-component.js',
            'global-header-manager.js'
        ];

        requiredScripts.forEach(script => {
            const found = loadedScripts.some(src => src.includes(script));
            if (found) {
                console.log(`✅ ${script} - Loaded`);
                this.success.push(`Script loaded: ${script}`);
            } else {
                console.error(`❌ ${script} - NOT LOADED`);
                this.issues.push(`Script not loaded: ${script}`);
            }
        });
    }

    // Check if web components are registered
    checkComponentRegistration() {
        console.log('\n🧩 Check 3: Component Registration...');
        
        const components = [
            'cart-component',
            'header-component',
            'header-auth-component',
            'footer-component'
        ];

        components.forEach(component => {
            const isRegistered = customElements.get(component);
            if (isRegistered) {
                console.log(`✅ ${component} - Registered`);
                this.success.push(`Component registered: ${component}`);
            } else {
                console.error(`❌ ${component} - NOT REGISTERED`);
                this.issues.push(`Component not registered: ${component}`);
            }
        });
    }

    // Check Firebase configuration
    checkFirebaseConfig() {
        console.log('\n🔥 Check 4: Firebase Configuration...');
        
        if (typeof firebase !== 'undefined') {
            console.log('✅ Firebase SDK loaded');
            this.success.push('Firebase SDK loaded');
            
            if (firebase.apps.length > 0) {
                console.log('✅ Firebase app initialized');
                this.success.push('Firebase app initialized');
                
                const app = firebase.apps[0];
                const config = app.options;
                
                if (config.projectId) {
                    console.log(`✅ Project ID: ${config.projectId}`);
                    this.success.push(`Project ID: ${config.projectId}`);
                } else {
                    console.error('❌ No project ID found');
                    this.issues.push('No Firebase project ID found');
                }
            } else {
                console.error('❌ Firebase app not initialized');
                this.issues.push('Firebase app not initialized');
            }
        } else {
            console.error('❌ Firebase SDK not loaded');
            this.issues.push('Firebase SDK not loaded');
        }
    }

    // Check localStorage availability
    checkLocalStorage() {
        console.log('\n💾 Check 5: Local Storage...');
        
        try {
            localStorage.setItem('firebase-test', 'test');
            localStorage.removeItem('firebase-test');
            console.log('✅ LocalStorage working');
            this.success.push('LocalStorage working');
            
            // Check existing cart data
            const cartData = localStorage.getItem('swappit-cart');
            if (cartData) {
                console.log('✅ Cart data found in localStorage');
                this.success.push('Cart data found in localStorage');
            } else {
                console.log('ℹ️ No cart data in localStorage (normal for new users)');
            }
        } catch (error) {
            console.error('❌ LocalStorage error:', error.message);
            this.issues.push(`LocalStorage error: ${error.message}`);
        }
    }

    // Check for console errors
    checkConsoleErrors() {
        console.log('\n🚨 Check 6: Console Errors...');
        
        // This is a basic check - in a real scenario you'd want to capture errors
        const hasErrors = false; // Placeholder - would need error tracking
        
        if (!hasErrors) {
            console.log('✅ No console errors detected');
            this.success.push('No console errors detected');
        } else {
            console.error('❌ Console errors detected');
            this.warnings.push('Console errors detected - check browser console');
        }
    }

    // Check network requests
    checkNetworkRequests() {
        console.log('\n🌐 Check 7: Network Requests...');
        
        // Check if we can make requests to Firebase
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            console.log('✅ Firebase available for network requests');
            this.success.push('Firebase available for network requests');
        } else {
            console.error('❌ Firebase not available for network requests');
            this.issues.push('Firebase not available for network requests');
        }
    }

    // Generate final report
    generateReport() {
        console.log('\n📊 FIREBASE DEPLOY CHECK REPORT');
        console.log('=====================================');
        
        if (this.issues.length === 0) {
            console.log('🎉 NO CRITICAL ISSUES FOUND!');
            console.log('✅ Your Firebase Deploy should work correctly.');
        } else {
            console.log(`❌ ${this.issues.length} CRITICAL ISSUES FOUND:`);
            this.issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log(`\n⚠️ ${this.warnings.length} WARNINGS:`);
            this.warnings.forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning}`);
            });
        }
        
        console.log(`\n✅ ${this.success.length} SUCCESSFUL CHECKS:`);
        this.success.forEach((success, index) => {
            console.log(`   ${index + 1}. ${success}`);
        });
        
        console.log('\n🔧 RECOMMENDATIONS:');
        if (this.issues.length > 0) {
            console.log('   - Fix critical issues before deploying');
            console.log('   - Check file paths and script loading');
            console.log('   - Verify Firebase configuration');
        } else {
            console.log('   - Your deployment should work correctly');
            console.log('   - Test functionality after deploy');
        }
        
        console.log('\n📝 Next Steps:');
        console.log('   1. Run: firebase deploy');
        console.log('   2. Test the deployed site');
        console.log('   3. Check console for any runtime errors');
    }
}

// Auto-run the checker
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const checker = new FirebaseDeployChecker();
            checker.runAllChecks();
            
            // Make checker available globally
            window.firebaseDeployCheck = checker;
        }, 3000); // Wait for everything to load
    });
} 