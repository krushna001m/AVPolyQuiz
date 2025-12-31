import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { saveData } from "../services/quizService";

export default function CreateQuiz({ navigation }) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [timeLimit, setTimeLimit] = useState("");

    const handleCreateQuiz = async () => {
        if (!title || !subject || !timeLimit) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        const res = await saveData("quizzes", {
            title,
            subject,
            timeLimit,
            createdAt: Date.now(),
            published: true,
        });

        navigation.navigate("AddQuestions", { quizId: res.name });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Quiz</Text>

            <Input placeholder="Quiz Title" onChangeText={setTitle} />
            <Input placeholder="Subject" onChangeText={setSubject} />
            <Input
                placeholder="Time Limit (minutes)"
                keyboardType="numeric"
                onChangeText={setTimeLimit}
            />

            <PrimaryButton title="Next → Add Questions" onPress={handleCreateQuiz} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
