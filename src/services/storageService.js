import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserLocal = async (data) => {
    await AsyncStorage.setItem("loggedInUser", JSON.stringify(data));
};

export const getUserLocal = async () => {
    const user = await AsyncStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
};

export const removeUserLocal = async () => {
    await AsyncStorage.removeItem("loggedInUser");
};

