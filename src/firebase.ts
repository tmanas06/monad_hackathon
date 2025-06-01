import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE9kGbMkgzhOVNLBwd1YD4WoIwUaOe1qU",
  authDomain: "ovps-2c71b.firebaseapp.com",
  projectId: "ovps-2c71b",
  storageBucket: "ovps-2c71b.appspot.com",
  messagingSenderId: "585114211388",
  appId: "1:585114211388:web:ccf8bed3fc62f565d15f39",
  measurementId: "G-E9CSTYL6HD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
