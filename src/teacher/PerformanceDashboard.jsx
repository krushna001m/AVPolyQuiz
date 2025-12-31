import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getData } from "../services/quizService";

export default function PerformanceDashboard() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        getData("results").then((data) => {
            if (data) {
                const list = Object.values(data);
                setResults(list);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Performance Dashboard</Text>

            <FlatList
                data={results}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Quiz ID: {item.quizId}</Text>
                        <Text>Score: {item.score}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        marginBottom: 10,
    },
});
