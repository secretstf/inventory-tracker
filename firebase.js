// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRr4w8TYMAej6uFJcqjY5GmT8tvdAMZzE",
  authDomain: "inventory-management-e50c0.firebaseapp.com",
  projectId: "inventory-management-e50c0",
  storageBucket: "inventory-management-e50c0.appspot.com",
  messagingSenderId: "458455003801",
  appId: "1:458455003801:web:8db3a97f832cc803ea7e08",
  measurementId: "G-VNEY9XN8GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};