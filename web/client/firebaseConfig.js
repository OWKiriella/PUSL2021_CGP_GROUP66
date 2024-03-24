import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj9q71gf6GA7w8wlkgfTQiNZ3jVWOXQKs",
  authDomain: "grocerystoreapplication-d99bd.firebaseapp.com",
  projectId: "grocerystoreapplication-d99bd",
  storageBucket: "grocerystoreapplication-d99bd.appspot.com",
  messagingSenderId: "606652202773",
  appId: "1:606652202773:web:57f697696cb99f1263f31c",
  measurementId: "G-GMNGFJHN9V"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
export { app, auth, firestore, storage,database };