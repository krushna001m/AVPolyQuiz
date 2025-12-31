import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getData } from "../services/quizService";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getData("notifications").then((data) => {
            if (data) {
                setNotifications(Object.values(data).reverse());
            }
        });
    }, []);

    if (!notifications.length) {
        return <Text style={styles.empty}>No notifications</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.message}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        marginBottom: 10,
    },
    title: { fontWeight: "bold", marginBottom: 5 },
    empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
