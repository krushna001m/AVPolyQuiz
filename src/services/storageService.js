import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "loggedInUser";

export const saveUserLocal = async (data) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch (error) {
        console.log("SAVE USER LOCAL ERROR:", error);
        throw error;
    }
};

export const getUserLocal = async () => {
    try {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.log("GET USER LOCAL ERROR:", error);
        return null;
    }
};

export const removeUserLocal = async () => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.log("REMOVE USER LOCAL ERROR:", error);
        throw error;
    }
};
