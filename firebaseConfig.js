// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, push, serverTimestamp, onValue, update } from "firebase/database";

// Firebase Config - Palitan ito ng config mula sa Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyC8pxwOWmcaYvd-2Ar07itWLH8rpzQbcn4",
    authDomain: "toma-c791f.firebaseapp.com",
    databaseURL: "https://toma-c791f-default-rtdb.firebaseio.com",
    projectId: "toma-c791f",
    storageBucket: "toma-c791f.firebasestorage.app",
    messagingSenderId: "1016608094839",
    appId: "1:1016608094839:web:20698777ea69bc4c07e472",
    measurementId: "G-FJBLBMQD4G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'english';
const db = getDatabase(app);

export { db, ref, set, push, serverTimestamp, onValue, update };
