import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function StudentDashboard({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>👨‍🎓 Student Dashboard</Text>

            <PrimaryButton
                title="📝 Available Quizzes"
                onPress={() => navigation.navigate("QuizList")}
            />

            <PrimaryButton
                title="🔔 Notifications"
                onPress={() => navigation.navigate("Notifications")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
});
