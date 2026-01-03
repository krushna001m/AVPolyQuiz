import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function QuizAttempt({ route, navigation }) {
    const { quizId, quizTitle } = route.params;

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH QUESTIONS ================= */
    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Auth Error", "User not logged in");
                return;
            }

            const token = await user.getIdToken();

            const res = await axios.get(
                `${Firebase_Realtime_DB_URL}/questions/${quizId}.json`,
                { params: { auth: token } }
            );

            if (res.data) {
                const list = Object.values(res.data);
                setQuestions(list);
            } else {
                setQuestions([]);
            }
        } catch (e) {
            console.log("FETCH QUESTIONS ERROR:", e);
            Alert.alert("Error", "Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    /* ================= HANDLE ANSWER ================= */
    const handleAnswer = async (index) => {
        const isCorrect = index === questions[current].correctIndex;
        const updatedScore = isCorrect ? score + 1 : score;

        if (current + 1 < questions.length) {
            setScore(updatedScore);
            setCurrent(current + 1);
        } else {
            await submitResult(updatedScore);
        }
    };

    /* ================= SAVE RESULT ================= */
    const submitResult = async (finalScore) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();

            await axios.put(
                `${Firebase_Realtime_DB_URL}/results/${quizId}/${user.uid}.json`,
                {
                    quizId,
                    score: finalScore,
                    total: questions.length,
                    submittedAt: Date.now(),
                },
                { params: { auth: token } }
            );

            navigation.replace("ResultScreen", {
                score: finalScore,
                total: questions.length,
            });
        } catch (e) {
            console.log("SAVE RESULT ERROR:", e);
            Alert.alert("Error", "Failed to submit quiz");
        }
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading Questions...</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.center}>
                <Text>No questions available</Text>
            </View>
        );
    }

    const q = questions[current];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{quizTitle}</Text>

            <Text style={styles.question}>
                Q{current + 1}. {q.question}
            </Text>

            {q.options.map((opt, i) => (
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

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    option: {
        padding: 15,
        backgroundColor: "#e5e7eb",
        borderRadius: 10,
        marginBottom: 12,
    },
    optionText: { fontSize: 16 },
    progress: {
        textAlign: "center",
        marginTop: 20,
        color: "#6b7280",
    },
});
