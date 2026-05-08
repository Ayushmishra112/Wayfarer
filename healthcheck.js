import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

dotenv.config();

async function runHealthCheck() {
  console.log('🚀 Starting API Health Check...\n');

  // 1. Check Gemini
  console.log('1. Checking Gemini API...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Say exactly the word "SUCCESS" and nothing else.');
    const text = result.response.text().trim();
    if (text.includes('SUCCESS')) {
      console.log('✅ Gemini API is WORKING.');
    } else {
      console.log('⚠️ Gemini API responded, but unexpected output: ', text);
    }
  } catch (err) {
    console.error('❌ Gemini API FAILED:', err.message);
  }

  console.log('\n----------------------------------------\n');

  // 2. Check Firebase
  console.log('2. Checking Firebase Configuration...');
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
    
    // Check if keys are present
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_')) {
      console.error('❌ Firebase API Key is missing or invalid.');
      return;
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Simple query to test connectivity
    const q = query(collection(db, 'healthcheck'), limit(1));
    await getDocs(q);
    
    console.log('✅ Firebase configuration is VALID and connected to Firestore.');
  } catch (err) {
    console.error('❌ Firebase FAILED:', err.message);
    if (err.message.includes('missing or insufficient permissions')) {
       console.log('ℹ️ Note: This is a permissions error, which actually means the connection WORKED, but your Firestore database rules are set to deny read access (which is completely fine/normal for a new project). The keys themselves are valid!');
    }
  }

  console.log('\n🚀 Health Check Complete.');
  process.exit(0);
}

runHealthCheck();
