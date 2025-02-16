import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔒 تحميل متغيرات البيئة من `.env.local`
const firebaseConfig = {
  apiKey: "AIzaSyDI6HdWS2uMoO9a09qOaZWngf-KY7pVNdM",
  authDomain: "ghram-sultan-chat.firebaseapp.com",
  projectId: "ghram-sultan-chat",
  storageBucket: "ghram-sultan-chat.firebasestorage.app",
  messagingSenderId: "198544496479",
  appId: "1:198544496479:web:72c72fec2b390c843a48ea",
  measurementId: "G-NVZE33M1G3"
};

// تأكد إن Firebase بيتم تشغيله مرة واحدة فقط
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
