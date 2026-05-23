// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkZpn0vsRvE7_w4Tr5LVlk4qdhuG1LJjk",
    authDomain: "virtualcloset-f863f.firebaseapp.com",
    projectId: "virtualcloset-f863f",
    storageBucket: "virtualcloset-f863f.firebasestorage.app",
    messagingSenderId: "425678904808",
    appId: "1:425678904808:web:80113480683c305ce6585d",
    measurementId: "G-N318X61ECS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };