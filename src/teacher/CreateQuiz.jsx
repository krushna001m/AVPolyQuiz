import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { saveData } from "../services/quizService";

export default function CreateQuiz({ navigation }) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [timeLimit, setTimeLimit] = useState("");

    const handleCreateQuiz = async () => {
        if (!title.trim() || !subject.trim() || !timeLimit.trim()) {
            Alert.alert("Validation Error", "All fields are required");
            return;
        }

        if (isNaN(timeLimit) || Number(timeLimit) <= 0) {
            Alert.alert("Validation Error", "Enter valid time in minutes");
            return;
        }

        const res = await saveData("quizzes", {
            title: title.trim(),
            subject: subject.trim(),
            timeLimit: Number(timeLimit),
            createdAt: Date.now(),
            published: true,
        });

        navigation.navigate("AddQuestions", { quizId: res.name });
    };

    return (
        <View style={styles.container}>
            {/* 🔹 HEADER */}
            <Text style={styles.title}>Create New Quiz</Text>
            <Text style={styles.subtitle}>
                Enter quiz details before adding questions
            </Text>

            {/* 🔹 FORM CARD */}
            <View style={styles.card}>
                <InputField
                    icon="title"
                    placeholder="Quiz Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <InputField
                    icon="menu-book"
                    placeholder="Subject"
                    value={subject}
                    onChangeText={setSubject}
                />

                <InputField
                    icon="timer"
                    placeholder="Time Limit (minutes)"
                    value={timeLimit}
                    onChangeText={setTimeLimit}
                    keyboardType="numeric"
                />
            </View>

            {/* 🔹 ACTION BUTTON */}
            <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleCreateQuiz}
            >
                <MaterialIcons
                    name="arrow-forward"
                    size={22}
                    color="#ffffff"
                />
                <Text style={styles.nextText}>
                    Next • Add Questions
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* 🔹 INPUT WITH ICON */
function InputField({ icon, ...props }) {
    return (
        <View style={styles.inputWrapper}>
            <MaterialIcons
                name={icon}
                size={22}
                color="#4f46e5"
                style={{ marginRight: 10 }}
            />
            <Text
                style={{ display: "none" }}
            />
            <TextInput
                {...props}
                style={styles.input}
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
}

import { TextInput } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
    },

    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 20,
        marginTop: 4,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 18,
        elevation: 3,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: "#111827",
    },

    nextBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 420,
        elevation: 3,
    },

    nextText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
