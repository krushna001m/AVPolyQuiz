import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function AnswerReview({ route, navigation }) {
    const { answers = [], quizTitle } = route.params;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Answer Review</Text>
                <View style={{ width: 24 }} />
            </View>

            {quizTitle && (
                <Text style={styles.quizTitle}>{quizTitle}</Text>
            )}

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {answers.map((item, qIndex) => {
                    const isCorrect =
                        item.selectedIndex === item.correctIndex;

                    return (
                        <View key={qIndex} style={styles.questionCard}>
                            {/* QUESTION */}
                            <View style={styles.questionRow}>
                                <Text style={styles.qNo}>
                                    Q{qIndex + 1}.
                                </Text>
                                <Text style={styles.questionText}>
                                    {item.question}
                                </Text>
                            </View>

                            {/* OPTIONS */}
                            {item.options.map((opt, optIndex) => {
                                const isSelected =
                                    optIndex === item.selectedIndex;
                                const isAnswer =
                                    optIndex === item.correctIndex;

                                let bgColor = "#f3f4f6";
                                let borderColor = "#d1d5db";
                                let icon = null;
                                let iconColor = "#6b7280";

                                if (isSelected && isCorrect) {
                                    bgColor = "#dcfce7";
                                    borderColor = "#16a34a";
                                    icon = "check-circle";
                                    iconColor = "#16a34a";
                                } else if (isSelected && !isCorrect) {
                                    bgColor = "#fee2e2";
                                    borderColor = "#dc2626";
                                    icon = "cancel";
                                    iconColor = "#dc2626";
                                } else if (isAnswer) {
                                    bgColor = "#eef2ff";
                                    borderColor = "#4f46e5";
                                    icon = "check";
                                    iconColor = "#4f46e5";
                                }

                                return (
                                    <View
                                        key={optIndex}
                                        style={[
                                            styles.option,
                                            {
                                                backgroundColor: bgColor,
                                                borderColor: borderColor,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.optionText}>
                                            {opt}
                                        </Text>

                                        {icon && (
                                            <MaterialIcons
                                                name={icon}
                                                size={20}
                                                color={iconColor}
                                            />
                                        )}
                                    </View>
                                );
                            })}

                            {/* STATUS */}
                            <View style={styles.statusRow}>
                                <MaterialIcons
                                    name={
                                        isCorrect
                                            ? "check-circle"
                                            : "cancel"
                                    }
                                    size={18}
                                    color={
                                        isCorrect
                                            ? "#16a34a"
                                            : "#dc2626"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: isCorrect
                                                ? "#16a34a"
                                                : "#dc2626",
                                        },
                                    ]}
                                >
                                    {isCorrect
                                        ? "Correct Answer"
                                        : "Wrong Answer"}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#ffffff",
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    quizTitle: {
        textAlign: "center",
        fontSize: 14,
        color: "#4b5563",
        marginVertical: 6,
    },
    questionCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 2,
    },
    questionRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    qNo: {
        fontWeight: "bold",
        marginRight: 6,
        color: "#111827",
    },
    questionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        flex: 1,
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 14,
        color: "#111827",
        flex: 1,
        marginRight: 10,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "bold",
        marginLeft: 6,
    },
});
