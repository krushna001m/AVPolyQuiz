// screens/ResultScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ResultScreen({ route, navigation }) {
    const { score, total, answers = [], quizId, quizTitle } = route.params;

    const percent = Math.round((score / total) * 100);
    const correct = score;
    const wrong = total - score;
    const accuracy = Math.round((correct / total) * 100);
    const isPass = percent >= 40;

    const getGrade = () => {
        if (percent >= 90) return "A+";
        if (percent >= 75) return "A";
        if (percent >= 60) return "B";
        if (percent >= 40) return "C";
        return "D";
    };

    const getMessage = () => {
        if (percent === 100) return "Outstanding! Perfect score 🎯";
        if (percent >= 80) return "Excellent performance 💪";
        if (percent >= 50) return "Good effort! Keep practicing 📚";
        return "Don’t give up, try again 🔁";
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* TITLE */}
                <Text style={styles.title}>
                    <MaterialIcons name="emoji-events" size={24} color="#4f46e5" /> Quiz Result
                </Text>

                {/* SCORE CIRCLE */}
                <View
                    style={[
                        styles.scoreCircle,
                        { borderColor: isPass ? "#16a34a" : "#dc2626" },
                    ]}
                >
                    <Text style={styles.score}>
                        {score} / {total}
                    </Text>
                </View>

                <Text style={styles.percent}>{percent}% Score</Text>

                {/* PASS / FAIL */}
                <Text
                    style={[
                        styles.status,
                        { color: isPass ? "#16a34a" : "#dc2626" },
                    ]}
                >
                    <MaterialIcons
                        name={isPass ? "check-circle" : "cancel"}
                        size={20}
                        color={isPass ? "#16a34a" : "#dc2626"}
                    />{" "}
                    {isPass ? "PASS" : "FAIL"}
                </Text>

                <Text style={styles.message}>{getMessage()}</Text>

                {/* STATS */}
                <View style={styles.statsRow}>
                    <Stat icon="check-circle" label="Correct" value={correct} color="#16a34a" />
                    <Stat icon="cancel" label="Wrong" value={wrong} color="#dc2626" />
                </View>

                <View style={styles.statsRow}>
                    <Stat icon="gps-fixed" label="Accuracy" value={`${accuracy}%`} color="#2563eb" />
                    <Stat icon="military-tech" label="Grade" value={getGrade()} color="#9333ea" />
                </View>

                {/* ACTION BUTTONS */}
                <ActionButton
                    icon="visibility"
                    title="Review Answers"
                    onPress={() =>
                        navigation.navigate("AnswerReview", {
                            answers,
                            quizTitle,
                        })
                    }
                />

            

                <ActionButton
                    icon="dashboard"
                    title="Back to Dashboard"
                    onPress={() => navigation.replace("StudentDashboard")}
                />
            </View>
        </View>
    );
}

/* ================= STAT BOX ================= */
function Stat({ icon, label, value, color }) {
    return (
        <View style={styles.statBox}>
            <MaterialIcons name={icon} size={22} color={color} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ================= ACTION BUTTON ================= */
function ActionButton({ icon, title, onPress }) {
    return (
        <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
            <MaterialIcons name={icon} size={20} color="#fff" />
            <Text style={styles.actionText}>{title}</Text>
        </TouchableOpacity>
    );
}

/* ================= STYLES ================= */
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
        borderRadius: 22,
        paddingVertical: 30,
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
        width: 130,
        height: 130,
        borderRadius: 999,
        borderWidth: 6,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        backgroundColor: "#eef2ff",
    },
    score: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
    },
    percent: {
        fontSize: 16,
        color: "#4b5563",
    },
    status: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 8,
    },
    message: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 4,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
    },
    statBox: {
        width: "48%",
        backgroundColor: "#f3f4f6",
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginTop: 6,
    },
    statLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 14,
        borderRadius: 14,
        width: "100%",
        marginTop: 12,
    },
    actionText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
        fontSize: 15,
    },
});
