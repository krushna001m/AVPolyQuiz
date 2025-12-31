import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function RoleRedirect({ route, navigation }) {
    const role = route?.params?.role;

    useEffect(() => {
        if (!role) return;

        if (role === "teacher") {
            navigation.replace("TeacherDashboard");
        } else {
            navigation.replace("StudentDashboard");
        }
    }, [role]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
