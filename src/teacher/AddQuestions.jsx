import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function AddQuestions({ route }) {
    const { quizId } = route.params;

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState("");

    /* ================= SAVE QUESTION ================= */
    const saveQuestionData = async (questionData) => {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const token = await user.getIdToken();
        const id = Date.now();

        await axios.put(
            `${Firebase_Realtime_DB_URL}/questions/${quizId}/${id}.json`,
            {
                ...questionData,
                quizId,
                createdBy: user.uid,
                createdAt: Date.now(),
            },
            { params: { auth: token } }
        );
    };

    /* ================= MANUAL SAVE ================= */
    const handleSaveQuestion = async () => {
        if (!question.trim() || options.some(o => !o.trim()) || !correctIndex) {
            Alert.alert("Error", "Fill all fields");
            return;
        }

        const idx = Number(correctIndex);
        if (isNaN(idx) || idx < 1 || idx > 4) {
            Alert.alert("Error", "Correct option index must be between 1 and 4");
            return;
        }

        try {
            await saveQuestionData({
                question: question.trim(),
                options,
                correctIndex: idx - 1, // ✅ CONVERT TO 0-BASED
            });

            Alert.alert("Success", "Question added");

            setQuestion("");
            setOptions(["", "", "", ""]);
            setCorrectIndex("");
        } catch (e) {
            console.log("SAVE QUESTION ERROR:", e);
            Alert.alert("Error", "Failed to save question");
        }
    };

    /* ================= JSON UPLOAD ================= */
    const handleUploadJSON = async () => {
        try {
            const res = await launchImageLibrary({ mediaType: "mixed" });
            if (res.didCancel || !res.assets?.length) return;

            const file = res.assets[0];

            if (!file.fileName?.endsWith(".json")) {
                Alert.alert("Invalid File", "Upload a .json file");
                return;
            }

            const content = await RNFS.readFile(file.uri, "utf8");
            const questions = JSON.parse(content);

            if (!Array.isArray(questions)) {
                Alert.alert("Invalid JSON", "JSON must be an array");
                return;
            }

            for (let q of questions) {
                if (
                    !q.question ||
                    !Array.isArray(q.options) ||
                    q.options.length !== 4 ||
                    typeof q.correctIndex !== "number" ||
                    q.correctIndex < 1 ||
                    q.correctIndex > 4
                ) {
                    Alert.alert(
                        "Invalid Format",
                        "Each question must have 4 options & correctIndex (1–4)"
                    );
                    return;
                }
            }

            for (let q of questions) {
                await saveQuestionData({
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correctIndex - 1, // ✅ FIX
                });
            }

            Alert.alert("Success", "Questions uploaded successfully");
        } catch (e) {
            console.log("JSON UPLOAD ERROR:", e);
            Alert.alert("Error", "Failed to upload JSON");
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.title}>Add Questions</Text>

            {/* MANUAL ENTRY */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Manual Entry</Text>

                <Input
                    label="Question"
                    placeholder="Type your question"
                    value={question}
                    onChangeText={setQuestion}
                    multiline
                />

                {options.map((opt, index) => (
                    <Input
                        key={index}
                        label={`Option ${index + 1}`}
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        onChangeText={(text) => {
                            const updated = [...options];
                            updated[index] = text;
                            setOptions(updated);
                        }}
                    />
                ))}

                <Input
                    label="Correct option index (1–4)"
                    placeholder="1, 2, 3 or 4"
                    keyboardType="numeric"
                    value={correctIndex}
                    onChangeText={setCorrectIndex}
                />

                <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveQuestion}>
                    <MaterialIcons name="save" size={20} color="#fff" />
                    <Text style={styles.btnText}>Save Question</Text>
                </TouchableOpacity>
            </View>

            {/* JSON UPLOAD */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Auto Upload MCQs</Text>

                <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadJSON}>
                    <MaterialIcons name="cloud-upload" size={20} color="#4f46e5" />
                    <Text style={styles.uploadText}>Upload JSON File</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ================= INPUT ================= */
function Input({ label, ...props }) {
    return (
        <View style={{ marginBottom: 12 }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    {...props}
                />
            </View>
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "#111827",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#111827",
    },
    label: {
        fontSize: 13,
        color: "#374151",
        marginBottom: 4,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#f9fafb",
    },
    input: {
        fontSize: 14,
        color: "#111827",
    },
    primaryBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    },
    uploadBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4f46e5",
        paddingVertical: 14,
        borderRadius: 12,
    },
    uploadText: {
        color: "#4f46e5",
        fontWeight: "bold",
        marginLeft: 8,
    },
});
