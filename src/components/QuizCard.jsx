import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuizCard({ quiz, onPress }) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View>
                <Text style={styles.title}>{quiz.title}</Text>
                <Text style={styles.subject}>📘 {quiz.subject}</Text>

                <View style={styles.meta}>
                    <Text style={styles.metaText}>
                        ⏱ {quiz.timeLimit} min
                    </Text>
                    {quiz.totalMarks && (
                        <Text style={styles.metaText}>
                            🧮 {quiz.totalMarks} marks
                        </Text>
                    )}
                </View>

                {quiz.published !== undefined && (
                    <Text
                        style={[
                            styles.status,
                            quiz.published ? styles.live : styles.draft,
                        ]}
                    >
                        {quiz.published ? "LIVE" : "DRAFT"}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    subject: {
        fontSize: 14,
        color: "#374151",
        marginVertical: 6,
    },
    meta: {
        flexDirection: "row",
        marginTop: 6,
    },
    metaText: {
        fontSize: 13,
        color: "#6b7280",
        marginRight: 14,
    },
    status: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: "bold",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    live: {
        backgroundColor: "#dcfce7",
        color: "#166534",
    },
    draft: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
    },
});
