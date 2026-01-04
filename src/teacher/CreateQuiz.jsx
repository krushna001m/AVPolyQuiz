import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const Firebase_Realtime_DB_URL = "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";


export default function CreateQuiz({ navigation }) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateQuiz = async () => {
        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Auth Error", "User not logged in");
                return;
            }

            const token = await user.getIdToken();

            const quizId =
                "quiz_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

            const quizData = {
                title: title.trim(),
                subject: subject.trim(),
                timeLimit: Number(timeLimit),
                createdAt: Date.now(),
                createdBy: user.uid,
                isPublished: true,
            };

            await axios.put(
                `${Firebase_Realtime_DB_URL}/quizzes/${quizId}.json`,
                quizData,
                {
                    params: { auth: token },
                }
            );

            navigation.navigate("AddQuestions", { quizId });

        } catch (error) {
            console.log("CREATE QUIZ ERROR:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#f9fafb" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Create New Quiz</Text>
                <Text style={styles.subtitle}>
                    Enter quiz details before adding questions for your students.
                </Text>

                <View style={styles.card}>
                    <InputField
                        icon="assignment"
                        placeholder="Quiz title (e.g. Unit Test 1)"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <InputField
                        icon="menu-book"
                        placeholder="Subject / Topic"
                        value={subject}
                        onChangeText={setSubject}
                    />
                    <InputField
                        icon="timer"
                        placeholder="Time limit in minutes"
                        keyboardType="numeric"
                        value={timeLimit}
                        onChangeText={setTimeLimit}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.nextBtn, loading && { opacity: 0.7 }]}
                    activeOpacity={0.9}
                    onPress={handleCreateQuiz}
                    disabled={loading}
                >
                    <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                    <Text style={styles.nextText}>
                        {loading ? "Creating..." : "Next • Add Questions"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function InputField({ icon, ...props }) {
    return (
        <View style={styles.inputWrapper}>
            <MaterialIcons
                name={icon}
                size={20}
                color="#6b7280"
                style={{ marginRight: 8 }}
            />
            <TextInput
                placeholderTextColor="#9ca3af"
                style={styles.input}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginTop: 10,
        marginBottom: 6,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 20,
        textAlign: "center",
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
        paddingVertical: 10,
        marginBottom: 16,
        backgroundColor: "#f9fafb",
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
        marginTop: 24,
        elevation: 3,
    },
    nextText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
