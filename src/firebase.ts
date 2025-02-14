// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnpHj0fZFjyvuCciYPhAsLuGXQ11M-RYg",
  authDomain: "literature-blog-20567.firebaseapp.com",
  projectId: "literature-blog-20567",
  storageBucket: "literature-blog-20567.firebasestorage.app",
  messagingSenderId: "425774352697",
  appId: "1:425774352697:web:f59207728b0e47f69f80e8"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const db = getFirestore(app);
export { storage, ref, uploadBytes, getDownloadURL };
// Initialize Firebase
