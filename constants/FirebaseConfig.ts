// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpxJQswKWtOR8hQhzSGrD5kNLIGBrmOsA",
  authDomain: "myfirstapp-29f58.firebaseapp.com",
  projectId: "myfirstapp-29f58",
  storageBucket: "myfirstapp-29f58.firebasestorage.app",
  messagingSenderId: "222839648363",
  appId: "1:222839648363:web:827b5b75e8b9a1e22f412e",
   measurementId: "G-3P12F13TBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


// Initialize Firebase Auth with persistence


// export auth and firestore

export { auth, firestore };