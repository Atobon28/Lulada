// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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


const registerUser = async (email: string, password: string) => {
  try {
    console.log("Registering user with email:", email);
    const userCredential = await createUserWithEmailAndPassword(
      Auth,
      email,
      password
    );
    console.log(userCredential.user);
    return { isRegistered: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isRegistered: false, error: error };
  }
};
const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(
      Auth,
      email,
      password
    );
    console.log(userCredential.user);
    return { isLoggedIn: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, error: error };
  }
};
export {db,Auth,registerUser, loginUser}
