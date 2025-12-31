import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB2AQDNf9xlPk-isDJm-033nLf66iv1Uo0",
    authDomain: "avpolyquiz-162f0.firebaseapp.com",
    projectId: "avpolyquiz-162f0",
    storageBucket: "avpolyquiz-162f0.firebasestorage.app",
    messagingSenderId: "794404017890",
    appId: "1:794404017890:android:970f141d056fc0fe1af0bb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
