import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function StudentPerformance() {
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState([]);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        loadPerformance();
    }, []);

    const loadPerformance = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken(true);

            // ✅ Step 1: get all quizzes
            const quizRes = await axios.get(
                `${Firebase_Realtime_DB_URL}/quizzes.json`,
                { params: { auth: token } }
            );

            if (!quizRes.data) {
                setAttempts([]);
                setLoading(false);
                return;
            }

            const results = [];
            let totalQ = 0, correct = 0, wrong = 0, skipped = 0;

            // ✅ Step 2: check result per quiz (RULE SAFE)
            for (let quizId of Object.keys(quizRes.data)) {
                const res = await axios.get(
                    `${Firebase_Realtime_DB_URL}/results/${quizId}/${user.uid}.json`,
                    { params: { auth: token } }
                );

                if (!res.data) continue;

                const attempt = res.data;
                results.push({ quizId, ...attempt });

                totalQ += attempt.total;

                attempt.answers.forEach(a => {
                    if (a.skipped) skipped++;
                    else if (a.isCorrect) correct++;
                    else wrong++;
                });
            }

            const accuracy = totalQ
                ? Math.round((correct / totalQ) * 100)
                : 0;

            setSummary({
                quizzes: results.length,
                totalQ,
                correct,
                wrong,
                skipped,
                accuracy,
            });

            setAttempts(results);
        } catch (e) {
            console.log("PERFORMANCE LOAD ERROR:", e);
            Alert.alert("Error", "Failed to load performance");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text>Loading performance...</Text>
            </View>
        );
    }

    if (!attempts.length) {
        return (
            <View style={styles.center}>
                <MaterialIcons name="bar-chart" size={50} color="#9ca3af" />
                <Text>No quiz attempts yet</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Performance</Text>

            {/* SUMMARY */}
            <View style={styles.summary}>
                <Stat icon="assignment" label="Quizzes" value={summary.quizzes} />
                <Stat icon="check-circle" label="Correct" value={summary.correct} />
                <Stat icon="close" label="Wrong" value={summary.wrong} />
                <Stat icon="skip-next" label="Skipped" value={summary.skipped} />
            </View>

            <Text style={styles.accuracy}>
                🎯 Accuracy: {summary.accuracy}%
            </Text>

            {/* HISTORY */}
            {attempts.map((a, i) => {
                const percent = Math.round((a.score / a.total) * 100);
                const pass = percent >= 40;

                return (
                    <View key={i} style={styles.card}>
                        <Text>Quiz: {a.quizId}</Text>
                        <Text>
                            Score: {a.score}/{a.total} ({percent}%)
                        </Text>
                        <Text style={{ color: pass ? "green" : "red" }}>
                            {pass ? "PASS" : "FAIL"}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

/* ================= SMALL COMPONENT ================= */
function Stat({ icon, label, value }) {
    return (
        <View style={styles.stat}>
            <MaterialIcons name={icon} size={20} color="#4f46e5" />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
    summary: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    stat: {
        width: "48%",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        alignItems: "center",
    },
    statValue: { fontSize: 18, fontWeight: "bold" },
    statLabel: { fontSize: 12, color: "#6b7280" },
    accuracy: {
        marginVertical: 10,
        fontWeight: "bold",
        color: "#065f46",
    },
    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },
});
