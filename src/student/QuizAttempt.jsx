import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { auth } from "../firebase/firebaseConfig";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function QuizAttempt({ route, navigation }) {
    const { quizId, quizTitle } = route.params; // ❌ removed timeLimit from params

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    const [answers, setAnswers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [locked, setLocked] = useState(false);

    /* ================= TIMER ================= */
    const [timeLeft, setTimeLeft] = useState(null); // ⬅ null initially
    const timerRef = useRef(null);

    /* ================= FETCH QUIZ + QUESTIONS ================= */
    useEffect(() => {
        loadQuizAndQuestions();
        return () => clearInterval(timerRef.current);
    }, []);

    const loadQuizAndQuestions = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Auth Error", "User not logged in");
                return;
            }

            const token = await user.getIdToken(true);

            /* ---------- FETCH QUIZ (TIME LIMIT) ---------- */
            const quizRes = await axios.get(
                `${Firebase_Realtime_DB_URL}/quizzes/${quizId}.json`,
                { params: { auth: token } }
            );

            if (!quizRes.data?.timeLimit) {
                Alert.alert("Error", "Quiz time limit not found");
                return;
            }

            const totalSeconds = quizRes.data.timeLimit * 60;
            setTimeLeft(totalSeconds);

            /* ---------- START TIMER AFTER TIME SET ---------- */
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        autoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            /* ---------- FETCH QUESTIONS ---------- */
            const qRes = await axios.get(
                `${Firebase_Realtime_DB_URL}/questions/${quizId}.json`,
                { params: { auth: token } }
            );

            setQuestions(qRes.data ? Object.values(qRes.data) : []);

        } catch (e) {
            console.log("LOAD QUIZ ERROR:", e);
            Alert.alert("Error", "Failed to load quiz");
        } finally {
            setLoading(false);
        }
    };

    /* ================= HANDLE ANSWER ================= */
    const handleAnswer = (index) => {
        if (locked || timeLeft <= 0) return;

        const q = questions[current];
        setSelectedIndex(index);
        setLocked(true);

        const isCorrect = index === q.correctIndex;
        const updatedScore = isCorrect ? score + 1 : score;

        const answerObj = {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            selectedIndex: index,
            isCorrect,
        };

        setAnswers((prev) => [...prev, answerObj]);

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setScore(updatedScore);
                setCurrent(current + 1);
                setSelectedIndex(null);
                setLocked(false);
            } else {
                submitResult(updatedScore, [...answers, answerObj]);
            }
        }, 600);
    };

    /* ================= AUTO SUBMIT ================= */
    const autoSubmit = async () => {
        setLocked(true);

        const unanswered = questions.length - answers.length;

        await submitResult(score, [
            ...answers,
            ...Array(unanswered).fill({
                skipped: true,
                isCorrect: false,
            }),
        ]);
    };

    /* ================= SAVE RESULT ================= */
    const submitResult = async (finalScore, finalAnswers) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken(true);

            await axios.put(
                `${Firebase_Realtime_DB_URL}/results/${quizId}/${user.uid}.json`,
                {
                    quizId,
                    score: finalScore,
                    total: questions.length,
                    answers: finalAnswers,
                    submittedAt: Date.now(),
                },
                { params: { auth: token } }
            );

            navigation.replace("ResultScreen", {
                score: finalScore,
                total: questions.length,
                answers: finalAnswers,
                quizId,
                quizTitle,
            });
        } catch (e) {
            Alert.alert("Error", "Failed to submit quiz");
        }
    };

    /* ================= HELPERS ================= */
    const formatTime = () => {
        if (timeLeft === null) return "--:--";
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    /* ================= LOADING ================= */
    if (loading || timeLeft === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text>Loading Quiz...</Text>
            </View>
        );
    }

    const q = questions[current];
    const danger = timeLeft <= 30;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>{quizTitle}</Text>

                <View
                    style={[
                        styles.timerBox,
                        { backgroundColor: danger ? "#fee2e2" : "#eef2ff" },
                    ]}
                >
                    <MaterialIcons
                        name="timer"
                        size={18}
                        color={danger ? "#dc2626" : "#4f46e5"}
                    />
                    <Text
                        style={[
                            styles.timerText,
                            { color: danger ? "#dc2626" : "#4f46e5" },
                        ]}
                    >
                        {formatTime()}
                    </Text>
                </View>
            </View>

            {/* QUESTION */}
            <Text style={styles.question}>
                Q{current + 1}. {q.question}
            </Text>

            {/* OPTIONS */}
            {q.options.map((opt, i) => {
                const isSelected = selectedIndex === i;
                const isCorrect = i === q.correctIndex;

                let bg = "#e5e7eb";
                if (locked && isSelected) {
                    bg = isCorrect ? "#bbf7d0" : "#fecaca";
                }

                return (
                    <TouchableOpacity
                        key={i}
                        style={[styles.option, { backgroundColor: bg }]}
                        onPress={() => handleAnswer(i)}
                        disabled={locked}
                    >
                        <Text style={styles.optionText}>{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: "bold", color: "#111827", flex: 1 },
    timerBox: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    timerText: { marginLeft: 6, fontWeight: "bold" },
    question: { fontSize: 18, fontWeight: "bold", marginVertical: 20 },
    option: { padding: 16, borderRadius: 14, marginBottom: 12 },
    optionText: { fontSize: 16, color: "#111827" },
});
