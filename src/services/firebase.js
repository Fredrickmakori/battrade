// Correct import in firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// ... rest of your firebase.js

//In your components, import only the necessary firebase services

const firebaseConfig = {
  apiKey: "AIzaSyAt1wJUoqg8HsFSs1gXYYKXYkgZG5TFdC8",
  authDomain: "batter-trade-34b42.firebaseapp.com",
  projectId: "batter-trade-34b42",
  storageBucket: "batter-trade-34b42.firebasestorage.app",
  messagingSenderId: "853468174567",
  appId: "1:853468174567:web:3ccacf87be40fb30aaea42",
  measurementId: "G-6NELZZQWQL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const phoneAuthProvider = new PhoneAuthProvider(auth);
const functions = getFunctions(app);
export { auth, db, storage, phoneAuthProvider, googleProvider, functions };
