import { saveData } from "./quizService";

/**
 * Save notification to Realtime DB.
 * Extend later for FCM / topic-based push.
 */
export const sendNotification = async (title, message) => {
    try {
        const payload = {
            title,
            message,
            createdAt: Date.now(),
        };
        await saveData("notifications", payload);
        return true;
    } catch (error) {
        console.log("SEND NOTIFICATION ERROR:", error);
        throw error;
    }
};
