import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
    Modal,
} from "react-native";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function QuizList({ navigation }) {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [teacherModal, setTeacherModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teachers, setTeachers] = useState({});


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

            if (!res.data) {
                setQuizzes([]);
                return;
            }

            const quizList = Object.entries(res.data)
                .map(([id, q]) => ({ id, ...q }))
                .filter(q => q.isPublished === true);

            setQuizzes(quizList);

            // 🔥 FETCH TEACHERS
            const teacherIds = [...new Set(quizList.map(q => q.createdBy))];

            const teacherData = {};

            for (let uid of teacherIds) {
                if (!uid) continue;

                const tRes = await axios.get(
                    `${Firebase_Realtime_DB_URL}/users/${uid}.json`,
                    { params: { auth: token } }
                );

                if (tRes.data) {
                    teacherData[uid] = tRes.data;
                }
            }

            setTeachers(teacherData);
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
                <Text style={styles.loading}>Loading quizzes...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Available Quizzes</Text>

                {quizzes.map((quiz) => (
                    <View key={quiz.id} style={styles.card}>
                        {/* QUIZ INFO */}
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("QuizAttempt", {
                                    quizId: quiz.id,
                                    quizTitle: quiz.title,
                                })
                            }
                        >
                            <Text style={styles.quizTitle}>{quiz.title}</Text>

                            <View style={styles.row}>
                                <MaterialIcons name="book" size={16} color="#4f46e5" />
                                <Text style={styles.quizSub}>{quiz.subject}</Text>
                            </View>

                            <View style={styles.row}>
                                <MaterialIcons name="timer" size={16} color="#4f46e5" />
                                <Text style={styles.quizSub}>
                                    {quiz.timeLimit} min
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* TEACHER INFO */}
                        {quiz.createdBy && teachers[quiz.createdBy] && (
                            <TouchableOpacity
                                style={styles.teacherRow}
                                onPress={() => {
                                    setSelectedTeacher(teachers[quiz.createdBy]);
                                    setTeacherModal(true);
                                }}
                            >
                                <MaterialIcons name="person" size={18} color="#111827" />
                                <Text style={styles.teacherName}>
                                    {teachers[quiz.createdBy].name}
                                </Text>
                                <MaterialIcons name="info-outline" size={18} color="#6b7280" />
                            </TouchableOpacity>
                        )}

                    </View>
                ))}
            </ScrollView>

            {/* ================= TEACHER MODAL ================= */}
            <Modal
                visible={teacherModal}
                transparent
                animationType="slide"
                onRequestClose={() => setTeacherModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <MaterialIcons
                            name="account-circle"
                            size={80}
                            color="#4f46e5"
                        />

                        <Text style={styles.modalName}>
                            {selectedTeacher?.name}
                        </Text>

                        <Text style={styles.modalText}>
                            📧 {selectedTeacher?.email || "Not provided"}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setTeacherModal(false)}
                        >
                            <MaterialIcons name="close" size={20} color="#fff" />
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading: {
        marginTop: 10,
        color: "#6b7280",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#111827",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
        elevation: 3,
    },
    quizTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    quizSub: {
        fontSize: 13,
        color: "#6b7280",
        marginLeft: 6,
    },
    teacherRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },
    teacherName: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },

    /* MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalCard: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
    },
    modalName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: "#111827",
    },
    modalText: {
        fontSize: 14,
        color: "#4b5563",
        marginTop: 6,
    },
    closeBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginTop: 20,
    },
    closeText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 6,
    },
});
