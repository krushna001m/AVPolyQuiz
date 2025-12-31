import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function TeacherDashboard({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>👨‍🏫 Teacher Dashboard</Text>

            <PrimaryButton
                title="➕ Create New Quiz"
                onPress={() => navigation.navigate("CreateQuiz")}
            />

            <PrimaryButton
                title="📊 Performance Dashboard"
                onPress={() => navigation.navigate("PerformanceDashboard")}
            />

            <PrimaryButton
                title="🔔 Send Notification"
                onPress={() => navigation.navigate("SendNotification")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
});
