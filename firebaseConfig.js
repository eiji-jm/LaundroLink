// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApcACvKZV885qtczF2QoW2L9vtgkTKt0E",
  authDomain: "laundrolink--signin.firebaseapp.com",
  projectId: "laundrolink--signin",
  storageBucket: "laundrolink--signin.appspot.com",
  messagingSenderId: "733628029063",
  appId: "1:733628029063:android:454a7d333a9c2da5a1c022",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
