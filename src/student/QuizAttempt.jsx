import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getData, saveData } from "../services/quizService";

export default function QuizAttempt({ route, navigation }) {
    const { quizId } = route.params;

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        getData(`questions/${quizId}`).then((data) => {
            if (data) {
                setQuestions(Object.values(data));
            }
        });
    }, []);

    const handleAnswer = (index) => {
        if (index === questions[current].correctIndex) {
            setScore(score + 1);
        }

        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            saveData("results", {
                quizId,
                score: index === questions[current].correctIndex ? score + 1 : score,
                total: questions.length,
                submittedAt: Date.now(),
            });

            navigation.replace("ResultScreen", {
                score: index === questions[current].correctIndex ? score + 1 : score,
                total: questions.length,
            });
        }
    };

    if (!questions.length) {
        return <Text style={styles.loading}>Loading Questions...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.question}>
                Q{current + 1}. {questions[current].question}
            </Text>

            {questions[current].options.map((opt, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.option}
                    onPress={() => handleAnswer(i)}
                >
                    <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.progress}>
                Question {current + 1} / {questions.length}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    question: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
    option: {
        padding: 15,
        backgroundColor: "#e5e7eb",
        borderRadius: 10,
        marginBottom: 12,
    },
    optionText: { fontSize: 16 },
    progress: { textAlign: "center", marginTop: 20 },
    loading: { textAlign: "center", marginTop: 50 },
});
