// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sk-estate-ab3b3.firebaseapp.com",
  projectId: "sk-estate-ab3b3",
  storageBucket: "sk-estate-ab3b3.appspot.com",
  messagingSenderId: "585205250615",
  appId: "1:585205250615:web:11353b0dfae2d84a4f1db2"
};

export const app = initializeApp(firebaseConfig);