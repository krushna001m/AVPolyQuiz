// screens/ResultScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function ResultScreen({ route, navigation }) {
    const { score, total } = route.params;
    const percent = Math.round((score / total) * 100);

    const getMessage = () => {
        if (percent === 100) return "Outstanding! Perfect score 👏";
        if (percent >= 80) return "Great job! Keep it up 💪";
        if (percent >= 50) return "Good effort! Review and try again 📚";
        return "Don't give up, practice more and retry 🔁";
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Quiz Result</Text>

                <View style={styles.scoreCircle}>
                    <Text style={styles.score}>
                        {score} / {total}
                    </Text>
                </View>

                <Text style={styles.percent}>
                    {percent}% Score
                </Text>
                <Text style={styles.message}>{getMessage()}</Text>

                <PrimaryButton
                    title="Back to Dashboard"
                    onPress={() => navigation.replace("StudentDashboard")}
                    style={{ marginTop: 24, width: "100%" }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: "center",
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 18,
        color: "#111827",
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 999,
        borderWidth: 6,
        borderColor: "#4f46e5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        backgroundColor: "#eef2ff",
    },
    score: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#111827",
    },
    percent: {
        fontSize: 16,
        color: "#4b5563",
        marginBottom: 6,
    },
    message: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 4,
    },
});
