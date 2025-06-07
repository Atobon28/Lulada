// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const db = getFirestore(app);
const Auth = getAuth(app);

export {db,Auth}