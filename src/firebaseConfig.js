// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrIzE7wcJjNwCOuZpRzOx3C2W_g4QFFVg",
  authDomain: "projeto-react-firebase-a67d1.firebaseapp.com",
  databaseURL: "https://projeto-react-firebase-a67d1-default-rtdb.firebaseio.com",
  projectId: "projeto-react-firebase-a67d1",
  storageBucket: "projeto-react-firebase-a67d1.firebasestorage.app",
  messagingSenderId: "469079499593",
  appId: "1:469079499593:web:2f1deef6d573841a72b098",
  measurementId: "G-CDJWG8S391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db};
