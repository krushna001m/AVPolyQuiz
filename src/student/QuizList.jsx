import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function QuizList({ navigation }) {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    /* ================= AUTH ================= */
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthLoading(false);
        });
        return unsub;
    }, []);

    /* ================= FETCH QUIZZES ================= */
    useEffect(() => {
        if (!authLoading && user) fetchQuizzes();
    }, [authLoading, user]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();

            const res = await axios.get(
                `${Firebase_Realtime_DB_URL}/quizzes.json`,
                { params: { auth: token } }
            );

            if (res.data) {
                const list = Object.entries(res.data)
                    .map(([id, q]) => ({ id, ...q }))
                    .filter(q => q.published === true);

                setQuizzes(list);
            } else {
                setQuizzes([]);
            }
        } catch (e) {
            console.log("FETCH QUIZ ERROR:", e);
            Alert.alert("Error", "Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Available Quizzes</Text>

            {quizzes.map((quiz) => (
                <TouchableOpacity
                    key={quiz.id}
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("QuizAttempt", {
                            quizId: quiz.id,
                            quizTitle: quiz.title,
                        })
                    }
                >
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizSub}>
                        {quiz.subject} • {quiz.timeLimit} min
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loading: { marginTop: 10, color: "#6b7280" },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#111827",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 2,
    },
    quizTitle: { fontSize: 17, fontWeight: "bold" },
    quizSub: { fontSize: 13, color: "#6b7280", marginTop: 4 },
});
