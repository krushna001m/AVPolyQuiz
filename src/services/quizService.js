import axios from "axios";
import firestore from '@react-native-firebase/firestore';

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

/* -------- USERS -------- */

export const createUser = async (uid, data) => {
    try {
        const res = await fetch(
            `${Firebase_Realtime_DB_URL}/users/${uid}.json`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        if (!res.ok) {
            throw new Error("Failed to create user");
        }
        return await res.json();
    } catch (error) {
        console.log("CREATE USER ERROR:", error);
        throw error;
    }
};

export const getUser = async (uid) => {
    try {
        const res = await fetch(
            `${Firebase_Realtime_DB_URL}/users/${uid}.json`
        );
        if (!res.ok) {
            throw new Error("Failed to get user");
        }
        return await res.json();
    } catch (error) {
        console.log("GET USER ERROR:", error);
        throw error;
    }
};

/* -------- GENERIC SAVE & GET -------- */


export const saveData = async (collectionName, data) => {
    const ref = await firestore().collection(collectionName).add(data);
    return ref;  // Returns DocumentReference with .id
};

export const getData = async (path) => {
    try {
        const res = await axios.get(
            `${Firebase_Realtime_DB_URL}/${path}.json`
        );
        return res.data;
    } catch (error) {
        console.log("GET DATA ERROR:", error);
        throw error;
    }
};

/* -------- QUIZZES & RESULTS HELPERS (OPTIONAL) -------- */

export const saveQuiz = async (quiz) => {
    // quiz: { title, subject, timeLimit, createdAt, published, createdBy? }
    return await saveData("quizzes", quiz);
};

export const saveResult = async (result) => {
    // result: { quizId, quizTitle, studentName, score, submittedAt, ... }
    return await saveData("results", result);
};
