import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";

import Input from "../components/Input";
import { saveData } from "../services/quizService";

export default function AddQuestions({ route }) {
    const { quizId } = route.params;

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState("");

    /* 🔹 SAVE SINGLE QUESTION */
    const handleSaveQuestion = async () => {
        if (!question || options.some(o => !o) || correctIndex === "") {
            Alert.alert("Error", "Fill all fields");
            return;
        }

        await saveData(`questions/${quizId}`, {
            question,
            options,
            correctIndex: Number(correctIndex),
        });

        Alert.alert("Success", "Question added");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex("");
    };

    /* 🔹 UPLOAD JSON FILE (RN 0.83 SAFE) */
    const handleUploadJSON = async () => {
        try {
            const res = await launchImageLibrary({
                mediaType: "mixed",
            });

            if (res.didCancel || !res.assets?.length) return;

            const file = res.assets[0];

            if (!file.fileName?.endsWith(".json")) {
                Alert.alert("Invalid File", "Please upload a .json file");
                return;
            }

            const fileContent = await RNFS.readFile(file.uri, "utf8");
            const questions = JSON.parse(fileContent);

            if (!Array.isArray(questions)) {
                Alert.alert("Invalid JSON", "JSON must be an array of questions");
                return;
            }

            let count = 0;

            for (let q of questions) {
                if (
                    !q.question ||
                    !Array.isArray(q.options) ||
                    q.options.length !== 4 ||
                    typeof q.correctIndex !== "number"
                ) {
                    Alert.alert(
                        "Invalid MCQ Format",
                        "Each question must have question, 4 options, correctIndex"
                    );
                    return;
                }

                await saveData(`questions/${quizId}`, q);
                count++;
            }

            Alert.alert(
                "Success",
                `${count} questions uploaded successfully`
            );

        } catch (error) {
            console.log("JSON UPLOAD ERROR:", error);
            Alert.alert("Error", "Failed to upload JSON file");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Questions</Text>

            {/* 🔹 MANUAL ENTRY */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Manual Entry</Text>

                <Input
                    placeholder="Question"
                    value={question}
                    onChangeText={setQuestion}
                />

                {options.map((opt, index) => (
                    <Input
                        key={index}
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
                    placeholder="Correct Option Index (0–3)"
                    keyboardType="numeric"
                    value={correctIndex}
                    onChangeText={setCorrectIndex}
                />

                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSaveQuestion}
                >
                    <MaterialIcons name="save" size={22} color="#fff" />
                    <Text style={styles.btnText}>Save Question</Text>
                </TouchableOpacity>
            </View>

            {/* 🔹 AUTO UPLOAD */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Auto Upload MCQs</Text>

                <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={handleUploadJSON}
                >
                    <MaterialIcons
                        name="upload-file"
                        size={22}
                        color="#4f46e5"
                    />
                    <Text style={styles.uploadText}>Upload JSON File</Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>
                    JSON format:
                    {"\n"}[
                    {"\n"}  {"{"}
                    {"\n"}    "question": "2+2?",
                    {"\n"}    "options": ["1","2","3","4"],
                    {"\n"}    "correctIndex": 3
                    {"\n"}  {"}"}
                    {"\n"}]
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
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
    },

    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
        alignItems: "center",
        justifyContent: "center",
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

    helpText: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 10,
        textAlign: "center",
    },
});
