import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Tu configuración Firebase (mantén la que ya tienes)
const firebaseConfig = {
  apiKey: "AIzaSyDntWN5qmsUdVZCZ7w7RVbJWOoULx9GVQg",
  authDomain: "luladita-369e3.firebaseapp.com",
  projectId: "luladita-369e3",
  storageBucket: "luladita-369e3.firebasestorage.app",
  messagingSenderId: "800273388542",
  appId: "1:800273388542:web:94bf6ebc57493b478266af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const Auth = getAuth(app);

// Exportar funciones de Firestore
export { doc, setDoc, getDoc, updateDoc };

// Exportar la app
export default app;