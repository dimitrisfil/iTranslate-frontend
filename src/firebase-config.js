import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_GOOGLE_KEY,
    authDomain: "itranslate-fbfde.firebaseapp.com",
    projectId: "itranslate-fbfde",
    storageBucket: "itranslate-fbfde.appspot.com",
    messagingSenderId: "959340136707",
    appId: "1:959340136707:web:582decf56201e4664d8136",
    measurementId: "G-4YRF9R0TVB"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);