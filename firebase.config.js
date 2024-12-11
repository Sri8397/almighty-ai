// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3craAXwIdu193HkovM0ighT93XD6oeAg",
  authDomain: "almighty-ai.firebaseapp.com",
  projectId: "almighty-ai",
  storageBucket: "almighty-ai.firebasestorage.app",
  messagingSenderId: "479443181874",
  appId: "1:479443181874:web:93fbe1eba4ba78721b372b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)

export const roomRef = collection(db, 'rooms')
export const userRef = collection(db, 'users')