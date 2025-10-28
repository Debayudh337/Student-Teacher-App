import admin from 'firebase-admin';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

console.log('🧪 Testing Firebase Connection...\n');

async function testFirebase() {
  try {
    // 1. Check if firebase-admin.json exists
    const serviceAccountPath = path.join(__dirname, 'config', 'firebase-admin.json');
    console.log('📁 Looking for service account file at:', serviceAccountPath);
    
    const fs = await import('fs');
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('firebase-admin.json not found at: ' + serviceAccountPath);
    }
    console.log('✅ Service account file found');

    // 2. Load service account
    const serviceAccount = require(serviceAccountPath);
    console.log('✅ Service account loaded for project:', serviceAccount.project_id);

    // 3. Initialize Firebase Admin
    console.log('🔄 Initializing Firebase Admin...');
    
    // Check if already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      console.log('ℹ️ Firebase already initialized');
    }

    // 4. Test Firestore connection
    console.log('🔄 Testing Firestore connection...');
    const db = admin.firestore();
    
    // Test write operation
    const testRef = db.collection('test_connection').doc('test_document');
    await testRef.set({
      message: 'Firebase connection test',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: true
    });
    console.log('✅ Firestore write operation successful');

    // Test read operation
    const doc = await testRef.get();
    if (doc.exists) {
      console.log('✅ Firestore read operation successful');
      console.log('📄 Document data:', doc.data());
    } else {
      throw new Error('Document not found after writing');
    }

    // Test delete operation
    await testRef.delete();
    console.log('✅ Firestore delete operation successful');

    console.log('\n🎉 ALL FIREBASE TESTS PASSED!');
    console.log('🔥 Firebase is working correctly!');

    // Exit successfully
    process.exit(0);

  } catch (error) {
    console.error('\n❌ FIREBASE TEST FAILED:');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    
    if (error.message.includes('ENOENT')) {
      console.log('1. Make sure firebase-admin.json exists in config/ folder');
      console.log('2. Check the file path is correct');
    } else if (error.message.includes('private key')) {
      console.log('1. Check your firebase-admin.json file is valid JSON');
      console.log('2. Ensure the private key is properly formatted');
    } else if (error.message.includes('permission')) {
      console.log('1. Check Firebase project permissions');
      console.log('2. Verify service account has proper access');
    } else {
      console.log('1. Check Firebase Admin SDK installation: npm install firebase-admin');
      console.log('2. Verify Node.js version compatibility');
    }
    
    process.exit(1);
  }
}

// Run the test
testFirebase()