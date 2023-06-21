// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdATF_HHE5xJq2QyY-kF4MJHJMy8U6Q-I",
  authDomain: "howtouploadfilestofirestore.firebaseapp.com",
  projectId: "howtouploadfilestofirestore",
  storageBucket: "howtouploadfilestofirestore.appspot.com",
  messagingSenderId: "509801269616",
  appId: "1:509801269616:web:bd86e88b84e987fbae67b5",
  measurementId: "G-3QGEL614V8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
