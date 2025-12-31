import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { saveData } from "../services/quizService";

export default function AddQuestions({ route }) {
    const { quizId } = route.params;

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState("");

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Question</Text>

            <Input placeholder="Question" onChangeText={setQuestion} />

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

            <PrimaryButton title="Save Question" onPress={handleSaveQuestion} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
});
