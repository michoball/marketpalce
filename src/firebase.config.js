// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMAS4EstSOqdrxbrsK8lPhBHGlvvkHheo",
  authDomain: "my-practice-project-8f406.firebaseapp.com",
  databaseURL: "https://my-practice-project-8f406-default-rtdb.firebaseio.com",
  projectId: "my-practice-project-8f406",
  storageBucket: "my-practice-project-8f406.appspot.com",
  messagingSenderId: "414179108038",
  appId: "1:414179108038:web:9500ebf0ccf8261dbee3c7",
  measurementId: "G-QHY3FK7D9C",
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
