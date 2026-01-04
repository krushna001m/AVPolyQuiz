import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
import { Firebase_Realtime_DB_URL } from "@env";

export default function ManageQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH QUIZZES ================= */
    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const token = await auth.currentUser.getIdToken();

            const res = await axios.get(
                `${Firebase_Realtime_DB_URL}/quizzes.json?auth=${token}`
            );

            if (res.data) {
                const list = Object.keys(res.data).map((key) => ({
                    id: key,
                    ...res.data[key],
                }));
                setQuizzes(list);
            } else {
                setQuizzes([]);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    /* ================= PUBLISH / UNPUBLISH ================= */
    const togglePublish = async (quizId, currentStatus) => {
        try {
            const token = await auth.currentUser.getIdToken();

            await axios.patch(
                `${Firebase_Realtime_DB_URL}/quizzes/${quizId}.json?auth=${token}`,
                { isPublished: !currentStatus }
            );

            fetchQuizzes();
        } catch (error) {
            Alert.alert("Error", "Failed to update quiz status");
        }
    };

    /* ================= DELETE QUIZ ================= */
    const deleteQuiz = async (quizId) => {
        Alert.alert(
            "Delete Quiz",
            "Are you sure you want to delete this quiz?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await auth.currentUser.getIdToken();

                            await axios.delete(
                                `${Firebase_Realtime_DB_URL}/quizzes/${quizId}.json?auth=${token}`
                            );

                            fetchQuizzes();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete quiz");
                        }
                    },
                },
            ]
        );
    };

    /* ================= RENDER ITEM ================= */
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subText}>Subject: {item.subject}</Text>
                <Text style={styles.subText}>
                    Status:{" "}
                    <Text style={{ color: item.isPublished ? "green" : "red" }}>
                        {item.isPublished ? "Published" : "Unpublished"}
                    </Text>
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => togglePublish(item.id, item.isPublished)}
                >
                    <MaterialIcons
                        name={item.isPublished ? "visibility-off" : "visibility"}
                        size={26}
                        color="#007AFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteQuiz(item.id)}>
                    <MaterialIcons name="delete" size={26} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    /* ================= UI ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Quizzes</Text>

            {quizzes.length === 0 ? (
                <Text style={styles.empty}>No quizzes available</Text>
            ) : (
                <FlatList
                    data={quizzes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    subText: {
        fontSize: 13,
        color: "#555",
        marginTop: 2,
    },
    actions: {
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#777",
    },
});
