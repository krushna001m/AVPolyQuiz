import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function ResultScreen({ route, navigation }) {
    const { score, total } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎉 Quiz Result</Text>

            <Text style={styles.score}>
                {score} / {total}
            </Text>

            <Text style={styles.percent}>
                Percentage: {Math.round((score / total) * 100)}%
            </Text>

            <PrimaryButton
                title="Back to Dashboard"
                onPress={() => navigation.replace("StudentDashboard")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
    score: { fontSize: 40, fontWeight: "bold", color: "#16a34a" },
    percent: { fontSize: 18, marginVertical: 10 },
});
