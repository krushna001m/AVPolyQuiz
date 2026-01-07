import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // ✅ ADD THIS

const firebaseConfig = {
    apiKey: "AIzaSyB2AQDNf9xlPk-isDJm-033nLf66iv1Uo0",
    authDomain: "avpolyquiz-162f0.firebaseapp.com",
    projectId: "avpolyquiz-162f0",
    storageBucket: "avpolyquiz-162f0.firebasestorage.app",
    messagingSenderId: "794404017890",
    appId: "1:794404017890:android:970f141d056fc0fe1af0bb",
};

const app = initializeApp(firebaseConfig);

/* ✅ AUTH */
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

/* ✅ FIRESTORE (for quizzes, questions, etc.) */
export const firestore = getFirestore(app);

/* ✅ REALTIME DATABASE (FOR RESULTS DASHBOARD) */
export const rtdb = getDatabase(app);
