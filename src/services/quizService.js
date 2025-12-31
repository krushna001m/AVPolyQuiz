import { Firebase_Realtime_DB_URL } from "@env";


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

