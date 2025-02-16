// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXlcNZ3kqlmjgmMZHet97I4QqCsMeNUYA",
  authDomain: "carbonwise-c5c40.firebaseapp.com",
  projectId: "carbonwise-c5c40",
  storageBucket: "carbonwise-c5c40.firebasestorage.app",
  messagingSenderId: "464301093125",
  appId: "1:464301093125:ios:023ab31753a399a735876c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
