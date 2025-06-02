// Import the functions you need from the SDKs you need


import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBpxJQswKWtOR8hQhzSGrD5kNLIGBrmOsA",
  authDomain: "myfirstapp-29f58.firebaseapp.com",
  projectId: "myfirstapp-29f58",
  storageBucket: "myfirstapp-29f58.appspot.com",  // ✅ Corrected storageBucket
  messagingSenderId: "222839648363",
  appId: "1:222839648363:web:827b5b75e8b9a1e22f412e",
  measurementId: "G-3P12F13TBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);  // ✅ Add Firebase Storage

export { auth, firestore, storage };
