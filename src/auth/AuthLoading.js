import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLoading({ navigation }) {
    useEffect(() => {
        const checkLogin = async () => {
            const data = await AsyncStorage.getItem("loggedInUser");

            if (!data) {
                // ❌ Not logged in
                navigation.replace("Login");
                return;
            }

            const user = JSON.parse(data);

            // ✅ Logged in → role-based redirect
            if (user.role === "teacher") {
                navigation.replace("TeacherDashboard");
            } else {
                navigation.replace("StudentDashboard");
            }
        };

        checkLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
