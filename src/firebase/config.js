// Mock Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb1waDmHSl-SKrUK1iXNtWYpbji3_2CM8",
  authDomain: "educational-resource-blog.firebaseapp.com",
  projectId: "educational-resource-blog",
  storageBucket: "educational-resource-blog.appspot.com",
  messagingSenderId: "44187229311",
  appId: "1:44187229311:web:d115efa8c96d8f117fb34a",
  measurementId: "G-7X5KEBY51Q"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

  