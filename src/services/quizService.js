import { Firebase_Realtime_DB_URL } from "@env";
import axios from "axios";

/* CREATE */
export const createUser = async (uid, data) => {
    const res = await fetch(
        `${Firebase_Realtime_DB_URL}/users/${uid}.json`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    );
    return res.json();
};

/* READ */
export const getUser = async (uid) => {
    const res = await fetch(
        `${Firebase_Realtime_DB_URL}/users/${uid}.json`
    );
    return res.json();
};

/* GENERIC SAVE & GET */

export const saveData = async (path, data) => {
    const res = await axios.post(
        `${Firebase_Realtime_DB_URL}/${path}.json`,
        data
    );
    return res.data;
};

export const getData = async (path) => {
    const res = await axios.get(
        `${Firebase_Realtime_DB_URL}/${path}.json`
    );
    return res.data;
};


