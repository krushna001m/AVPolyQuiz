import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { getData } from "../services/quizService";
import QuizCard from "../components/QuizCard";

export default function QuizList({ navigation }) {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        getData("quizzes").then((data) => {
            if (data) {
                const list = Object.entries(data)
                    .map(([id, quiz]) => ({ id, ...quiz }))
                    .filter(q => q.published);
                setQuizzes(list);
            }
        });
    }, []);

    if (!quizzes.length) {
        return <Text style={styles.empty}>No quizzes available</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={quizzes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <QuizCard
                        quiz={item}
                        onPress={() =>
                            navigation.navigate("QuizAttempt", { quizId: item.id })
                        }
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
