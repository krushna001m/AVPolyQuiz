import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { BarChart } from "react-native-chart-kit";
import RNHTMLtoPDF from "react-native-html-to-pdf";

import { auth, rtdb } from "../firebase/firebaseConfig";

const screenWidth = Dimensions.get("window").width;

export default function PerformanceDashboard() {
    const [results, setResults] = useState([]);
    const [quizMap, setQuizMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    /* ================= AUTH ================= */
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    useEffect(() => {
        if (user) fetchAllData();
    }, [user]);

    /* ================= FETCH DATA (RTDB ONLY) ================= */
    const fetchAllData = async () => {
        try {
            setLoading(true);

            /* QUIZZES */
            const quizSnap = await get(ref(rtdb, "quizzes"));
            const quizData = quizSnap.val() || {};
            const qMap = {};

            Object.entries(quizData).forEach(([qid, q]) => {
                qMap[qid] = q.title || "Quiz";
            });
            setQuizMap(qMap);

            /* RESULTS */
            const resultSnap = await get(ref(rtdb, "results"));
            const resultData = resultSnap.val() || {};

            const flat = [];
            Object.entries(resultData).forEach(([quizId, users]) => {
                Object.entries(users || {}).forEach(([uid, r]) => {
                    if (!r || r.total == null) return;

                    flat.push({
                        quizId,
                        userId: uid,
                        score: r.score || 0,
                        total: r.total || 0,
                        percentage: Math.round(
                            (r.score / r.total) * 100
                        ),
                        submittedAt: r.submittedAt || 0,
                    });
                });
            });

            flat.sort((a, b) => b.submittedAt - a.submittedAt);
            setResults(flat);
        } catch (e) {
            console.log("DASHBOARD ERROR:", e);
            Alert.alert("Error", "Failed to load performance data");
        } finally {
            setLoading(false);
        }
    };

    /* ================= STATS ================= */
    const totalAttempts = results.length;
    const averageScore =
        totalAttempts > 0
            ? Math.round(
                results.reduce((s, r) => s + r.percentage, 0) /
                totalAttempts
            )
            : 0;

    const topPerformers = [...results]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3);

    /* ================= TREND ================= */
    const trendData = {
        labels: results.slice(0, 6).map((_, i) => `T${i + 1}`),
        datasets: [{ data: results.slice(0, 6).map((r) => r.percentage) }],
    };

    /* ================= PDF ================= */
    const exportPDF = async () => {
        const html = `
        <h2>Quiz Performance Report</h2>
        <p>Total Attempts: ${totalAttempts}</p>
        <p>Average Score: ${averageScore}%</p>
        <hr/>
        ${results
                .map(
                    (r) => `
            <p>
            Student: ${r.userId}<br/>
            Quiz: ${quizMap[r.quizId]}<br/>
            Score: ${r.score}/${r.total} (${r.percentage}%)
            </p>`
                )
                .join("")}
        `;

        const file = await RNHTMLtoPDF.convert({
            html,
            fileName: "Quiz_Performance_Report",
            base64: false,
        });

        Alert.alert("PDF Generated", file.filePath);
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text>Loading dashboard...</Text>
            </View>
        );
    }

    /* ================= UI ================= */
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Performance Dashboard</Text>

            <TouchableOpacity style={styles.exportBtn} onPress={exportPDF}>
                <MaterialIcons name="download" size={18} color="#fff" />
                <Text style={{ color: "#fff", marginLeft: 6 }}>
                    Export PDF
                </Text>
            </TouchableOpacity>

            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <Text>Total Attempts</Text>
                    <Text style={styles.summaryValue}>{totalAttempts}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text>Average Score</Text>
                    <Text style={styles.summaryValue}>{averageScore}%</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>🏆 Top Performers</Text>
            {topPerformers.map((t, i) => (
                <View key={i} style={styles.topperCard}>
                    <Text style={styles.rank}>#{i + 1}</Text>
                    <View>
                        <Text style={styles.name}>
                            {t.userId}
                        </Text>
                        <Text style={styles.meta}>
                            {quizMap[t.quizId]} • {t.percentage}%
                        </Text>
                    </View>
                </View>
            ))}

            <Text style={styles.sectionTitle}>📈 Performance Trend</Text>
            <BarChart
                data={trendData}
                width={screenWidth - 40}
                height={220}
                fromZero
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: () => "#4f46e5",
                }}
            />
        </ScrollView>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
    },
    exportBtn: {
        flexDirection: "row",
        alignSelf: "flex-end",
        backgroundColor: "#4f46e5",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    summaryRow: { flexDirection: "row", marginBottom: 16 },
    summaryCard: {
        flex: 1,
        backgroundColor: "#fff",
        marginHorizontal: 4,
        padding: 12,
        borderRadius: 14,
        alignItems: "center",
    },
    summaryValue: { fontSize: 18, fontWeight: "bold" },
    topperCard: {
        flexDirection: "row",
        backgroundColor: "#fff7ed",
        padding: 12,
        borderRadius: 14,
        marginBottom: 6,
    },
    rank: {
        fontSize: 20,
        fontWeight: "bold",
        width: 40,
        color: "#f59e0b",
    },
    name: { fontSize: 15, fontWeight: "600" },
    meta: { fontSize: 12, color: "#6b7280" },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 10,
    },
});
