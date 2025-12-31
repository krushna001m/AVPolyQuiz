import { saveData } from "./quizService";

export const sendNotification = async (title, message) => {
    await saveData("notifications", {
        title,
        message,
        createdAt: Date.now(),
    });
};
