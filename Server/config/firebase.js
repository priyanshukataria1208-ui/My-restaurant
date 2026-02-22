// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCGSqDkn4OYzBKVNGcI6iBcLuiMCuIS34",
  authDomain: "test-e872e.firebaseapp.com",
  projectId: "test-e872e",
  storageBucket: "test-e872e.firebasestorage.app",
  messagingSenderId: "296257822180",
  appId: "1:296257822180:web:68c4fd8e1077062ad0bbf1",
  measurementId: "G-HGKSSGGJ88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const googleProvider=new GoogleAuthProvider();