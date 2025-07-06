// Test script to verify Firestore collections
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKMtqjnIjP0dYXQYjbHy2JRNr5q8HiLhU",
  authDomain: "safekids-d5a79.firebaseapp.com",
  projectId: "safekids-d5a79",
  storageBucket: "safekids-d5a79.appspot.com",
  messagingSenderId: "1045738700992",
  appId: "1:1045738700992:web:b1fae9b7b8f7d3a1b8c1e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestoreCollections() {
  try {
    console.log('Testing Firestore collections...');
    
    // Test students collection
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    console.log(`Students collection: ${studentsSnapshot.size} documents`);
    
    // Test inOutRecords collection
    const inOutSnapshot = await getDocs(collection(db, 'inOutRecords'));
    console.log(`inOutRecords collection: ${inOutSnapshot.size} documents`);
    
    // Test notifications collection
    const notificationsSnapshot = await getDocs(collection(db, 'notifications'));
    console.log(`Notifications collection: ${notificationsSnapshot.size} documents`);
    
    // Show sample data
    if (studentsSnapshot.size > 0) {
      console.log('\nSample student data:');
      studentsSnapshot.docs.slice(0, 1).forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }
    
    if (inOutSnapshot.size > 0) {
      console.log('\nSample inOut record:');
      inOutSnapshot.docs.slice(0, 1).forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }
    
    if (notificationsSnapshot.size > 0) {
      console.log('\nSample notification:');
      notificationsSnapshot.docs.slice(0, 1).forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testFirestoreCollections();
