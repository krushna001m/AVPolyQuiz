import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getData } from "../services/quizService";

export default function PerformanceDashboard() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResults = async () => {
            try {
                const data = await getData("results");
                if (data) {
                    const list = Object.values(data);
                    setResults(list);
                } else {
                    setResults([]);
                }
            } catch (e) {
                console.log("RESULT LOAD ERROR:", e);
            } finally {
                setLoading(false);
            }
        };
        loadResults();
    }, []);

    const averageScore =
        results.length > 0
            ? Math.round(
                results.reduce((sum, item) => sum + (item.score || 0), 0) /
                results.length
            )
            : 0;

    const totalAttempts = results.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Performance Dashboard</Text>
            <Text style={styles.subtitle}>
                Track how your students are performing in different quizzes.
            </Text>

            {/* SUMMARY CARDS */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { backgroundColor: "#eef2ff" }]}>
                    <MaterialIcons name="groups" size={24} color="#4f46e5" />
                    <Text style={styles.summaryLabel}>Total Attempts</Text>
                    <Text style={styles.summaryValue}>{totalAttempts}</Text>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: "#ecfdf3" }]}>
                    <MaterialIcons name="insights" size={24} color="#16a34a" />
                    <Text style={styles.summaryLabel}>Average Score</Text>
                    <Text style={styles.summaryValue}>{averageScore}%</Text>
                </View>
            </View>

            {/* LIST */}
            <Text style={styles.sectionTitle}>Recent Results</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#4f46e5" />
            ) : results.length === 0 ? (
                <Text style={styles.emptyText}>
                    No results yet. Ask students to attempt quizzes.
                </Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={styles.quizTitle}>
                                    {item.quizTitle || `Quiz: ${item.quizId}`}
                                </Text>
                                <Text style={styles.scoreText}>{item.score}%</Text>
                            </View>

                            <View style={styles.metaRow}>
                                <Text style={styles.metaText}>
                                    Student: {item.studentName || "Unknown"}
                                </Text>
                                {item.submittedAt && (
                                    <Text style={styles.metaText}>
                                        {new Date(item.submittedAt).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#111827",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 18,
        textAlign: "center",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    summaryCard: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 16,
        padding: 12,
        alignItems: "flex-start",
    },
    summaryLabel: {
        marginTop: 6,
        fontSize: 12,
        color: "#4b5563",
    },
    summaryValue: {
        marginTop: 4,
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: "#111827",
    },
    card: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#ffffff",
        marginBottom: 10,
        elevation: 2,
    },
    quizTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    scoreText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#16a34a",
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    metaText: {
        fontSize: 12,
        color: "#6b7280",
    },
    emptyText: {
        marginTop: 20,
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
    },
});
